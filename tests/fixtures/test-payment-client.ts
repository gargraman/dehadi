import { vi } from 'vitest';
import type { IPaymentClient } from '../../server/dependencies';
import { createMockRazorpayOrder } from '../mocks/razorpay';

/**
 * Mock payment client for testing
 */
export class TestPaymentClient implements IPaymentClient {
  private mockOrders = vi.fn();

  constructor() {
    this.orders = {
      create: this.mockOrders
    };

    // Default mock implementation
    this.mockOrders.mockImplementation(async (params: { amount: number; currency: string; receipt: string }) => {
      return createMockRazorpayOrder(params.amount, params.currency);
    });
  }

  orders: {
    create: ReturnType<typeof vi.fn<(params: { amount: number; currency: string; receipt: string }) => Promise<{
      id: string;
      amount: number;
      currency: string;
    }>>>;
  };

  /**
   * Get the mock function for orders.create to set up custom behavior in tests
   */
  getMockOrdersCreate() {
    return this.mockOrders;
  }

  /**
   * Reset all mocks
   */
  reset() {
    this.mockOrders.mockReset();
    this.mockOrders.mockImplementation(async (params: { amount: number; currency: string; receipt: string }) => {
      return createMockRazorpayOrder(params.amount, params.currency);
    });
  }
}

/**
 * Create a test payment client instance
 */
export function createTestPaymentClient(): TestPaymentClient {
  return new TestPaymentClient();
}