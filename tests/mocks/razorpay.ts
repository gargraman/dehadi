import { vi } from 'vitest';
import crypto from 'crypto';

// Mock Razorpay order creation
export function createMockRazorpayOrder(amount: number, currency = 'INR') {
  return {
    id: `order_${Math.random().toString(36).substr(2, 14)}`,
    entity: 'order',
    amount,
    amount_paid: 0,
    amount_due: amount,
    currency,
    receipt: `receipt_${Date.now()}`,
    status: 'created',
    attempts: 0,
    created_at: Math.floor(Date.now() / 1000)
  };
}

// Mock Razorpay payment
export function createMockRazorpayPayment(orderId: string, amount: number) {
  return {
    id: `pay_${Math.random().toString(36).substr(2, 14)}`,
    entity: 'payment',
    amount,
    currency: 'INR',
    status: 'captured',
    order_id: orderId,
    method: 'upi',
    captured: true,
    email: 'test@example.com',
    contact: '+919876543210',
    created_at: Math.floor(Date.now() / 1000)
  };
}

// Generate valid Razorpay signature for testing
export function generateRazorpaySignature(
  orderId: string,
  paymentId: string,
  secret: string = 'test_razorpay_key_secret'
): string {
  const text = `${orderId}|${paymentId}`;
  return crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');
}

// Verify Razorpay signature (test utility)
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string = 'test_razorpay_key_secret'
): boolean {
  const expectedSignature = generateRazorpaySignature(orderId, paymentId, secret);
  return expectedSignature === signature;
}

// Mock Razorpay instance for tests
export function createMockRazorpay() {
  return {
    orders: {
      create: vi.fn(async (params: { amount: number; currency: string; receipt: string }) => {
        return createMockRazorpayOrder(params.amount, params.currency);
      }),
      fetch: vi.fn(async (orderId: string) => {
        return {
          id: orderId,
          status: 'created',
          amount: 50000,
          currency: 'INR'
        };
      })
    },
    payments: {
      fetch: vi.fn(async (paymentId: string) => {
        return {
          id: paymentId,
          status: 'captured',
          amount: 50000,
          currency: 'INR'
        };
      }),
      capture: vi.fn(async (paymentId: string, amount: number) => {
        return {
          id: paymentId,
          status: 'captured',
          amount,
          currency: 'INR'
        };
      })
    }
  };
}

// Mock environment variables for Razorpay
export function setupRazorpayEnv() {
  process.env.RAZORPAY_KEY_ID = 'test_razorpay_key_id';
  process.env.RAZORPAY_KEY_SECRET = 'test_razorpay_key_secret';
}

// Helper to create complete payment flow mocks
export function createPaymentFlowMocks() {
  const orderId = `order_${Math.random().toString(36).substr(2, 14)}`;
  const paymentId = `pay_${Math.random().toString(36).substr(2, 14)}`;
  const amount = 50000; // ₹500 in paise
  
  const order = createMockRazorpayOrder(amount);
  const payment = createMockRazorpayPayment(order.id, amount);
  const signature = generateRazorpaySignature(order.id, payment.id);
  
  return {
    orderId: order.id,
    paymentId: payment.id,
    signature,
    amount,
    order,
    payment,
    isValid: verifyRazorpaySignature(order.id, payment.id, signature)
  };
}
