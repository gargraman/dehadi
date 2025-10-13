import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import JobCard from '../../client/src/components/JobCard';

// Mock wouter
const mockNavigate = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/', mockNavigate]
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('JobCard Component', () => {
  it('should render job information correctly', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Mason needed in Mumbai"
        employer="Test Employer"
        location="Mumbai"
        distance="5 km"
        wageType="daily"
        wage="800"
        skills={['bricklaying', 'plastering']}
        postedTime="2 hours ago"
        headcount={2}
        status="open"
      />
    );

    expect(screen.getByText('Mason needed in Mumbai')).toBeInTheDocument();
    expect(screen.getByText('Test Employer')).toBeInTheDocument();
    expect(screen.getByText('Mumbai')).toBeInTheDocument();
    expect(screen.getByText('₹800')).toBeInTheDocument();
    expect(screen.getByText('2 workers needed')).toBeInTheDocument();
  });

  it('should display correct status badge', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Test Job"
        employer="Test Employer"
        location="Delhi"
        wageType="hourly"
        wage="150"
        skills={['wiring']}
        postedTime="1 day ago"
        status="in_progress"
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should display skills correctly', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Electrician needed"
        employer="Test Employer"
        location="Bangalore"
        wageType="daily"
        wage="1000"
        skills={['wiring', 'electrical_fitting', 'repair']}
        postedTime="3 hours ago"
        status="open"
      />
    );

    expect(screen.getByText('wiring')).toBeInTheDocument();
    expect(screen.getByText('electrical_fitting')).toBeInTheDocument();
    expect(screen.getByText('repair')).toBeInTheDocument();
  });

  it('should show Apply Now button for open jobs', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Plumber needed"
        employer="Test Employer"
        location="Chennai"
        wageType="fixed"
        wage="5000"
        skills={['pipe_fitting']}
        postedTime="1 hour ago"
        status="open"
      />
    );

    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });

  it('should have correct test id', () => {
    renderWithProviders(
      <JobCard
        id="job-123"
        title="Test Job"
        employer="Test Employer"
        location="Mumbai"
        wageType="daily"
        wage="800"
        skills={['mason']}
        postedTime="2 hours ago"
        status="open"
      />
    );

    expect(screen.getByTestId('job-card-job-123')).toBeInTheDocument();
  });

  it('should display hourly wage type correctly', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Test Job"
        employer="Test Employer"
        location="Mumbai"
        wageType="hourly"
        wage="200"
        skills={['mason']}
        postedTime="2 hours ago"
        status="open"
      />
    );

    expect(screen.getByText('/hour')).toBeInTheDocument();
  });

  it('should display daily wage type correctly', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Test Job"
        employer="Test Employer"
        location="Mumbai"
        wageType="daily"
        wage="800"
        skills={['mason']}
        postedTime="2 hours ago"
        status="open"
      />
    );

    expect(screen.getByText('/day')).toBeInTheDocument();
  });

  it('should not show Apply Now button for completed jobs', () => {
    renderWithProviders(
      <JobCard
        id="job-1"
        title="Test Job"
        employer="Test Employer"
        location="Mumbai"
        wageType="daily"
        wage="800"
        skills={['mason']}
        postedTime="2 days ago"
        status="completed"
      />
    );

    expect(screen.queryByText('Apply Now')).not.toBeInTheDocument();
  });

  it('should handle navigation on card click', () => {
    const { container } = renderWithProviders(
      <JobCard
        id="job-1"
        title="Test Job"
        employer="Test Employer"
        location="Mumbai"
        wageType="daily"
        wage="800"
        skills={['mason']}
        postedTime="2 hours ago"
        status="open"
      />
    );

    const card = screen.getByTestId('job-card-job-1');
    card.click();

    expect(mockNavigate).toHaveBeenCalledWith('/jobs/job-1');
  });
});
