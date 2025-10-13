import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("worker"), // worker, employer, ngo, admin
  language: text("language").default("en"),
  location: text("location"),
  skills: text("skills").array(),
  aadhar: text("aadhar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employerId: varchar("employer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  workType: text("work_type").notNull(), // mason, electrician, plumber, etc.
  location: text("location").notNull(),
  locationLat: text("location_lat"),
  locationLng: text("location_lng"),
  wageType: text("wage_type").notNull().default("daily"), // daily, hourly, fixed
  wage: integer("wage").notNull(),
  headcount: integer("headcount").default(1),
  skills: text("skills").array(),
  status: text("status").notNull().default("open"), // open, in_progress, awaiting_payment, paid, completed, cancelled
  assignedWorkerId: varchar("assigned_worker_id").references(() => users.id), // Worker assigned after accepting application
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  workerId: varchar("worker_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, withdrawn
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  jobId: varchar("job_id").references(() => jobs.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  employerId: varchar("employer_id").notNull().references(() => users.id),
  workerId: varchar("worker_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // Amount in smallest currency unit (paise for INR)
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed, refunded
  paymentMethod: text("payment_method"), // upi, razorpay, card, bank_transfer
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Job schemas
export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Job Application schemas
export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
});

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;

// Message schemas
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Payment schemas
export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  paidAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
