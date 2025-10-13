import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';
process.env.RAZORPAY_KEY_ID = 'test_razorpay_key_id';
process.env.RAZORPAY_KEY_SECRET = 'test_razorpay_key_secret';

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
