import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import crypto from "crypto";
import type { IDependencies } from "./dependencies";
import {
  insertJobSchema,
  insertJobApplicationSchema,
  insertMessageSchema,
  insertPaymentSchema
} from "@shared/schema";
import { ensureAuthenticated, ensureRole, AuthenticatedRequest } from "./middleware/auth.middleware";
import { logger } from "./lib/logger";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  BusinessRuleError,
  ConflictError,
  ExternalServiceError
} from "./errors/AppError";

// Validation schemas for PATCH endpoints
const updateStatusSchema = z.object({
  status: z.string().min(1),
});

const updateMessageReadSchema = z.object({
  isRead: z.boolean().optional().default(true),
});

const assignWorkerSchema = z.object({
  workerId: z.string(),
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function registerRoutes(app: Express, dependencies: IDependencies): Promise<Server> {
  const { storage, paymentClient, paymentConfig } = dependencies;
  
  // Health check endpoint for load balancers and monitoring
  app.get("/api/health", async (_req, res) => {
    try {
      // Check database connectivity
      await storage.getJobs({ status: "open" });
      res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      // Log health check failure for monitoring and debugging
      // Better error serialization to avoid generic [object Object]
      const serializedError = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : typeof error === 'object'
          ? JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
          : { message: String(error) };
      logger.error("Health check failed - Database connectivity issue", {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        error: serializedError
      });

      res.status(503).json({
        status: "unhealthy",
        error: "Database connection failed",
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { workType, location, status = "open" } = req.query;
      const jobs = await storage.getJobs({
        workType: workType as string,
        location: location as string,
        status: status as string,
      });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Create job - employers only
  app.post("/api/jobs", ensureAuthenticated, ensureRole('employer'), async (req: AuthenticatedRequest, res, next) => {
    try {
      const parsed = insertJobSchema.parse(req.body);
      const job = await storage.createJob({
        ...parsed,
        employerId: req.user!.id // Use authenticated user ID
      });

      logger.info('Job created', { jobId: job.id, employerId: req.user!.id });
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  });

  // Update job status - employer only (their own jobs)
  app.patch("/api/jobs/:id/status", ensureAuthenticated, ensureRole('employer'), async (req: AuthenticatedRequest, res, next) => {
    try {
      const { status } = updateStatusSchema.parse(req.body);

      // Verify job belongs to employer
      const existingJob = await storage.getJob(req.params.id);
      if (!existingJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      if (existingJob.employerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only update your own jobs" });
      }

      const job = await storage.updateJobStatus(req.params.id, status);
      logger.info('Job status updated', { jobId: req.params.id, newStatus: status });
      res.json(job);
    } catch (error) {
      next(error);
    }
  });

  // Job Application routes
  app.get("/api/jobs/:jobId/applications", ensureAuthenticated, ensureRole('employer'), async (req: AuthenticatedRequest, res) => {
    try {
      // Verify employer can only see applications for their own jobs
      const job = await storage.getJob(req.params.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      if (job.employerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only view applications for your own jobs" });
      }

      const applications = await storage.getApplicationsForJob(req.params.jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/workers/:workerId/applications", ensureAuthenticated, ensureRole('worker'), async (req: AuthenticatedRequest, res) => {
    try {
      // Workers can only view their own applications
      if (req.params.workerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only view your own applications" });
      }

      const applications = await storage.getApplicationsForWorker(req.params.workerId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Create application - workers only
  app.post("/api/applications", ensureAuthenticated, ensureRole('worker'), async (req: AuthenticatedRequest, res, next) => {
    try {
      const parsed = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createApplication({
        ...parsed,
        workerId: req.user!.id // Use authenticated user ID
      });

      logger.info('Application created', { applicationId: application.id, jobId: parsed.jobId });
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/applications/:id/status", ensureAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { status } = updateStatusSchema.parse(req.body);

      // Get the application to verify permissions
      const application = await storage.getApplicationById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Get job details for authorization
      const job = await storage.getJob(application.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Authorization check: only job employer or application worker can update status
      const canUpdate = (req.user!.role === 'employer' && job.employerId === req.user!.id) ||
                       (req.user!.role === 'worker' && application.workerId === req.user!.id);

      if (!canUpdate) {
        return res.status(403).json({ message: "You can only update applications for your own jobs or applications" });
      }

      // Additional business logic: Only employers can accept/reject, only workers can withdraw
      if (status === 'accepted' || status === 'rejected') {
        if (req.user!.role !== 'employer' || job.employerId !== req.user!.id) {
          return res.status(403).json({ message: "Only job employers can accept or reject applications" });
        }

        // If accepting, we need to assign the worker atomically
        if (status === 'accepted') {
          const result = await storage.acceptApplicationWithJobAssignment(
            req.params.id,
            application.jobId,
            application.workerId
          );
          if (!result) {
            return res.status(400).json({
              message: "Failed to accept application. The job may already be assigned or in incorrect state."
            });
          }
          return res.json(result.application);
        }
      } else if (status === 'withdrawn') {
        if (req.user!.role !== 'worker' || application.workerId !== req.user!.id) {
          return res.status(403).json({ message: "Only the applicant can withdraw their application" });
        }
      }

      const updatedApplication = await storage.updateApplicationStatus(req.params.id, status);
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(updatedApplication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", error: error.errors });
      }
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  // Job Assignment and Completion routes
  app.post("/api/jobs/:id/assign", ensureAuthenticated, ensureRole('employer'), async (req: AuthenticatedRequest, res) => {
    try {
      const { workerId } = assignWorkerSchema.parse(req.body);
      
      // Validate job exists and is in correct state
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Ensure employer can only assign workers to their own jobs
      if (job.employerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only assign workers to your own jobs" });
      }

      if (job.status !== "open") {
        return res.status(400).json({
          message: `Cannot assign worker to job with status '${job.status}'. Job must be 'open'.`
        });
      }
      
      if (job.assignedWorkerId) {
        return res.status(400).json({ 
          message: "Job already has an assigned worker" 
        });
      }
      
      // Validate worker exists
      const worker = await storage.getUser(workerId);
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }
      
      if (worker.role !== "worker") {
        return res.status(400).json({ 
          message: "User must have 'worker' role to be assigned to jobs" 
        });
      }
      
      // Assign worker to job
      const updatedJob = await storage.assignWorkerToJob(req.params.id, workerId);
      res.json(updatedJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", error: error.errors });
      }
      res.status(500).json({ message: "Failed to assign worker" });
    }
  });

  app.post("/api/jobs/:id/complete", ensureAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      // Validate job exists and is in correct state
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Authorization: Both employers and assigned workers can mark job as complete
      const canComplete = (req.user!.role === 'employer' && job.employerId === req.user!.id) ||
                         (req.user!.role === 'worker' && job.assignedWorkerId === req.user!.id);

      if (!canComplete) {
        return res.status(403).json({
          message: "You can only complete jobs you own or are assigned to"
        });
      }

      if (job.status !== "in_progress") {
        return res.status(400).json({
          message: `Cannot complete job with status '${job.status}'. Job must be 'in_progress'.`
        });
      }

      if (!job.assignedWorkerId) {
        return res.status(400).json({
          message: "Cannot complete job without an assigned worker"
        });
      }
      
      // Mark job as completed
      const updatedJob = await storage.markJobCompleted(req.params.id);
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark job as completed" });
    }
  });

  // Payment routes
  app.post("/api/payments/create-order", ensureAuthenticated, ensureRole('employer'), async (req: AuthenticatedRequest, res) => {
    try {
      const { jobId } = req.body;

      // Check if payment client is configured
      if (!paymentClient || !paymentConfig.keyId || !paymentConfig.keySecret) {
        return res.status(503).json({
          message: "Payment gateway not configured. Please configure Razorpay keys."
        });
      }

      // Get job details
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Ensure employer can only create payments for their own jobs
      if (job.employerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only create payments for your own jobs" });
      }

      if (job.status !== "awaiting_payment") {
        return res.status(400).json({ 
          message: "Job must be completed before payment can be initiated" 
        });
      }

      if (!job.assignedWorkerId) {
        return res.status(400).json({ 
          message: "Job must have an assigned worker before payment can be initiated" 
        });
      }

      // Check if payment already exists for this job
      const existingPayment = await storage.getPaymentForJob(jobId);
      if (existingPayment && existingPayment.status !== "failed") {
        return res.status(400).json({ 
          message: "Payment already exists for this job",
          paymentId: existingPayment.id,
          status: existingPayment.status
        });
      }

      // Create Razorpay order using injected payment client
      const order = await paymentClient.orders.create({
        amount: job.wage * 100, // Convert to paise
        currency: "INR",
        receipt: `job_${jobId}`,
      });

      // Create payment record
      const payment = await storage.createPayment({
        jobId,
        employerId: job.employerId,
        workerId: job.assignedWorkerId!,
        amount: job.wage * 100,
        currency: "INR",
        status: "pending",
        razorpayOrderId: order.id,
        paymentMethod: "razorpay",
        razorpayPaymentId: null,
        razorpaySignature: null,
        failureReason: null,
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
        keyId: paymentConfig.keyId
      });
    } catch (error) {
      logger.error("Payment creation error", { error });
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", ensureAuthenticated, ensureRole('employer'), async (req: AuthenticatedRequest, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentSchema.parse(req.body);

      // CRITICAL: Must have Razorpay secret key to verify signatures
      if (!paymentConfig.keySecret) {
        logger.error("Payment verification attempted without RAZORPAY_KEY_SECRET configured");
        return res.status(503).json({
          message: "Payment gateway not configured. Cannot verify payment."
        });
      }

      // Verify signature using HMAC SHA256
      const generatedSignature = crypto
        .createHmac("sha256", paymentConfig.keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        logger.warn("Payment verification failed: Invalid signature", {
          razorpayOrderId,
          razorpayPaymentId
        });
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      // Find payment by order ID using storage interface
      const payment = await storage.getPaymentByOrderId(razorpayOrderId);

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Ensure employer can only verify payments for their own jobs
      if (payment.employerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only verify payments for your own jobs" });
      }

      // Use atomic transaction to update both payment and job status
      // This ensures consistency even under database failures
      const result = await storage.completePaymentTransaction(
        payment.id,
        payment.jobId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!result) {
        return res.status(500).json({ 
          message: "Failed to complete payment transaction. The job may not be in the correct state or a database error occurred." 
        });
      }

      res.json({ success: true, payment: result.payment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", error: error.errors });
      }
      logger.error("Payment verification error", { error });
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.get("/api/payments/job/:jobId", ensureAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const payment = await storage.getPaymentForJob(req.params.jobId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Authorization: Only employer or assigned worker can view payment details
      if (payment.employerId !== req.user!.id && payment.workerId !== req.user!.id) {
        return res.status(403).json({ message: "You can only view payments for your own jobs" });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });

  // Message routes
  app.get("/api/messages/:userId1/:userId2", ensureAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { userId1, userId2 } = req.params;

      // Authorization: Users can only view conversations they are part of
      if (req.user!.id !== userId1 && req.user!.id !== userId2) {
        return res.status(403).json({ message: "You can only view your own conversations" });
      }

      const messages = await storage.getMessagesForConversation(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message - authenticated users only
  app.post("/api/messages", ensureAuthenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
      const parsed = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage({
        ...parsed,
        senderId: req.user!.id // Use authenticated user ID
      });

      logger.info('Message sent', { messageId: message.id, receiverId: parsed.receiverId });
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/messages/:id/read", ensureAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      updateMessageReadSchema.parse(req.body); // Validate request even though we don't use the value

      // Verify user can only mark their own received messages as read
      const message = await storage.getMessage(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      if (message.receiverId !== req.user!.id) {
        return res.status(403).json({ message: "You can only mark your own messages as read" });
      }

      await storage.markMessageAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", error: error.errors });
      }
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
