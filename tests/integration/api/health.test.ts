import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { registerRoutes } from '../../../server/routes';
import { closeDatabase } from '../../setup/test-db';
import { createTestDependencies } from '../../fixtures/test-dependencies';
import type { Server } from 'http';

describe('Health Check API', () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    const dependencies = createTestDependencies();

    app = express();
    app.use(express.json());
    server = await registerRoutes(app, dependencies);
  });

  afterAll(async () => {
    server.close();
    await closeDatabase();
  });

  describe('GET /api/health', () => {
    it('should return healthy status when database is connected', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body.environment).toBe('test');
    });

    it('should return correct response format', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: expect.any(String),
        timestamp: expect.any(String),
        environment: expect.any(String)
      });

      // Validate timestamp format (ISO 8601)
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });
});
