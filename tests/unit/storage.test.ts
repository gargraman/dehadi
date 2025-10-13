import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from '../../server/storage';
import type { InsertUser, InsertJob, InsertPayment } from '../../shared/schema';

describe('Storage - Jobs', () => {
  let storage: MemStorage;
  let testEmployer: any;
  let testWorker: any;

  beforeEach(async () => {
    storage = new MemStorage();
    
    // Create test employer
    const employerData: InsertUser = {
      username: 'test_employer',
      password: 'test123',
      role: 'employer',
      language: 'en',
      location: 'Mumbai',
      skills: [],
      aadhar: null
    };
    testEmployer = await storage.createUser(employerData);
    
    // Create test worker
    const workerData: InsertUser = {
      username: 'test_worker',
      password: 'test123',
      role: 'worker',
      language: 'hi',
      location: 'Mumbai',
      skills: ['mason', 'tiling'],
      aadhar: '123456789012'
    };
    testWorker = await storage.createUser(workerData);
  });

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
      const jobData: InsertJob = {
        employerId: testEmployer.id,
        title: 'Mason needed in Mumbai',
        description: 'Need experienced mason for residential work',
        workType: 'mason',
        location: 'Mumbai',
        locationLat: '19.0760',
        locationLng: '72.8777',
        wageType: 'daily',
        wage: 800,
        headcount: 2,
        skills: ['bricklaying', 'plastering'],
        status: 'open',
        assignedWorkerId: null,
        startedAt: null,
        completedAt: null
      };

      const job = await storage.createJob(jobData);

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.title).toBe(jobData.title);
      expect(job.workType).toBe('mason');
      expect(job.status).toBe('open');
      expect(job.wage).toBe(800);
    });
  });

  describe('getJobs', () => {
    beforeEach(async () => {
      // Create multiple test jobs
      const jobs: InsertJob[] = [
        {
          employerId: testEmployer.id,
          title: 'Mason in Mumbai',
          description: 'Mason work',
          workType: 'mason',
          location: 'Mumbai',
          locationLat: '19.0760',
          locationLng: '72.8777',
          wageType: 'daily',
          wage: 800,
          headcount: 1,
          skills: ['bricklaying'],
          status: 'open',
          assignedWorkerId: null,
          startedAt: null,
          completedAt: null
        },
        {
          employerId: testEmployer.id,
          title: 'Electrician in Delhi',
          description: 'Electrical work',
          workType: 'electrician',
          location: 'Delhi',
          locationLat: '28.7041',
          locationLng: '77.1025',
          wageType: 'daily',
          wage: 1000,
          headcount: 1,
          skills: ['wiring'],
          status: 'open',
          assignedWorkerId: null,
          startedAt: null,
          completedAt: null
        }
      ];

      for (const job of jobs) {
        await storage.createJob(job);
      }
    });

    it('should return all jobs when no filters applied', async () => {
      const jobs = await storage.getJobs();
      expect(jobs).toHaveLength(2);
    });

    it('should filter jobs by work type', async () => {
      const jobs = await storage.getJobs({ workType: 'mason' });
      expect(jobs).toHaveLength(1);
      expect(jobs[0].workType).toBe('mason');
    });

    it('should filter jobs by location', async () => {
      const jobs = await storage.getJobs({ location: 'Mumbai' });
      expect(jobs).toHaveLength(1);
      expect(jobs[0].location).toBe('Mumbai');
    });

    it('should filter jobs by status', async () => {
      const jobs = await storage.getJobs({ status: 'open' });
      expect(jobs).toHaveLength(2);
      jobs.forEach(job => expect(job.status).toBe('open'));
    });
  });

  describe('assignWorkerToJob', () => {
    it('should assign a worker to a job', async () => {
      const jobData: InsertJob = {
        employerId: testEmployer.id,
        title: 'Mason needed',
        description: 'Mason work',
        workType: 'mason',
        location: 'Mumbai',
        locationLat: '19.0760',
        locationLng: '72.8777',
        wageType: 'daily',
        wage: 800,
        headcount: 1,
        skills: ['bricklaying'],
        status: 'open',
        assignedWorkerId: null,
        startedAt: null,
        completedAt: null
      };

      const job = await storage.createJob(jobData);
      const updatedJob = await storage.assignWorkerToJob(job.id, testWorker.id);

      expect(updatedJob).toBeDefined();
      expect(updatedJob!.assignedWorkerId).toBe(testWorker.id);
      expect(updatedJob!.status).toBe('in_progress');
      expect(updatedJob!.startedAt).toBeDefined();
    });
  });

  describe('markJobCompleted', () => {
    it('should mark a job as completed', async () => {
      const jobData: InsertJob = {
        employerId: testEmployer.id,
        title: 'Mason needed',
        description: 'Mason work',
        workType: 'mason',
        location: 'Mumbai',
        locationLat: '19.0760',
        locationLng: '72.8777',
        wageType: 'daily',
        wage: 800,
        headcount: 1,
        skills: ['bricklaying'],
        status: 'in_progress',
        assignedWorkerId: testWorker.id,
        startedAt: new Date(),
        completedAt: null
      };

      const job = await storage.createJob(jobData);
      const completedJob = await storage.markJobCompleted(job.id);

      expect(completedJob).toBeDefined();
      expect(completedJob!.status).toBe('awaiting_payment');
      expect(completedJob!.completedAt).toBeDefined();
    });
  });
});

describe('Storage - Payments', () => {
  let storage: MemStorage;
  let testEmployer: any;
  let testWorker: any;
  let testJob: any;

  beforeEach(async () => {
    storage = new MemStorage();
    
    // Create test users
    const employerData: InsertUser = {
      username: 'test_employer',
      password: 'test123',
      role: 'employer',
      language: 'en',
      location: 'Mumbai',
      skills: [],
      aadhar: null
    };
    testEmployer = await storage.createUser(employerData);
    
    const workerData: InsertUser = {
      username: 'test_worker',
      password: 'test123',
      role: 'worker',
      language: 'hi',
      location: 'Mumbai',
      skills: ['mason'],
      aadhar: '123456789012'
    };
    testWorker = await storage.createUser(workerData);
    
    // Create test job
    const jobData: InsertJob = {
      employerId: testEmployer.id,
      title: 'Test Job',
      description: 'Test description',
      workType: 'mason',
      location: 'Mumbai',
      locationLat: '19.0760',
      locationLng: '72.8777',
      wageType: 'daily',
      wage: 800,
      headcount: 1,
      skills: ['bricklaying'],
      status: 'awaiting_payment',
      assignedWorkerId: testWorker.id,
      startedAt: new Date(),
      completedAt: new Date()
    };
    testJob = await storage.createJob(jobData);
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const paymentData: InsertPayment = {
        jobId: testJob.id,
        employerId: testEmployer.id,
        workerId: testWorker.id,
        amount: 80000, // ₹800 in paise
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'upi',
        razorpayOrderId: 'order_test123',
        razorpayPaymentId: null,
        razorpaySignature: null,
        failureReason: null
      };

      const payment = await storage.createPayment(paymentData);

      expect(payment).toBeDefined();
      expect(payment.id).toBeDefined();
      expect(payment.amount).toBe(80000);
      expect(payment.status).toBe('pending');
      expect(payment.razorpayOrderId).toBe('order_test123');
    });
  });

  describe('getPaymentForJob', () => {
    it('should retrieve payment for a specific job', async () => {
      const paymentData: InsertPayment = {
        jobId: testJob.id,
        employerId: testEmployer.id,
        workerId: testWorker.id,
        amount: 80000,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'upi',
        razorpayOrderId: 'order_test123',
        razorpayPaymentId: null,
        razorpaySignature: null,
        failureReason: null
      };

      await storage.createPayment(paymentData);
      const payment = await storage.getPaymentForJob(testJob.id);

      expect(payment).toBeDefined();
      expect(payment!.jobId).toBe(testJob.id);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status successfully', async () => {
      const paymentData: InsertPayment = {
        jobId: testJob.id,
        employerId: testEmployer.id,
        workerId: testWorker.id,
        amount: 80000,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'upi',
        razorpayOrderId: 'order_test123',
        razorpayPaymentId: null,
        razorpaySignature: null,
        failureReason: null
      };

      const payment = await storage.createPayment(paymentData);
      const updatedPayment = await storage.updatePaymentStatus(
        payment.id,
        'completed',
        'pay_test456',
        'signature_test789'
      );

      expect(updatedPayment).toBeDefined();
      expect(updatedPayment!.status).toBe('completed');
      expect(updatedPayment!.razorpayPaymentId).toBe('pay_test456');
      expect(updatedPayment!.razorpaySignature).toBe('signature_test789');
    });
  });
});
