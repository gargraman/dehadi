import type { IDependencies } from "../../server/dependencies";
import { createTestStorage } from "./test-storage";
import { createTestPaymentClient } from "./test-payment-client";

/**
 * Create test dependencies with mocked payment client and test database storage
 */
export function createTestDependencies(): IDependencies & {
  testPaymentClient: ReturnType<typeof createTestPaymentClient>;
} {
  const storage = createTestStorage();
  const testPaymentClient = createTestPaymentClient();

  return {
    storage,
    paymentClient: testPaymentClient,
    paymentConfig: {
      keyId: "test_razorpay_key_id",
      keySecret: "test_razorpay_key_secret",
    },
    testPaymentClient, // Additional helper for tests
  };
}

/**
 * Create minimal test dependencies with minimal configuration
 */
export function createMinimalTestDependencies(): IDependencies {
  return {
    storage: createTestStorage(),
    paymentClient: createTestPaymentClient(),
    paymentConfig: {
      keyId: "test_key",
      keySecret: "test_secret",
    },
  };
}