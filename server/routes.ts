import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { storage } from "./storage";
import { 
  insertJobSchema, 
  insertJobApplicationSchema, 
  insertMessageSchema, 
  insertPaymentSchema,
  type Payment 
} from "@shared/schema";

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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint for load balancers and monitoring
  app.get("/api/health", async (req, res) => {
    try {
      // Check database connectivity
      await storage.getJobs({ status: "open" });
      res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
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

  app.post("/api/jobs", async (req, res) => {
    try {
      const parsed = insertJobSchema.parse(req.body);
      const job = await storage.createJob(parsed);
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ message: "Invalid job data", error });
    }
  });

  app.patch("/api/jobs/:id/status", async (req, res) => {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const job = await storage.updateJobStatus(req.params.id, status);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", error: error.errors });
      }
      res.status(500).json({ message: "Failed to update job status" });
    }
  });

  // Job Application routes
  app.get("/api/jobs/:jobId/applications", async (req, res) => {
    try {
      const applications = await storage.getApplicationsForJob(req.params.jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/workers/:workerId/applications", async (req, res) => {
    try {
      const applications = await storage.getApplicationsForWorker(req.params.workerId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const parsed = insertJobApplicationSchema.parse(req.body);
      const application = await storage.createApplication(parsed);
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data", error });
    }
  });

  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const application = await storage.updateApplicationStatus(req.params.id, status);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", error: error.errors });
      }
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  // Job Assignment and Completion routes
  app.post("/api/jobs/:id/assign", async (req, res) => {
    try {
      const { workerId } = assignWorkerSchema.parse(req.body);
      
      // Validate job exists and is in correct state
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
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

  app.post("/api/jobs/:id/complete", async (req, res) => {
    try {
      // Validate job exists and is in correct state
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
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
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { jobId } = req.body;
      
      // Check if Razorpay keys are configured
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      
      if (!keyId || !keySecret) {
        return res.status(503).json({ 
          message: "Payment gateway not configured. Please configure Razorpay keys." 
        });
      }

      // Get job details
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
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

      // Initialize Razorpay
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      // Create Razorpay order
      const order = await razorpay.orders.create({
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
        keyId 
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentSchema.parse(req.body);
      
      // CRITICAL: Must have Razorpay secret key to verify signatures
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.error("Payment verification attempted without RAZORPAY_KEY_SECRET configured");
        return res.status(503).json({ 
          message: "Payment gateway not configured. Cannot verify payment." 
        });
      }

      // Verify signature using HMAC SHA256
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        console.warn("Payment verification failed: Invalid signature", {
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
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.get("/api/payments/job/:jobId", async (req, res) => {
    try {
      const payment = await storage.getPaymentForJob(req.params.jobId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });

  // Message routes
  app.get("/api/messages/:userId1/:userId2", async (req, res) => {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await storage.getMessagesForConversation(userId1, userId2);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(parsed);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data", error });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      updateMessageReadSchema.parse(req.body); // Validate request even though we don't use the value
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
