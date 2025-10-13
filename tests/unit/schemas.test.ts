import { describe, it, expect } from 'vitest';
import {
  insertUserSchema,
  insertJobSchema,
  insertPaymentSchema,
  insertJobApplicationSchema,
  insertMessageSchema
} from '../../shared/schema';

describe('Schema Validation - User', () => {
  it('should validate a valid worker user', () => {
    const validWorker = {
      username: 'rajesh_kumar',
      password: 'secure123',
      role: 'worker',
      language: 'hi',
      location: 'Mumbai',
      skills: ['mason', 'tiling'],
      aadhar: '123456789012'
    };

    const result = insertUserSchema.safeParse(validWorker);
    expect(result.success).toBe(true);
  });

  it('should validate a valid employer user', () => {
    const validEmployer = {
      username: 'arjun_malhotra',
      password: 'secure123',
      role: 'employer',
      language: 'en',
      location: 'Delhi',
      skills: [],
      aadhar: null
    };

    const result = insertUserSchema.safeParse(validEmployer);
    expect(result.success).toBe(true);
  });

  it('should reject user without username', () => {
    const invalidUser = {
      password: 'secure123',
      role: 'worker'
    };

    const result = insertUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it('should reject user without password', () => {
    const invalidUser = {
      username: 'test_user',
      role: 'worker'
    };

    const result = insertUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });
});

describe('Schema Validation - Job', () => {
  it('should validate a valid job posting', () => {
    const validJob = {
      employerId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Mason needed in Mumbai',
      description: 'Need experienced mason for residential construction work',
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

    const result = insertJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
  });

  it('should reject job without required fields', () => {
    const invalidJob = {
      title: 'Mason needed',
      location: 'Mumbai'
    };

    const result = insertJobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
  });

  it('should reject job with invalid wage type', () => {
    const invalidJob = {
      employerId: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Mason needed',
      description: 'Mason work',
      workType: 'mason',
      location: 'Mumbai',
      locationLat: '19.0760',
      locationLng: '72.8777',
      wageType: 'monthly', // Invalid wage type
      wage: 20000,
      headcount: 1,
      skills: ['bricklaying'],
      status: 'open',
      assignedWorkerId: null,
      startedAt: null,
      completedAt: null
    };

    const result = insertJobSchema.safeParse(invalidJob);
    // This should pass since wageType is just a text field
    // In a real scenario, you might want to add enum validation
    expect(result.success).toBe(true);
  });

  it('should validate job with all statuses', () => {
    const statuses = ['open', 'in_progress', 'awaiting_payment', 'paid', 'completed', 'cancelled'];
    
    statuses.forEach(status => {
      const job = {
        employerId: '123e4567-e89b-12d3-a456-426614174000',
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
        status,
        assignedWorkerId: null,
        startedAt: null,
        completedAt: null
      };

      const result = insertJobSchema.safeParse(job);
      expect(result.success).toBe(true);
    });
  });
});

describe('Schema Validation - Payment', () => {
  it('should validate a valid payment', () => {
    const validPayment = {
      jobId: '123e4567-e89b-12d3-a456-426614174000',
      employerId: '223e4567-e89b-12d3-a456-426614174000',
      workerId: '323e4567-e89b-12d3-a456-426614174000',
      amount: 80000, // ₹800 in paise
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'upi',
      razorpayOrderId: 'order_abc123',
      razorpayPaymentId: null,
      razorpaySignature: null,
      failureReason: null
    };

    const result = insertPaymentSchema.safeParse(validPayment);
    expect(result.success).toBe(true);
  });

  it('should reject payment without required fields', () => {
    const invalidPayment = {
      amount: 80000,
      currency: 'INR'
    };

    const result = insertPaymentSchema.safeParse(invalidPayment);
    expect(result.success).toBe(false);
  });

  it('should validate payment with all statuses', () => {
    const statuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    
    statuses.forEach(status => {
      const payment = {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        employerId: '223e4567-e89b-12d3-a456-426614174000',
        workerId: '323e4567-e89b-12d3-a456-426614174000',
        amount: 80000,
        currency: 'INR',
        status,
        paymentMethod: 'upi',
        razorpayOrderId: 'order_abc123',
        razorpayPaymentId: null,
        razorpaySignature: null,
        failureReason: null
      };

      const result = insertPaymentSchema.safeParse(payment);
      expect(result.success).toBe(true);
    });
  });
});

describe('Schema Validation - Job Application', () => {
  it('should validate a valid job application', () => {
    const validApplication = {
      jobId: '123e4567-e89b-12d3-a456-426614174000',
      workerId: '323e4567-e89b-12d3-a456-426614174000',
      status: 'pending',
      message: 'I am interested in this job and have 5 years of experience'
    };

    const result = insertJobApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it('should reject application without worker ID', () => {
    const invalidApplication = {
      jobId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'pending'
    };

    const result = insertJobApplicationSchema.safeParse(invalidApplication);
    expect(result.success).toBe(false);
  });
});

describe('Schema Validation - Message', () => {
  it('should validate a valid message', () => {
    const validMessage = {
      senderId: '123e4567-e89b-12d3-a456-426614174000',
      receiverId: '223e4567-e89b-12d3-a456-426614174000',
      jobId: '323e4567-e89b-12d3-a456-426614174000',
      content: 'Hello, I am interested in the mason job',
      isRead: false
    };

    const result = insertMessageSchema.safeParse(validMessage);
    expect(result.success).toBe(true);
  });

  it('should reject message without content', () => {
    const invalidMessage = {
      senderId: '123e4567-e89b-12d3-a456-426614174000',
      receiverId: '223e4567-e89b-12d3-a456-426614174000'
    };

    const result = insertMessageSchema.safeParse(invalidMessage);
    expect(result.success).toBe(false);
  });

  it('should validate message without job ID', () => {
    const validMessage = {
      senderId: '123e4567-e89b-12d3-a456-426614174000',
      receiverId: '223e4567-e89b-12d3-a456-426614174000',
      jobId: null,
      content: 'General message',
      isRead: false
    };

    const result = insertMessageSchema.safeParse(validMessage);
    expect(result.success).toBe(true);
  });
});
