import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { eq } from 'drizzle-orm';
import { registerRoutes } from '../../../server/routes';
import { testDb, cleanupDatabase, closeDatabase } from '../../setup/test-db';
import { users, jobs, payments } from '../../../shared/schema';
import { 
  createPaymentFlowMocks, 
  setupRazorpayEnv,
  createMockRazorpay 
} from '../../mocks/razorpay';
import type { Server } from 'http';

describe('Payment API Integration Tests', () => {
  let app: Express;
  let server: Server;
  let testEmployer: any;
  let testWorker: any;
  let testJob: any;

  beforeAll(async () => {
    // Setup Razorpay environment
    setupRazorpayEnv();
    
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(async () => {
    server.close();
    await closeDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    
    // Create test employer
    const [employer] = await testDb.insert(users).values({
      username: 'test_employer',
      password: 'test123',
      role: 'employer',
      language: 'en',
      location: 'Mumbai',
      skills: [],
      aadhar: null
    }).returning();
    testEmployer = employer;

    // Create test worker
    const [worker] = await testDb.insert(users).values({
      username: 'test_worker',
      password: 'test123',
      role: 'worker',
      language: 'hi',
      location: 'Mumbai',
      skills: ['mason'],
      aadhar: '123456789012'
    }).returning();
    testWorker = worker;

    // Create test job in awaiting_payment status
    const [job] = await testDb.insert(jobs).values({
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
      startedAt: new Date(Date.now() - 86400000),
      completedAt: new Date()
    }).returning();
    testJob = job;
  });

  describe('POST /api/payments/create-order', () => {
    it('should create a payment order successfully', async () => {
      const response = await request(app)
        .post('/api/payments/create-order')
        .send({
          jobId: testJob.id,
          amount: 80000
        })
        .expect(200);

      expect(response.body).toHaveProperty('orderId');
      expect(response.body).toHaveProperty('amount', 80000);
      expect(response.body).toHaveProperty('currency', 'INR');
      expect(response.body).toHaveProperty('keyId');
    });

    it('should reject order creation for non-existent job', async () => {
      const response = await request(app)
        .post('/api/payments/create-order')
        .send({
          jobId: '00000000-0000-0000-0000-000000000000',
          amount: 80000
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject order creation for job not in awaiting_payment status', async () => {
      // Update job to open status
      await testDb.update(jobs)
        .set({ status: 'open' })
        .where(eq(jobs.id, testJob.id));

      const response = await request(app)
        .post('/api/payments/create-order')
        .send({
          jobId: testJob.id,
          amount: 80000
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('awaiting_payment');
    });
  });

  describe('POST /api/payments/verify', () => {
    let payment: any;
    let mockPayment: ReturnType<typeof createPaymentFlowMocks>;

    beforeEach(async () => {
      // Create a payment in the database
      mockPayment = createPaymentFlowMocks();
      
      const [createdPayment] = await testDb.insert(payments).values({
        jobId: testJob.id,
        employerId: testEmployer.id,
        workerId: testWorker.id,
        amount: mockPayment.amount,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'upi',
        razorpayOrderId: mockPayment.orderId,
        razorpayPaymentId: null,
        razorpaySignature: null,
        failureReason: null
      }).returning();
      payment = createdPayment;
    });

    it('should verify payment with valid signature', async () => {
      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: mockPayment.orderId,
          razorpayPaymentId: mockPayment.paymentId,
          razorpaySignature: mockPayment.signature
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject payment with invalid signature', async () => {
      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: mockPayment.orderId,
          razorpayPaymentId: mockPayment.paymentId,
          razorpaySignature: 'invalid_signature_123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('verification failed');
    });

    it('should reject payment verification without Razorpay keys', async () => {
      // Temporarily remove Razorpay keys
      const originalKeyId = process.env.RAZORPAY_KEY_ID;
      const originalKeySecret = process.env.RAZORPAY_KEY_SECRET;
      delete process.env.RAZORPAY_KEY_ID;
      delete process.env.RAZORPAY_KEY_SECRET;

      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: mockPayment.orderId,
          razorpayPaymentId: mockPayment.paymentId,
          razorpaySignature: mockPayment.signature
        })
        .expect(500);

      expect(response.body).toHaveProperty('message');

      // Restore keys
      process.env.RAZORPAY_KEY_ID = originalKeyId;
      process.env.RAZORPAY_KEY_SECRET = originalKeySecret;
    });

    it('should reject verification for non-existent payment order', async () => {
      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: 'order_nonexistent123',
          razorpayPaymentId: 'pay_nonexistent123',
          razorpaySignature: 'signature_123'
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/payments/job/:jobId', () => {
    it('should retrieve payment for a job', async () => {
      // Create a payment for the job
      const [payment] = await testDb.insert(payments).values({
        jobId: testJob.id,
        employerId: testEmployer.id,
        workerId: testWorker.id,
        amount: 80000,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'upi',
        razorpayOrderId: 'order_test123',
        razorpayPaymentId: 'pay_test456',
        razorpaySignature: 'sig_test789',
        failureReason: null
      }).returning();

      const response = await request(app)
        .get(`/api/payments/job/${testJob.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', payment.id);
      expect(response.body).toHaveProperty('jobId', testJob.id);
      expect(response.body).toHaveProperty('amount', 80000);
      expect(response.body).toHaveProperty('status', 'completed');
    });

    it('should return 404 for job without payment', async () => {
      // Create a new job without payment
      const [newJob] = await testDb.insert(jobs).values({
        employerId: testEmployer.id,
        title: 'New Job',
        description: 'New job without payment',
        workType: 'plumber',
        location: 'Delhi',
        locationLat: '28.7041',
        locationLng: '77.1025',
        wageType: 'daily',
        wage: 1000,
        headcount: 1,
        skills: ['pipe_fitting'],
        status: 'open',
        assignedWorkerId: null,
        startedAt: null,
        completedAt: null
      }).returning();

      const response = await request(app)
        .get(`/api/payments/job/${newJob.id}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
