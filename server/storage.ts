import {
  type User,
  type InsertUser,
  type Job,
  type InsertJob,
  type JobApplication,
  type InsertJobApplication,
  type Message,
  type InsertMessage,
  type Payment,
  type InsertPayment,
  users,
  jobs,
  jobApplications,
  messages,
  payments
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, or, desc, ne, isNull } from "drizzle-orm";
import { logger } from "./lib/logger";

// Enhanced JobApplication type for methods that return JOIN data
export type EnrichedJobApplication = JobApplication & {
  job: Job;
  worker: User;
};

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Job methods
  getJobs(filters?: { workType?: string; location?: string; status?: string }): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJobStatus(id: string, status: string): Promise<Job | undefined>;
  assignWorkerToJob(jobId: string, workerId: string): Promise<Job | undefined>;
  markJobCompleted(jobId: string): Promise<Job | undefined>;

  // Job Application methods
  getApplicationsForJob(jobId: string): Promise<EnrichedJobApplication[]>;
  getApplicationsForWorker(workerId: string): Promise<EnrichedJobApplication[]>;
  getApplicationById(id: string): Promise<JobApplication | undefined>;
  createApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateApplicationStatus(id: string, status: string): Promise<JobApplication | undefined>;

  // Message methods
  getMessagesForConversation(userId1: string, userId2: string): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;

  // Payment methods
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentForJob(jobId: string): Promise<Payment | undefined>;
  getPaymentByOrderId(razorpayOrderId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string, razorpayPaymentId?: string, razorpaySignature?: string): Promise<Payment | undefined>;

  // Transactional methods
  completePaymentTransaction(
    paymentId: string,
    jobId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{ payment: Payment; job: Job } | null>;

  // Atomic application acceptance with job assignment
  acceptApplicationWithJobAssignment(
    applicationId: string,
    jobId: string,
    workerId: string
  ): Promise<{ application: JobApplication; job: Job } | null>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;
  private applications: Map<string, JobApplication>;
  private messages: Map<string, Message>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.messages = new Map();
    this.payments = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      role: insertUser.role || "worker",
      language: insertUser.language || "en",
      location: insertUser.location || null,
      skills: insertUser.skills || null,
      aadhar: insertUser.aadhar || null,
    };
    this.users.set(id, user);
    return user;
  }

  async getJobs(filters?: { workType?: string; location?: string; status?: string }): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());
    
    if (filters?.workType) {
      jobs = jobs.filter(job => job.workType === filters.workType);
    }
    if (filters?.location) {
      jobs = jobs.filter(job => job.location.includes(filters.location!));
    }
    if (filters?.status) {
      jobs = jobs.filter(job => job.status === filters.status);
    }
    
    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = { 
      ...insertJob, 
      id,
      createdAt: new Date(),
      wageType: insertJob.wageType || "daily",
      headcount: insertJob.headcount || 1,
      status: insertJob.status || "open",
      locationLat: insertJob.locationLat || null,
      locationLng: insertJob.locationLng || null,
      skills: insertJob.skills || null,
      assignedWorkerId: insertJob.assignedWorkerId || null,
      startedAt: insertJob.startedAt || null,
      completedAt: insertJob.completedAt || null,
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJobStatus(id: string, status: string): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updated = { ...job, status };
    this.jobs.set(id, updated);
    return updated;
  }

  async getApplicationsForJob(jobId: string): Promise<EnrichedJobApplication[]> {
    const applications = Array.from(this.applications.values())
      .filter(app => app.jobId === jobId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return applications.map(app => ({
      ...app,
      job: this.jobs.get(app.jobId)!,
      worker: this.users.get(app.workerId)!
    }));
  }

  async getApplicationsForWorker(workerId: string): Promise<EnrichedJobApplication[]> {
    const applications = Array.from(this.applications.values())
      .filter(app => app.workerId === workerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return applications.map(app => ({
      ...app,
      job: this.jobs.get(app.jobId)!,
      worker: this.users.get(app.workerId)!
    }));
  }

  async getApplicationById(id: string): Promise<JobApplication | undefined> {
    return this.applications.get(id);
  }

  async createApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const id = randomUUID();
    const application: JobApplication = {
      ...insertApplication,
      id,
      createdAt: new Date(),
      status: insertApplication.status || "pending",
      message: insertApplication.message || null,
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplicationStatus(id: string, status: string): Promise<JobApplication | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updated = { ...application, status };
    this.applications.set(id, updated);
    return updated;
  }

  async getMessagesForConversation(userId1: string, userId2: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
      isRead: insertMessage.isRead || false,
      jobId: insertMessage.jobId || null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async markMessageAsRead(id: string): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      this.messages.set(id, { ...message, isRead: true });
    }
  }

  async assignWorkerToJob(jobId: string, workerId: string): Promise<Job | undefined> {
    const job = this.jobs.get(jobId);
    if (!job) return undefined;
    
    const updated = { 
      ...job, 
      assignedWorkerId: workerId, 
      status: "in_progress",
      startedAt: new Date()
    };
    this.jobs.set(jobId, updated);
    return updated;
  }

  async markJobCompleted(jobId: string): Promise<Job | undefined> {
    const job = this.jobs.get(jobId);
    if (!job) return undefined;
    
    const updated = { 
      ...job, 
      status: "awaiting_payment",
      completedAt: new Date()
    };
    this.jobs.set(jobId, updated);
    return updated;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentForJob(jobId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(payment => payment.jobId === jobId);
  }

  async getPaymentByOrderId(razorpayOrderId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(payment => payment.razorpayOrderId === razorpayOrderId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
      status: insertPayment.status || "pending",
      currency: insertPayment.currency || "INR",
      paymentMethod: insertPayment.paymentMethod || null,
      razorpayOrderId: insertPayment.razorpayOrderId || null,
      razorpayPaymentId: insertPayment.razorpayPaymentId || null,
      razorpaySignature: insertPayment.razorpaySignature || null,
      failureReason: insertPayment.failureReason || null,
      paidAt: null,
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePaymentStatus(
    id: string, 
    status: string, 
    razorpayPaymentId?: string, 
    razorpaySignature?: string
  ): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updated = { 
      ...payment, 
      status,
      razorpayPaymentId: razorpayPaymentId || payment.razorpayPaymentId,
      razorpaySignature: razorpaySignature || payment.razorpaySignature,
      paidAt: status === "completed" ? new Date() : payment.paidAt
    };
    this.payments.set(id, updated);
    return updated;
  }

  async completePaymentTransaction(
    paymentId: string,
    jobId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{ payment: Payment; job: Job } | null> {
    const payment = this.payments.get(paymentId);
    const job = this.jobs.get(jobId);
    
    if (!payment || !job) return null;
    if (job.status !== "awaiting_payment") return null;

    // Update both payment and job atomically (in-memory, so naturally atomic)
    const updatedPayment = { 
      ...payment, 
      status: "completed",
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date()
    };
    const updatedJob = { 
      ...job, 
      status: "paid"
    };

    this.payments.set(paymentId, updatedPayment);
    this.jobs.set(jobId, updatedJob);

    return { payment: updatedPayment, job: updatedJob };
  }

  async acceptApplicationWithJobAssignment(
    applicationId: string,
    jobId: string,
    workerId: string
  ): Promise<{ application: JobApplication; job: Job } | null> {
    const application = this.applications.get(applicationId);
    const job = this.jobs.get(jobId);

    if (!application || !job) return null;
    if (job.status !== "open" || job.assignedWorkerId) return null;
    if (application.status !== "pending") return null;

    // Update both application and job atomically (in-memory, so naturally atomic)
    const updatedApplication = {
      ...application,
      status: "accepted"
    };
    const updatedJob = {
      ...job,
      assignedWorkerId: workerId,
      status: "in_progress",
      startedAt: new Date()
    };

    // Reject all other pending applications for this job
    Array.from(this.applications.values())
      .filter(app => app.jobId === jobId && app.status === "pending" && app.id !== applicationId)
      .forEach(app => {
        this.applications.set(app.id, { ...app, status: "rejected" });
      });

    this.applications.set(applicationId, updatedApplication);
    this.jobs.set(jobId, updatedJob);

    return { application: updatedApplication, job: updatedJob };
  }
}

export class DatabaseStorage implements IStorage {
  protected get db() {
    return db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async getJobs(filters?: { workType?: string; location?: string; status?: string }): Promise<Job[]> {
    const conditions = [];
    if (filters?.workType) {
      conditions.push(eq(jobs.workType, filters.workType));
    }
    if (filters?.status) {
      conditions.push(eq(jobs.status, filters.status));
    }

    let result;
    if (conditions.length > 0) {
      result = await this.db.select().from(jobs)
        .where(and(...conditions))
        .orderBy(desc(jobs.createdAt));
    } else {
      result = await this.db.select().from(jobs)
        .orderBy(desc(jobs.createdAt));
    }

    if (filters?.location) {
      result = result.filter(job => job.location.includes(filters.location!));
    }

    return result;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const result = await this.db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return result[0];
  }

  async createJob(job: InsertJob): Promise<Job> {
    const result = await this.db.insert(jobs).values(job).returning();
    return result[0];
  }

  async updateJobStatus(id: string, status: string): Promise<Job | undefined> {
    const result = await this.db.update(jobs)
      .set({ status })
      .where(eq(jobs.id, id))
      .returning();
    return result[0];
  }

  async assignWorkerToJob(jobId: string, workerId: string): Promise<Job | undefined> {
    try {
      // Use transaction to ensure atomicity and prevent race conditions
      const result = await this.db.transaction(async (tx) => {
        // First, check if job is still available for assignment
        const [job] = await tx.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

        if (!job) {
          return null;
        }

        // Prevent race condition: ensure job is still open and unassigned
        if (job.status !== "open" || job.assignedWorkerId) {
          return null;
        }

        // Assign worker atomically
        const [updatedJob] = await tx.update(jobs)
          .set({
            assignedWorkerId: workerId,
            status: "in_progress",
            startedAt: new Date()
          })
          .where(and(
            eq(jobs.id, jobId),
            eq(jobs.status, "open"),
            isNull(jobs.assignedWorkerId)
          ))
          .returning();

        return updatedJob;
      });

      return result;
    } catch (error) {
      logger.error("Transaction failed in assignWorkerToJob", { error });
      return undefined;
    }
  }

  async markJobCompleted(jobId: string): Promise<Job | undefined> {
    const result = await this.db.update(jobs)
      .set({
        status: "awaiting_payment",
        completedAt: new Date()
      })
      .where(eq(jobs.id, jobId))
      .returning();
    return result[0];
  }

  async getApplicationsForJob(jobId: string): Promise<EnrichedJobApplication[]> {
    const results = await this.db.select({
      id: jobApplications.id,
      jobId: jobApplications.jobId,
      workerId: jobApplications.workerId,
      status: jobApplications.status,
      message: jobApplications.message,
      createdAt: jobApplications.createdAt,
      job: jobs,
      worker: users
    })
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .leftJoin(users, eq(jobApplications.workerId, users.id))
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));

    return results.map(row => ({
      id: row.id,
      jobId: row.jobId,
      workerId: row.workerId,
      status: row.status,
      message: row.message,
      createdAt: row.createdAt,
      job: row.job!,
      worker: row.worker!
    }));
  }

  async getApplicationsForWorker(workerId: string): Promise<EnrichedJobApplication[]> {
    const results = await this.db.select({
      id: jobApplications.id,
      jobId: jobApplications.jobId,
      workerId: jobApplications.workerId,
      status: jobApplications.status,
      message: jobApplications.message,
      createdAt: jobApplications.createdAt,
      job: jobs,
      worker: users
    })
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .leftJoin(users, eq(jobApplications.workerId, users.id))
      .where(eq(jobApplications.workerId, workerId))
      .orderBy(desc(jobApplications.createdAt));

    return results.map(row => ({
      id: row.id,
      jobId: row.jobId,
      workerId: row.workerId,
      status: row.status,
      message: row.message,
      createdAt: row.createdAt,
      job: row.job!,
      worker: row.worker!
    }));
  }

  async getApplicationById(id: string): Promise<JobApplication | undefined> {
    const result = await this.db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
    return result[0];
  }

  async createApplication(application: InsertJobApplication): Promise<JobApplication> {
    const result = await this.db.insert(jobApplications).values(application).returning();
    return result[0];
  }

  async updateApplicationStatus(id: string, status: string): Promise<JobApplication | undefined> {
    const result = await this.db.update(jobApplications)
      .set({ status })
      .where(eq(jobApplications.id, id))
      .returning();
    return result[0];
  }

  async getMessagesForConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await this.db.select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await this.db.insert(messages).values(message).returning();
    return result[0];
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const result = await this.db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async markMessageAsRead(id: string): Promise<void> {
    await this.db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await this.db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async getPaymentForJob(jobId: string): Promise<Payment | undefined> {
    const result = await this.db.select().from(payments).where(eq(payments.jobId, jobId)).limit(1);
    return result[0];
  }

  async getPaymentByOrderId(razorpayOrderId: string): Promise<Payment | undefined> {
    const result = await this.db.select().from(payments).where(eq(payments.razorpayOrderId, razorpayOrderId)).limit(1);
    return result[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await this.db.insert(payments).values(payment).returning();
    return result[0];
  }

  async updatePaymentStatus(
    id: string,
    status: string,
    razorpayPaymentId?: string,
    razorpaySignature?: string
  ): Promise<Payment | undefined> {
    const updateData: any = { status };

    if (razorpayPaymentId) {
      updateData.razorpayPaymentId = razorpayPaymentId;
    }
    if (razorpaySignature) {
      updateData.razorpaySignature = razorpaySignature;
    }
    if (status === "completed") {
      updateData.paidAt = new Date();
    }

    const result = await this.db.update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return result[0];
  }

  async completePaymentTransaction(
    paymentId: string,
    jobId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{ payment: Payment; job: Job } | null> {
    try {
      // Use database transaction to ensure atomicity
      const result = await this.db.transaction(async (tx) => {
        // First, verify job is in correct state
        const [job] = await tx.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
        if (!job || job.status !== "awaiting_payment") {
          return null;
        }

        // Update payment status to completed
        const [updatedPayment] = await tx.update(payments)
          .set({
            status: "completed",
            razorpayPaymentId,
            razorpaySignature,
            paidAt: new Date()
          })
          .where(eq(payments.id, paymentId))
          .returning();

        if (!updatedPayment) {
          return null;
        }

        // Update job status to paid
        const [updatedJob] = await tx.update(jobs)
          .set({ status: "paid" })
          .where(eq(jobs.id, jobId))
          .returning();

        if (!updatedJob) {
          return null;
        }

        return { payment: updatedPayment, job: updatedJob };
      });

      return result;
    } catch (error) {
      logger.error("Transaction failed in completePaymentTransaction", { error });
      return null;
    }
  }

  async acceptApplicationWithJobAssignment(
    applicationId: string,
    jobId: string,
    workerId: string
  ): Promise<{ application: JobApplication; job: Job } | null> {
    try {
      // Use database transaction to ensure atomicity
      const result = await this.db.transaction(async (tx) => {
        // First, verify application and job are in correct state
        const [application] = await tx.select().from(jobApplications).where(eq(jobApplications.id, applicationId)).limit(1);
        const [job] = await tx.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

        if (!application || !job) {
          return null;
        }

        if (job.status !== "open" || job.assignedWorkerId || application.status !== "pending") {
          return null;
        }

        // Accept the application
        const [updatedApplication] = await tx.update(jobApplications)
          .set({ status: "accepted" })
          .where(eq(jobApplications.id, applicationId))
          .returning();

        if (!updatedApplication) {
          return null;
        }

        // Assign worker to job and update status
        const [updatedJob] = await tx.update(jobs)
          .set({
            assignedWorkerId: workerId,
            status: "in_progress",
            startedAt: new Date()
          })
          .where(eq(jobs.id, jobId))
          .returning();

        if (!updatedJob) {
          return null;
        }

        // Reject all other pending applications for this job
        await tx.update(jobApplications)
          .set({ status: "rejected" })
          .where(and(
            eq(jobApplications.jobId, jobId),
            eq(jobApplications.status, "pending"),
            ne(jobApplications.id, applicationId)
          ));

        return { application: updatedApplication, job: updatedJob };
      });

      return result;
    } catch (error) {
      logger.error("Transaction failed in acceptApplicationWithJobAssignment", { error });
      return null;
    }
  }
}

export const storage = new DatabaseStorage();
