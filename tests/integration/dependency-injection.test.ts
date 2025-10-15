import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../../server/routes';
import { MemStorage } from '../../server/storage';
import { createTestPaymentClient } from '../fixtures/test-payment-client';
import { createTestDependencies } from '../fixtures/test-dependencies';
import { TestDataFactory } from '../fixtures/test-data';
import type { Server } from 'http';

describe('Dependency Injection Integration Tests', () => {
  let app: Express;
  let server: Server;

  describe('with MemStorage (no database required)', () => {
    let memStorage: MemStorage;
    let paymentClient: ReturnType<typeof createTestPaymentClient>;
    let dataFactory: TestDataFactory;

    beforeAll(async () => {
      // Create dependencies with in-memory storage
      memStorage = new MemStorage();
      paymentClient = createTestPaymentClient();

      const dependencies = {
        storage: memStorage,
        paymentClient,
        paymentConfig: {
          keyId: 'test_key_id',
          keySecret: 'test_key_secret',
        },
      };

      dataFactory = new TestDataFactory(memStorage);

      app = express();
      app.use(express.json());
      server = await registerRoutes(app, dependencies);
    });

    it('should use injected storage for health checks', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('environment', 'test');
    });

    it('should use injected storage for job operations', async () => {
      // Create test data using the data factory
      const employer = await dataFactory.createTestEmployer();
      const job = await dataFactory.createTestJob(employer.id);

      // Verify the job was created using the injected storage
      const response = await request(app)
        .get(`/api/jobs/${job.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', job.id);
      expect(response.body).toHaveProperty('title', job.title);
    });

    it('should use mocked payment client for payment operations', async () => {
      // Create test workflow ready for payment (job completed but no payment record yet)
      const employer = await dataFactory.createTestEmployer();
      const worker = await dataFactory.createTestWorker();
      const job = await dataFactory.createTestJob(employer.id, {
        status: 'awaiting_payment',
        assignedWorkerId: worker.id,
        startedAt: new Date(Date.now() - 86400000), // Started yesterday
        completedAt: new Date(), // Completed now
      });

      const workflow = { employer, worker, job };

      // Mock the payment client to return a specific order
      const mockOrder = {
        id: 'order_test_12345',
        amount: 80000,
        currency: 'INR',
      };
      paymentClient.getMockOrdersCreate().mockResolvedValueOnce(mockOrder);

      // Make payment creation request
      const response = await request(app)
        .post('/api/payments/create-order')
        .send({ jobId: workflow.job.id });

      // Debug the response if it fails
      if (response.status !== 200) {
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        console.log('Job status:', workflow.job.status);
      }

      expect(response.status).toBe(200);

      // Verify the mocked payment client was called
      expect(paymentClient.getMockOrdersCreate()).toHaveBeenCalledWith({
        amount: workflow.job.wage * 100,
        currency: 'INR',
        receipt: `job_${workflow.job.id}`,
      });

      // Verify the response contains the mocked order data
      expect(response.body).toHaveProperty('orderId', mockOrder.id);
      expect(response.body).toHaveProperty('amount', mockOrder.amount);
      expect(response.body).toHaveProperty('keyId', 'test_key_id');
    });

    it('should use injected payment config for signature verification', async () => {
      // Create test payment verification scenario
      const workflow = await dataFactory.createJobWorkflow({
        jobStatus: 'awaiting_payment',
        withAssignment: true,
        withPayment: true,
      });

      // Test payment verification with correct signature
      // Using the test secret key to generate a valid signature
      const orderId = workflow.payment!.razorpayOrderId!;
      const paymentId = 'pay_test_123';
      const signature = require('crypto')
        .createHmac('sha256', 'test_key_secret')
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should properly isolate data between test runs', async () => {
      // Get initial job count
      const initialResponse = await request(app)
        .get('/api/jobs')
        .expect(200);
      const initialCount = initialResponse.body.length;

      // Create some test data
      const employer = await dataFactory.createTestEmployer();
      await dataFactory.createTestJob(employer.id);
      await dataFactory.createTestJob(employer.id);

      // Verify new jobs were added
      const afterResponse = await request(app)
        .get('/api/jobs')
        .expect(200);
      const afterCount = afterResponse.body.length;

      expect(afterCount).toBe(initialCount + 2);

      // Clear storage manually (simulating test cleanup)
      (memStorage as any).jobs.clear();
      (memStorage as any).users.clear();

      // Verify data is cleared
      const clearedResponse = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(clearedResponse.body).toHaveLength(0);
    });
  });

  describe('with TestDatabaseStorage', () => {
    it('should use test database storage when configured', async () => {
      // This test validates that our TestDatabaseStorage class is properly set up
      const dependencies = createTestDependencies();

      // The storage should be an instance of our TestDatabaseStorage
      expect(dependencies.storage).toBeDefined();
      expect(typeof dependencies.storage.getUser).toBe('function');
      expect(typeof dependencies.storage.createUser).toBe('function');

      // The payment client should be our test mock
      expect(dependencies.paymentClient).toBeDefined();
      expect(typeof dependencies.paymentClient.orders.create).toBe('function');

      // Payment config should be test values
      expect(dependencies.paymentConfig.keyId).toBe('test_razorpay_key_id');
      expect(dependencies.paymentConfig.keySecret).toBe('test_razorpay_key_secret');
    });
  });
});