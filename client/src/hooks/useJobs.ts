import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import type { Job, JobApplication } from '@shared/schema';

interface JobFilters {
  workType?: string;
  location?: string;
  status?: string;
}

interface CreateJobRequest {
  title: string;
  workType: string;
  location: string;
  wage: number;
  wageType: 'daily' | 'hourly' | 'fixed';
  description: string;
  skills?: string[];
  headcount?: number;
}

interface CreateApplicationRequest {
  jobId: string;
  message?: string;
}

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['/api/jobs', filters],
    queryFn: async (): Promise<Job[]> => {
      const params = new URLSearchParams();
      if (filters.workType) params.append('workType', filters.workType);
      if (filters.location) params.append('location', filters.location);
      if (filters.status) params.append('status', filters.status);

      const url = `/api/jobs${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Failed to fetch jobs');
      }

      return res.json();
    },
  });
}

export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: ['/api/jobs', jobId],
    queryFn: async (): Promise<Job> => {
      if (!jobId) throw new Error('No job ID provided');

      const res = await fetch(`/api/jobs/${jobId}`, { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Failed to fetch job');
      }

      return res.json();
    },
    enabled: !!jobId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateJobRequest): Promise<Job> => {
      const res = await apiRequest('POST', '/api/jobs', data);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate jobs queries to show the new job
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateApplicationRequest): Promise<JobApplication> => {
      const res = await apiRequest('POST', '/api/applications', data);
      return res.json();
    },
    onSuccess: (newApplication) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', newApplication.jobId] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
    },
  });
}

export function useJobApplications(jobId: string | null) {
  return useQuery({
    queryKey: ['/api/jobs', jobId, 'applications'],
    queryFn: async (): Promise<JobApplication[]> => {
      if (!jobId) throw new Error('No job ID provided');

      const res = await fetch(`/api/jobs/${jobId}/applications`, { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Failed to fetch job applications');
      }

      return res.json();
    },
    enabled: !!jobId,
  });
}

export function useWorkerApplications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['/api/workers', user?.id, 'applications'],
    queryFn: async (): Promise<JobApplication[]> => {
      if (!user?.id) throw new Error('User not authenticated');

      const res = await fetch(`/api/workers/${user.id}/applications`, { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Failed to fetch worker applications');
      }

      return res.json();
    },
    enabled: !!user?.id && user.role === 'worker',
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }): Promise<JobApplication> => {
      const res = await apiRequest('PATCH', `/api/applications/${applicationId}/status`, { status });
      return res.json();
    },
    onSuccess: (updatedApplication) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', updatedApplication.jobId, 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, status }: { jobId: string; status: string }): Promise<Job> => {
      const res = await apiRequest('PATCH', `/api/jobs/${jobId}/status`, { status });
      return res.json();
    },
    onSuccess: (updatedJob) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', updatedJob.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
  });
}

export function useAssignWorkerToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, workerId }: { jobId: string; workerId: string }): Promise<Job> => {
      const res = await apiRequest('POST', `/api/jobs/${jobId}/assign`, { workerId });
      return res.json();
    },
    onSuccess: (updatedJob) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', updatedJob.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
  });
}

export function useCompleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string): Promise<Job> => {
      const res = await apiRequest('POST', `/api/jobs/${jobId}/complete`);
      return res.json();
    },
    onSuccess: (updatedJob) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', updatedJob.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
  });
}