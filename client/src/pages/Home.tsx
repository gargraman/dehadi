import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Notifications, Add } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Job } from '@shared/schema';

// Helper to get work type display name
const getWorkTypeName = (workType: string) => {
  const names: Record<string, string> = {
    mason: 'Mason',
    electrician: 'Electrician',
    plumber: 'Plumber',
    carpenter: 'Carpenter',
    painter: 'Painter',
    helper: 'Helper',
    driver: 'Driver',
    cleaner: 'Cleaner',
    cook: 'Cook',
    security: 'Security Guard',
  };
  return names[workType] || workType;
};

export default function Home() {
  const [, navigate] = useLocation();
  const [userRole] = useState('worker');
  const [userSkills, setUserSkills] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      const parsed = JSON.parse(data);
      setUserSkills(parsed.skills || []);
    }
  }, []);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  // Filter jobs based on user skills
  const recommendedJobs = jobs.filter(job => 
    userSkills.includes(job.workType)
  );

  const otherJobs = jobs.filter(job => 
    !userSkills.includes(job.workType)
  );

  // Calculate stats
  const totalJobs = jobs.length;
  const todayJobs = jobs.filter(job => {
    const jobDate = new Date(job.createdAt);
    const today = new Date();
    return jobDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dehadi</h1>
            <p className="text-xs text-muted-foreground">Find work nearby</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 relative" data-testid="button-notifications">
              <Notifications sx={{ fontSize: 24 }} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
                3
              </Badge>
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="p-4 bg-card border-b border-card-border">
        <SearchBar />
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-foreground">{totalJobs}</span>
            <span className="text-muted-foreground ml-1">jobs nearby</span>
          </div>
          <div>
            <span className="font-semibold text-chart-3">{todayJobs}</span>
            <span className="text-muted-foreground ml-1">new today</span>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </>
        ) : (
          <>
            {/* Recommended Jobs Based on Skills */}
            {recommendedJobs.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-foreground">Recommended For You</h2>
                  <Badge variant="secondary" className="text-xs">Based on your skills</Badge>
                </div>
                {recommendedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={getWorkTypeName(job.workType)}
                    employer={`Employer #${job.employerId.slice(0, 8)}`}
                    location={job.location}
                    distance="Nearby"
                    wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                    wage={job.wage.toString()}
                    skills={job.skills || []}
                    postedTime={formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    headcount={job.headcount || undefined}
                    status={job.status}
                  />
                ))}
              </>
            )}

            {/* Other Jobs */}
            {otherJobs.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-2 mt-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    {recommendedJobs.length > 0 ? 'Other Jobs' : 'All Jobs'}
                  </h2>
                  <Button variant="ghost" size="sm" data-testid="button-see-all">
                    See All
                  </Button>
                </div>
                {otherJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={getWorkTypeName(job.workType)}
                    employer={`Employer #${job.employerId.slice(0, 8)}`}
                    location={job.location}
                    distance="Nearby"
                    wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                    wage={job.wage.toString()}
                    skills={job.skills || []}
                    postedTime={formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    headcount={job.headcount || undefined}
                    status={job.status}
                  />
                ))}
              </>
            )}

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No jobs available at the moment</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later for new opportunities</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button for Posting Jobs */}
      <Button
        size="icon"
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-30"
        onClick={() => navigate('/post-job')}
        data-testid="button-post-job-fab"
      >
        <Add sx={{ fontSize: 28 }} />
      </Button>
    </div>
  );
}
