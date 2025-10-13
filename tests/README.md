# Testing Guide

## Overview

This project uses **Vitest** as the testing framework with comprehensive unit, integration, and component testing coverage.

## Test Structure

```
tests/
├── setup/
│   ├── vitest-setup.ts        # Global test setup
│   └── test-db.ts              # Test database utilities
├── mocks/
│   └── razorpay.ts             # Razorpay payment mocking utilities
├── unit/
│   ├── storage.test.ts         # Storage layer unit tests
│   └── schemas.test.ts         # Zod schema validation tests
└── integration/
    └── api/
        ├── jobs.test.ts        # Job API integration tests
        ├── payments.test.ts    # Payment API integration tests
        └── health.test.ts      # Health check API tests
```

## Running Tests

### All Tests
```bash
npm run test
# or
vitest run
```

### Unit Tests Only
```bash
npm run test:unit
# or
vitest run tests/unit
```

### Integration Tests Only
```bash
npm run test:integration
# or
vitest run tests/integration
```

### Watch Mode (for development)
```bash
npm run test:watch
# or
vitest
```

### UI Mode (interactive test runner)
```bash
npm run test:ui
# or
vitest --ui
```

### Coverage Report
```bash
npm run test:coverage
# or
vitest run --coverage
```

## Test Scripts (Add to package.json)

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "db:seed:test": "tsx db/seed-test.ts",
    "db:seed:dev": "tsx db/seed-dev.ts",
    "test": "vitest run",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Seed Data

### Test Seed Data (Small dataset for fast tests)
```bash
npm run db:seed:test
# or
tsx db/seed-test.ts
```

This seeds:
- 5 workers
- 3 employers
- 10 jobs
- 5 payments

### Development Seed Data (Larger realistic dataset)
```bash
npm run db:seed:dev
# or
tsx db/seed-dev.ts
```

This seeds:
- 20 workers
- 10 employers
- 30 jobs
- 15 payments

## Environment Variables

For testing, set up a separate test database:

```bash
# .env or .env.test
TEST_DATABASE_URL=postgresql://...
RAZORPAY_KEY_ID=test_key_id
RAZORPAY_KEY_SECRET=test_key_secret
```

## Coverage Thresholds

The project enforces minimum coverage thresholds (configured in `vitest.config.ts`):

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## Writing Tests

### Unit Tests Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from '../../server/storage';

describe('Storage - Jobs', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  it('should create a job', async () => {
    const job = await storage.createJob({
      employerId: 'employer-123',
      title: 'Mason needed',
      // ... other fields
    });

    expect(job).toBeDefined();
    expect(job.id).toBeDefined();
  });
});
```

### Integration Tests Example

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../../server/routes';

describe('Job API', () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    server.close();
  });

  it('should fetch all jobs', async () => {
    const response = await request(app)
      .get('/api/jobs')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });
});
```

## Mocking

### Razorpay Payment Mocking

```typescript
import { createPaymentFlowMocks, setupRazorpayEnv } from '../../mocks/razorpay';

// Setup mock environment
setupRazorpayEnv();

// Create complete payment flow mocks
const mockPayment = createPaymentFlowMocks();
// mockPayment contains: orderId, paymentId, signature, amount, order, payment, isValid
```

### Database Cleanup

```typescript
import { cleanupDatabase } from '../../setup/test-db';

beforeEach(async () => {
  await cleanupDatabase(); // Clears all test data
});
```

## Best Practices

1. **Isolate Tests**: Each test should be independent and not rely on other tests
2. **Clean Up**: Use `beforeEach` and `afterEach` to clean up test data
3. **Mock External Services**: Always mock Razorpay and other external APIs
4. **Use Descriptive Names**: Test names should clearly describe what they test
5. **Test Edge Cases**: Include tests for error conditions and edge cases
6. **Parallel Safe**: Ensure tests can run in parallel without conflicts

## CI/CD Integration

Tests run automatically in GitHub Actions before deployment. See `.github/workflows/deploy-aws.yml` for the CI/CD pipeline configuration.

## Debugging Tests

### Run specific test file
```bash
vitest run tests/unit/storage.test.ts
```

### Run specific test by name
```bash
vitest run -t "should create a job"
```

### Enable verbose output
```bash
vitest run --reporter=verbose
```

## Common Issues

### Database Connection Errors
- Ensure `DATABASE_URL` or `TEST_DATABASE_URL` is set
- Check that the database is running and accessible

### Razorpay Mock Failures
- Verify that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in the test environment
- Use `setupRazorpayEnv()` to set up mock credentials

### Test Timeouts
- Increase timeout in individual tests: `it('test', { timeout: 10000 }, async () => {})`
- Or globally in `vitest.config.ts`: `testTimeout: 10000`
