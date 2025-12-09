import Razorpay from "razorpay";
import { IStorage, DatabaseStorage } from "./storage";

/**
 * Payment client interface for dependency injection
 */
export interface IPaymentClient {
  orders: {
    create(params: { amount: number; currency: string; receipt?: string }): Promise<{
      id: string;
      amount: number | string;
      currency: string;
      status: string;
      entity: string;
      amount_paid: number;
      amount_due: number;
      attempts: number;
      created_at: number;
      receipt?: string;
      notes?: any;
    }>;
  };
}

/**
 * Dependencies interface for the application
 */
export interface IDependencies {
  storage: IStorage;
  paymentClient: IPaymentClient;
  paymentConfig: {
    keyId: string;
    keySecret: string;
  };
}

/**
 * Production Razorpay client implementation
 */
export class RazorpayClient implements IPaymentClient {
  private client: Razorpay;

  constructor(keyId: string, keySecret: string) {
    this.client = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  get orders() {
    return this.client.orders;
  }
}

/**
 * Development mock payment client for when Razorpay keys are not configured
 */
export class DevMockPaymentClient implements IPaymentClient {
  orders = {
    create: async (params: { amount: number; currency: string; receipt?: string }) => {
      console.log('🔧 Development mode: Using mock payment client for order creation', params);
      return {
        id: `dev_order_${Math.random().toString(36).substr(2, 14)}`,
        entity: 'order' as any,
        amount: params.amount,
        amount_paid: 0 as any,
        amount_due: params.amount as any,
        currency: params.currency,
        status: 'created' as any,
        attempts: 0 as any,
        created_at: Math.floor(Date.now() / 1000) as any,
        receipt: params.receipt,
        notes: {} as any
      };
    }
  };
}

/**
 * Disabled payment client that returns 503 errors for all operations
 * Used when Razorpay keys are not configured in production
 */
export class DisabledPaymentClient implements IPaymentClient {
  orders = {
    create: async (_params: { amount: number; currency: string; receipt?: string }) => {
      throw new Error('PAYMENT_DISABLED: Razorpay keys not configured. Contact administrator.');
    }
  };
}

// Track whether payments are enabled globally
export let paymentsEnabled = false;

/**
 * Factory function to create production dependencies
 */
export function createProductionDependencies(): IDependencies {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const nodeEnv = process.env.NODE_ENV;

  // Check if we have placeholder/test keys (common in development)
  const hasPlaceholderKeys = keyId === 'your_razorpay_key_id' || keySecret === 'your_razorpay_key_secret';
  const hasValidKeys = keyId && keySecret && !hasPlaceholderKeys;

  // In production without valid keys: use disabled client that returns errors
  if (nodeEnv === 'production' && !hasValidKeys) {
    console.warn('⚠️ WARNING: Running in production without Razorpay keys.');
    console.warn('⚠️ Payment endpoints will return 503 errors until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are configured.');
    paymentsEnabled = false;
    return {
      storage: new DatabaseStorage(),
      paymentClient: new DisabledPaymentClient(),
      paymentConfig: {
        keyId: '',
        keySecret: '',
      },
    };
  }

  // In development without keys: use mock client for testing
  if (!hasValidKeys) {
    console.log('🔧 Development mode: Using mock payment client (Razorpay keys not configured)');
    paymentsEnabled = true; // Mock payments work in dev
    return {
      storage: new DatabaseStorage(),
      paymentClient: new DevMockPaymentClient(),
      paymentConfig: {
        keyId: keyId || 'dev_mock_key_id',
        keySecret: keySecret || 'dev_mock_key_secret',
      },
    };
  }

  // Use real Razorpay client when keys are properly configured
  console.log('✓ Razorpay payment integration enabled');
  paymentsEnabled = true;
  return {
    storage: new DatabaseStorage(),
    paymentClient: new RazorpayClient(keyId, keySecret),
    paymentConfig: {
      keyId,
      keySecret,
    },
  };
}

/**
 * Factory function to create test dependencies
 */
export function createTestDependencies(
  storage: IStorage,
  paymentClient: IPaymentClient,
  paymentConfig: { keyId: string; keySecret: string }
): IDependencies {
  return {
    storage,
    paymentClient,
    paymentConfig,
  };
}