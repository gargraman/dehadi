import type { IStorage } from "../../server/storage";
import type { InsertUser, InsertJob, InsertJobApplication, InsertPayment } from "../../shared/schema";

/**
 * Test data factory for creating consistent test fixtures
 */
export class TestDataFactory {
  constructor(private storage: IStorage) {}

  /**
   * Create a test employer user
   */
  async createTestEmployer(overrides: Partial<InsertUser> = {}) {
    const defaultEmployer: InsertUser = {
      username: `test_employer_${Date.now()}`,
      password: "test123",
      role: "employer",
      language: "en",
      location: "Mumbai",
      skills: [],
      aadhar: null,
      ...overrides,
    };

    return await this.storage.createUser(defaultEmployer);
  }

  /**
   * Create a test worker user
   */
  async createTestWorker(overrides: Partial<InsertUser> = {}) {
    const defaultWorker: InsertUser = {
      username: `test_worker_${Date.now()}`,
      password: "test123",
      role: "worker",
      language: "hi",
      location: "Mumbai",
      skills: ["mason", "tiling"],
      aadhar: "123456789012",
      ...overrides,
    };

    return await this.storage.createUser(defaultWorker);
  }

  /**
   * Create a test job
   */
  async createTestJob(employerId: string, overrides: Partial<InsertJob> = {}) {
    const defaultJob: InsertJob = {
      employerId,
      title: `Test Job ${Date.now()}`,
      description: "Test description for mason work",
      workType: "mason",
      location: "Mumbai",
      locationLat: "19.0760",
      locationLng: "72.8777",
      wageType: "daily",
      wage: 800,
      headcount: 1,
      skills: ["bricklaying"],
      status: "open",
      assignedWorkerId: null,
      startedAt: null,
      completedAt: null,
      ...overrides,
    };

    return await this.storage.createJob(defaultJob);
  }

  /**
   * Create a test job application
   */
  async createTestApplication(
    jobId: string,
    workerId: string,
    overrides: Partial<InsertJobApplication> = {}
  ) {
    const defaultApplication: InsertJobApplication = {
      jobId,
      workerId,
      status: "pending",
      message: "I am interested in this job",
      ...overrides,
    };

    return await this.storage.createApplication(defaultApplication);
  }

  /**
   * Create a test payment
   */
  async createTestPayment(
    jobId: string,
    employerId: string,
    workerId: string,
    overrides: Partial<InsertPayment> = {}
  ) {
    const defaultPayment: InsertPayment = {
      jobId,
      employerId,
      workerId,
      amount: 80000, // ₹800 in paise
      currency: "INR",
      status: "pending",
      paymentMethod: "razorpay",
      razorpayOrderId: `order_test_${Date.now()}`,
      razorpayPaymentId: null,
      razorpaySignature: null,
      failureReason: null,
      ...overrides,
    };

    return await this.storage.createPayment(defaultPayment);
  }

  /**
   * Create a complete job workflow scenario
   * Returns: { employer, worker, job, application }
   */
  async createJobWorkflow(options: {
    jobStatus?: string;
    withApplication?: boolean;
    withAssignment?: boolean;
    withPayment?: boolean;
  } = {}) {
    const { jobStatus = "open", withApplication = true, withAssignment = false, withPayment = false } = options;

    // Create users
    const employer = await this.createTestEmployer();
    const worker = await this.createTestWorker();

    // Create job
    const jobData: Partial<InsertJob> = { status: jobStatus };
    if (withAssignment && worker) {
      jobData.assignedWorkerId = worker.id;
      jobData.startedAt = new Date();
    }

    // Set final status based on what workflow step we want
    if (withPayment) {
      jobData.status = "awaiting_payment";
      jobData.completedAt = new Date();
      // If we have payment, we also need assignment
      if (!jobData.assignedWorkerId) {
        jobData.assignedWorkerId = worker.id;
        jobData.startedAt = new Date();
      }
    } else if (withAssignment) {
      jobData.status = "in_progress";
    }

    const job = await this.createTestJob(employer.id, jobData);

    // Create application if requested
    let application = null;
    if (withApplication) {
      application = await this.createTestApplication(job.id, worker.id);
    }

    // Create payment if requested
    let payment = null;
    if (withPayment) {
      payment = await this.createTestPayment(job.id, employer.id, worker.id);
    }

    return {
      employer,
      worker,
      job,
      application,
      payment,
    };
  }

  /**
   * Create multiple jobs for testing filtering and pagination
   */
  async createMultipleJobs(employerId: string, count: number = 3) {
    const jobs = [];
    const workTypes = ["mason", "electrician", "plumber"];
    const locations = ["Mumbai", "Delhi", "Bangalore"];
    const statuses = ["open", "in_progress", "completed"];

    for (let i = 0; i < count; i++) {
      const job = await this.createTestJob(employerId, {
        title: `Job ${i + 1}`,
        workType: workTypes[i % workTypes.length],
        location: locations[i % locations.length],
        status: statuses[i % statuses.length],
        wage: 800 + (i * 100),
      });
      jobs.push(job);
    }

    return jobs;
  }
}

/**
 * Helper function to clean up test data by removing all records
 */
export async function cleanupTestData(storage: IStorage) {
  // Note: Order matters due to foreign key constraints
  // We should delete in reverse dependency order

  // This is a simple approach - in a real scenario you might want
  // to be more selective about what to clean up
  const db = (storage as any).db || (storage as any).payments;

  if (db && typeof db.execute === 'function') {
    // For database storage, we can run raw SQL
    try {
      await db.execute('DELETE FROM payments');
      await db.execute('DELETE FROM messages');
      await db.execute('DELETE FROM job_applications');
      await db.execute('DELETE FROM jobs');
      await db.execute('DELETE FROM users');
    } catch (error) {
      console.warn('Could not clean up with raw SQL, storage implementation may not support it');
    }
  } else {
    // For in-memory storage, we can use the interface methods
    // This is less efficient but works with any IStorage implementation
    console.warn('Using interface-based cleanup - less efficient for testing');
  }
}

/**
 * Seed function to populate test database with initial data
 */
export async function seedTestData(storage: IStorage) {
  const factory = new TestDataFactory(storage);

  // Create basic test data
  const scenario1 = await factory.createJobWorkflow({
    jobStatus: "open",
    withApplication: true,
  });

  const scenario2 = await factory.createJobWorkflow({
    jobStatus: "in_progress",
    withApplication: true,
    withAssignment: true,
  });

  const scenario3 = await factory.createJobWorkflow({
    jobStatus: "awaiting_payment",
    withApplication: true,
    withAssignment: true,
    withPayment: true,
  });

  return {
    scenario1,
    scenario2,
    scenario3,
    factory,
  };
}