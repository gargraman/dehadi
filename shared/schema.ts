import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("worker"), // worker, employer, ngo, admin
  language: text("language").default("en"),
  location: text("location"),
  skills: text("skills").array(),
  aadhar: text("aadhar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  roleIdx: index("users_role_idx").on(table.role),
  locationIdx: index("users_location_idx").on(table.location),
}));

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
}, (table) => ({
  employerIdIdx: index("jobs_employer_id_idx").on(table.employerId),
  assignedWorkerIdIdx: index("jobs_assigned_worker_id_idx").on(table.assignedWorkerId),
  statusIdx: index("jobs_status_idx").on(table.status),
  workTypeIdx: index("jobs_work_type_idx").on(table.workType),
  locationIdx: index("jobs_location_idx").on(table.location),
  createdAtIdx: index("jobs_created_at_idx").on(table.createdAt),
}));

export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  workerId: varchar("worker_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, withdrawn
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  jobIdIdx: index("job_applications_job_id_idx").on(table.jobId),
  workerIdIdx: index("job_applications_worker_id_idx").on(table.workerId),
  statusIdx: index("job_applications_status_idx").on(table.status),
}));

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  jobId: varchar("job_id").references(() => jobs.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
  receiverIdIdx: index("messages_receiver_id_idx").on(table.receiverId),
  jobIdIdx: index("messages_job_id_idx").on(table.jobId),
  isReadIdx: index("messages_is_read_idx").on(table.isRead),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
}));

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
}, (table) => ({
  jobIdIdx: index("payments_job_id_idx").on(table.jobId),
  employerIdIdx: index("payments_employer_id_idx").on(table.employerId),
  workerIdIdx: index("payments_worker_id_idx").on(table.workerId),
  statusIdx: index("payments_status_idx").on(table.status),
  razorpayOrderIdIdx: index("payments_razorpay_order_id_idx").on(table.razorpayOrderId),
}));

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

// Enhanced types for JOIN queries
export type EnrichedJobApplication = JobApplication & {
  job: Job;
  worker: User;
};
