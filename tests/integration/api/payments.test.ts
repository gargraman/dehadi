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
import { createTestDependencies } from '../../fixtures/test-dependencies';
import { TestDataFactory } from '../../fixtures/test-data';
import type { Server } from 'http';

describe('Payment API Integration Tests', () => {
  let app: Express;
  let server: Server;
  let testEmployer: any;
  let testWorker: any;
  let testJob: any;
  let dependencies: ReturnType<typeof createTestDependencies>;
  let dataFactory: TestDataFactory;

  beforeAll(async () => {
    // Setup test dependencies with mocked payment client
    dependencies = createTestDependencies();
    dataFactory = new TestDataFactory(dependencies.storage);

    app = express();
    app.use(express.json());
    server = await registerRoutes(app, dependencies);
  });

  afterAll(async () => {
    server.close();
    await closeDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();

    // Reset payment client mocks
    dependencies.testPaymentClient.reset();

    // Create test data using the data factory
    const workflow = await dataFactory.createJobWorkflow({
      jobStatus: "awaiting_payment",
      withApplication: true,
      withAssignment: true,
    });

    testEmployer = workflow.employer;
    testWorker = workflow.worker;
    testJob = workflow.job;
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
      // Create a payment in the database using data factory
      mockPayment = createPaymentFlowMocks();

      payment = await dataFactory.createTestPayment(
        testJob.id,
        testEmployer.id,
        testWorker.id,
        {
          amount: mockPayment.amount,
          razorpayOrderId: mockPayment.orderId,
        }
      );
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
      // Create a payment for the job using data factory
      const payment = await dataFactory.createTestPayment(
        testJob.id,
        testEmployer.id,
        testWorker.id,
        {
          status: 'completed',
          razorpayOrderId: 'order_test123',
          razorpayPaymentId: 'pay_test456',
          razorpaySignature: 'sig_test789',
        }
      );

      const response = await request(app)
        .get(`/api/payments/job/${testJob.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', payment.id);
      expect(response.body).toHaveProperty('jobId', testJob.id);
      expect(response.body).toHaveProperty('amount', 80000);
      expect(response.body).toHaveProperty('status', 'completed');
    });

    it('should return 404 for job without payment', async () => {
      // Create a new job without payment using data factory
      const newJob = await dataFactory.createTestJob(testEmployer.id, {
        title: 'New Job',
        description: 'New job without payment',
        workType: 'plumber',
        location: 'Delhi',
        locationLat: '28.7041',
        locationLng: '77.1025',
        wage: 1000,
        skills: ['pipe_fitting'],
        status: 'open',
      });

      const response = await request(app)
        .get(`/api/payments/job/${newJob.id}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
