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
import { eq, and, or, desc } from "drizzle-orm";

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
  getApplicationsForJob(jobId: string): Promise<JobApplication[]>;
  getApplicationsForWorker(workerId: string): Promise<JobApplication[]>;
  createApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateApplicationStatus(id: string, status: string): Promise<JobApplication | undefined>;
  
  // Message methods
  getMessagesForConversation(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Payment methods
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentForJob(jobId: string): Promise<Payment | undefined>;
  getPaymentByOrderId(razorpayOrderId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string, razorpayPaymentId?: string, razorpaySignature?: string): Promise<Payment | undefined>;
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

  async getApplicationsForJob(jobId: string): Promise<JobApplication[]> {
    return Array.from(this.applications.values())
      .filter(app => app.jobId === jobId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getApplicationsForWorker(workerId: string): Promise<JobApplication[]> {
    return Array.from(this.applications.values())
      .filter(app => app.workerId === workerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
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
      result = await db.select().from(jobs)
        .where(and(...conditions))
        .orderBy(desc(jobs.createdAt));
    } else {
      result = await db.select().from(jobs)
        .orderBy(desc(jobs.createdAt));
    }
    
    if (filters?.location) {
      result = result.filter(job => job.location.includes(filters.location!));
    }
    
    return result;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return result[0];
  }

  async createJob(job: InsertJob): Promise<Job> {
    const result = await db.insert(jobs).values(job).returning();
    return result[0];
  }

  async updateJobStatus(id: string, status: string): Promise<Job | undefined> {
    const result = await db.update(jobs)
      .set({ status })
      .where(eq(jobs.id, id))
      .returning();
    return result[0];
  }

  async assignWorkerToJob(jobId: string, workerId: string): Promise<Job | undefined> {
    const result = await db.update(jobs)
      .set({ 
        assignedWorkerId: workerId, 
        status: "in_progress",
        startedAt: new Date()
      })
      .where(eq(jobs.id, jobId))
      .returning();
    return result[0];
  }

  async markJobCompleted(jobId: string): Promise<Job | undefined> {
    const result = await db.update(jobs)
      .set({ 
        status: "awaiting_payment",
        completedAt: new Date()
      })
      .where(eq(jobs.id, jobId))
      .returning();
    return result[0];
  }

  async getApplicationsForJob(jobId: string): Promise<JobApplication[]> {
    return await db.select()
      .from(jobApplications)
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));
  }

  async getApplicationsForWorker(workerId: string): Promise<JobApplication[]> {
    return await db.select()
      .from(jobApplications)
      .where(eq(jobApplications.workerId, workerId))
      .orderBy(desc(jobApplications.createdAt));
  }

  async createApplication(application: InsertJobApplication): Promise<JobApplication> {
    const result = await db.insert(jobApplications).values(application).returning();
    return result[0];
  }

  async updateApplicationStatus(id: string, status: string): Promise<JobApplication | undefined> {
    const result = await db.update(jobApplications)
      .set({ status })
      .where(eq(jobApplications.id, id))
      .returning();
    return result[0];
  }

  async getMessagesForConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await db.select()
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
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async getPaymentForJob(jobId: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.jobId, jobId)).limit(1);
    return result[0];
  }

  async getPaymentByOrderId(razorpayOrderId: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.razorpayOrderId, razorpayOrderId)).limit(1);
    return result[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
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
    
    const result = await db.update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
