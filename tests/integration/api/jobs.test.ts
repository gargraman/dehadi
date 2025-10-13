import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { eq } from 'drizzle-orm';
import { registerRoutes } from '../../../server/routes';
import { testDb, cleanupDatabase, closeDatabase } from '../../setup/test-db';
import { users, jobs } from '../../../shared/schema';
import type { Server } from 'http';

describe('Job API Integration Tests', () => {
  let app: Express;
  let server: Server;
  let testEmployer: any;
  let testWorker: any;
  let testJob: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(async () => {
    server.close();
    await closeDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    
    // Create test employer
    const [employer] = await testDb.insert(users).values({
      username: 'test_employer',
      password: 'test123',
      role: 'employer',
      language: 'en',
      location: 'Mumbai',
      skills: [],
      aadhar: null
    }).returning();
    testEmployer = employer;

    // Create test worker
    const [worker] = await testDb.insert(users).values({
      username: 'test_worker',
      password: 'test123',
      role: 'worker',
      language: 'hi',
      location: 'Mumbai',
      skills: ['mason', 'tiling'],
      aadhar: '123456789012'
    }).returning();
    testWorker = worker;

    // Create test job
    const [job] = await testDb.insert(jobs).values({
      employerId: testEmployer.id,
      title: 'Mason needed in Mumbai',
      description: 'Need experienced mason for residential work',
      workType: 'mason',
      location: 'Mumbai',
      locationLat: '19.0760',
      locationLng: '72.8777',
      wageType: 'daily',
      wage: 800,
      headcount: 1,
      skills: ['bricklaying'],
      status: 'open',
      assignedWorkerId: null,
      startedAt: null,
      completedAt: null
    }).returning();
    testJob = job;
  });

  describe('GET /api/jobs', () => {
    it('should return all jobs', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should filter jobs by work type', async () => {
      // Create another job with different work type
      await testDb.insert(jobs).values({
        employerId: testEmployer.id,
        title: 'Electrician needed',
        description: 'Electrical work',
        workType: 'electrician',
        location: 'Mumbai',
        locationLat: '19.0760',
        locationLng: '72.8777',
        wageType: 'daily',
        wage: 1000,
        headcount: 1,
        skills: ['wiring'],
        status: 'open',
        assignedWorkerId: null,
        startedAt: null,
        completedAt: null
      });

      const response = await request(app)
        .get('/api/jobs?workType=mason')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].workType).toBe('mason');
    });

    it('should filter jobs by location', async () => {
      const response = await request(app)
        .get('/api/jobs?location=Mumbai')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((job: any) => {
        expect(job.location).toContain('Mumbai');
      });
    });

    it('should filter jobs by status', async () => {
      const response = await request(app)
        .get('/api/jobs?status=open')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((job: any) => {
        expect(job.status).toBe('open');
      });
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should return a specific job', async () => {
      const response = await request(app)
        .get(`/api/jobs/${testJob.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testJob.id);
      expect(response.body).toHaveProperty('title', testJob.title);
      expect(response.body).toHaveProperty('workType', 'mason');
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .get('/api/jobs/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Job not found');
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job', async () => {
      const newJob = {
        employerId: testEmployer.id,
        title: 'Plumber needed urgently',
        description: 'Bathroom plumbing repair work',
        workType: 'plumber',
        location: 'Mumbai',
        locationLat: '19.0760',
        locationLng: '72.8777',
        wageType: 'hourly',
        wage: 150,
        headcount: 1,
        skills: ['pipe_fitting'],
        status: 'open',
        assignedWorkerId: null,
        startedAt: null,
        completedAt: null
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(newJob)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newJob.title);
      expect(response.body).toHaveProperty('workType', 'plumber');
      expect(response.body).toHaveProperty('wage', 150);
    });

    it('should reject job creation with invalid data', async () => {
      const invalidJob = {
        title: 'Invalid job',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/jobs')
        .send(invalidJob)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/jobs/:id/status', () => {
    it('should update job status', async () => {
      const response = await request(app)
        .patch(`/api/jobs/${testJob.id}/status`)
        .send({ status: 'in_progress' })
        .expect(200);

      expect(response.body).toHaveProperty('status', 'in_progress');
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .patch('/api/jobs/00000000-0000-0000-0000-000000000000/status')
        .send({ status: 'completed' })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Job not found');
    });

    it('should reject invalid status data', async () => {
      const response = await request(app)
        .patch(`/api/jobs/${testJob.id}/status`)
        .send({ status: '' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/jobs/:id/assign', () => {
    it('should assign a worker to an open job', async () => {
      const response = await request(app)
        .post(`/api/jobs/${testJob.id}/assign`)
        .send({ workerId: testWorker.id })
        .expect(200);

      expect(response.body).toHaveProperty('assignedWorkerId', testWorker.id);
      expect(response.body).toHaveProperty('status', 'in_progress');
      expect(response.body).toHaveProperty('startedAt');
    });

    it('should reject assignment to non-open job', async () => {
      // Update job to in_progress
      await testDb.update(jobs)
        .set({ status: 'in_progress' })
        .where(eq(jobs.id, testJob.id));

      const response = await request(app)
        .post(`/api/jobs/${testJob.id}/assign`)
        .send({ workerId: testWorker.id })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('open');
    });
  });

  describe('POST /api/jobs/:id/complete', () => {
    beforeEach(async () => {
      // Set job to in_progress
      await testDb.update(jobs)
        .set({ 
          status: 'in_progress',
          assignedWorkerId: testWorker.id,
          startedAt: new Date()
        })
        .where(eq(jobs.id, testJob.id));
    });

    it('should mark job as completed', async () => {
      const response = await request(app)
        .post(`/api/jobs/${testJob.id}/complete`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'awaiting_payment');
      expect(response.body).toHaveProperty('completedAt');
    });

    it('should reject completion of non-in-progress job', async () => {
      // Set job back to open
      await testDb.update(jobs)
        .set({ status: 'open' })
        .where(eq(jobs.id, testJob.id));

      const response = await request(app)
        .post(`/api/jobs/${testJob.id}/complete`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('in_progress');
    });
  });
});
