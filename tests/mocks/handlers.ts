import { http, HttpResponse } from 'msw';
import type { Job, Payment, User } from '../../shared/schema';

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    employerId: 'emp-1',
    title: 'Mason needed in Mumbai',
    description: 'Need experienced mason for residential work',
    workType: 'mason',
    location: 'Mumbai',
    locationLat: '19.0760',
    locationLng: '72.8777',
    wageType: 'daily',
    wage: 800,
    headcount: 1,
    skills: ['bricklaying', 'plastering'],
    status: 'open',
    assignedWorkerId: null,
    startedAt: null,
    completedAt: null,
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    employerId: 'emp-1',
    title: 'Electrician needed in Delhi',
    description: 'Electrical wiring work',
    workType: 'electrician',
    location: 'Delhi',
    locationLat: '28.7041',
    locationLng: '77.1025',
    wageType: 'hourly',
    wage: 150,
    headcount: 1,
    skills: ['wiring'],
    status: 'open',
    assignedWorkerId: null,
    startedAt: null,
    completedAt: null,
    createdAt: new Date('2025-01-02')
  }
];

const mockPayment: Payment = {
  id: 'pay-1',
  jobId: 'job-1',
  employerId: 'emp-1',
  workerId: 'worker-1',
  amount: 80000,
  currency: 'INR',
  status: 'completed',
  paymentMethod: 'upi',
  razorpayOrderId: 'order_mock123',
  razorpayPaymentId: 'pay_mock456',
  razorpaySignature: 'sig_mock789',
  failureReason: null,
  createdAt: new Date('2025-01-01'),
  paidAt: new Date('2025-01-01')
};

// API handlers
export const handlers = [
  // Job endpoints
  http.get('/api/jobs', ({ request }) => {
    const url = new URL(request.url);
    const workType = url.searchParams.get('workType');
    const location = url.searchParams.get('location');
    const status = url.searchParams.get('status') || 'open';

    let filteredJobs = mockJobs.filter(job => job.status === status);

    if (workType) {
      filteredJobs = filteredJobs.filter(job => job.workType === workType);
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job => job.location.includes(location));
    }

    return HttpResponse.json(filteredJobs);
  }),

  http.get('/api/jobs/:id', ({ params }) => {
    const { id } = params;
    const job = mockJobs.find(j => j.id === id);
    
    if (!job) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job not found' }),
        { status: 404 }
      );
    }

    return HttpResponse.json(job);
  }),

  http.post('/api/jobs', async ({ request }) => {
    const body = await request.json() as Partial<Job>;
    const newJob: Job = {
      id: `job-${Date.now()}`,
      ...body,
      createdAt: new Date()
    } as Job;

    mockJobs.push(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  http.patch('/api/jobs/:id/status', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { status: string };
    const jobIndex = mockJobs.findIndex(j => j.id === id);

    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job not found' }),
        { status: 404 }
      );
    }

    mockJobs[jobIndex] = {
      ...mockJobs[jobIndex],
      status: body.status
    };

    return HttpResponse.json(mockJobs[jobIndex]);
  }),

  http.post('/api/jobs/:id/assign', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { workerId: string };
    const jobIndex = mockJobs.findIndex(j => j.id === id);

    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job not found' }),
        { status: 404 }
      );
    }

    mockJobs[jobIndex] = {
      ...mockJobs[jobIndex],
      assignedWorkerId: body.workerId,
      status: 'in_progress',
      startedAt: new Date()
    };

    return HttpResponse.json(mockJobs[jobIndex]);
  }),

  http.post('/api/jobs/:id/complete', ({ params }) => {
    const { id } = params;
    const jobIndex = mockJobs.findIndex(j => j.id === id);

    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job not found' }),
        { status: 404 }
      );
    }

    mockJobs[jobIndex] = {
      ...mockJobs[jobIndex],
      status: 'awaiting_payment',
      completedAt: new Date()
    };

    return HttpResponse.json(mockJobs[jobIndex]);
  }),

  // Payment endpoints
  http.post('/api/payments/create-order', async ({ request }) => {
    const body = await request.json() as { jobId: string; amount: number };
    
    return HttpResponse.json({
      orderId: `order_${Math.random().toString(36).substr(2, 9)}`,
      amount: body.amount,
      currency: 'INR',
      keyId: 'test_razorpay_key'
    });
  }),

  http.post('/api/payments/verify', async ({ request }) => {
    const body = await request.json() as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    };

    // Mock verification success
    return HttpResponse.json({
      success: true,
      message: 'Payment verified successfully'
    });
  }),

  http.get('/api/payments/job/:jobId', ({ params }) => {
    const { jobId } = params;
    
    if (jobId === mockPayment.jobId) {
      return HttpResponse.json(mockPayment);
    }

    return new HttpResponse(
      JSON.stringify({ message: 'Payment not found' }),
      { status: 404 }
    );
  }),

  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: 'test'
    });
  })
];
