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
 * Factory function to create production dependencies
 */
export function createProductionDependencies(): IDependencies {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in production");
  }

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