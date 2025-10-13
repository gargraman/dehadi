import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertJobSchema, insertJobApplicationSchema, insertMessageSchema } from "@shared/schema";

// Validation schemas for PATCH endpoints
const updateStatusSchema = z.object({
  status: z.string().min(1),
});

const updateMessageReadSchema = z.object({
  isRead: z.boolean().optional().default(true),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
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
