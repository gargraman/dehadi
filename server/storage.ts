import { 
  type User, 
  type InsertUser, 
  type Job, 
  type InsertJob,
  type JobApplication,
  type InsertJobApplication,
  type Message,
  type InsertMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  
  // Job Application methods
  getApplicationsForJob(jobId: string): Promise<JobApplication[]>;
  getApplicationsForWorker(workerId: string): Promise<JobApplication[]>;
  createApplication(application: InsertJobApplication): Promise<JobApplication>;
  updateApplicationStatus(id: string, status: string): Promise<JobApplication | undefined>;
  
  // Message methods
  getMessagesForConversation(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, Job>;
  private applications: Map<string, JobApplication>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.messages = new Map();
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
}

export const storage = new MemStorage();
