import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { ArrowBack, Work, LocationOn, Schedule, Person, CalendarMonth } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useJob, useCreateApplication, useJobApplications } from '@/hooks/useJobs';
import { getWorkTypeImage } from '@/lib/workTypeImages';

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

export default function JobDetails() {
  const [, params] = useRoute('/jobs/:id');
  const [, navigate] = useLocation();
  const jobId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  const [applicationMessage, setApplicationMessage] = useState('');

  const { data: job, isLoading, error } = useJob(jobId || null);
  const { data: applications = [] } = useJobApplications(jobId || null);
  const createApplicationMutation = useCreateApplication();

  // Check if current user has already applied
  const hasUserApplied = applications.some(app => app.workerId === user?.id);

  const handleApply = () => {
    if (!jobId) return;

    createApplicationMutation.mutate(
      {
        jobId,
        message: applicationMessage.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Application Submitted!',
            description: 'Your application has been sent to the employer.',
          });
          setApplicationMessage('');
        },
        onError: (error) => {
          toast({
            title: 'Application Failed',
            description: error instanceof Error
              ? error.message.includes('duplicate key')
                ? 'You have already applied for this job.'
                : 'Could not submit your application. Please try again.'
              : 'Could not submit your application. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => navigate('/')}
          >
            <ArrowBack sx={{ fontSize: 24 }} />
          </Button>
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="p-4 space-y-4 -mt-8 relative z-10">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="relative h-20 bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => navigate('/')}
          >
            <ArrowBack sx={{ fontSize: 24 }} />
          </Button>
        </div>
        <div className="flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-4 max-w-md">
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error
                  ? error.message.includes('404')
                    ? 'Job not found or may have been removed.'
                    : 'Failed to load job details. Please try again.'
                  : 'Job not found.'
                }
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')}>
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const workTypeImage = getWorkTypeImage(job.workType);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-48 bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => navigate('/')}
          data-testid="button-back"
        >
          <ArrowBack sx={{ fontSize: 24 }} />
        </Button>
        <img
          src={workTypeImage}
          alt={getWorkTypeName(job.workType)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="p-4 -mt-8 relative z-10">
        {/* Job Title Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1" data-testid="text-job-title">
                  {getWorkTypeName(job.workType)}
                </h1>
                <p className="text-sm text-muted-foreground" data-testid="text-employer">
                  Employer #{job.employerId.slice(0, 8)}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs" data-testid="badge-status">
                {job.status}
              </Badge>
            </div>

            {/* Wage Info */}
            <div className="flex items-center gap-4 py-3 border-t border-b border-border">
              <div>
                <p className="text-2xl font-bold text-primary" data-testid="text-wage">
                  ₹{job.wage}
                </p>
                <p className="text-xs text-muted-foreground">{job.wageType}</p>
              </div>
              {job.headcount && job.headcount > 1 && (
                <div className="ml-auto">
                  <p className="text-lg font-semibold text-foreground" data-testid="text-headcount">
                    {job.headcount} workers
                  </p>
                  <p className="text-xs text-muted-foreground">needed</p>
                </div>
              )}
            </div>

            {/* Location & Time */}
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <LocationOn sx={{ fontSize: 18 }} className="text-muted-foreground" />
                <span className="text-foreground" data-testid="text-location">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarMonth sx={{ fontSize: 18 }} className="text-muted-foreground" />
                <span className="text-muted-foreground" data-testid="text-posted">
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Job Description</h2>
            <p className="text-foreground whitespace-pre-wrap" data-testid="text-description">
              {job.description}
            </p>
          </CardContent>
        </Card>

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-foreground mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" data-testid={`badge-skill-${index}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Section */}
        {user?.role === 'worker' && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {hasUserApplied ? 'Application Status' : 'Apply for this Job'}
              </h2>

              {hasUserApplied ? (
                <Alert className="mb-4">
                  <AlertDescription>
                    You have already applied for this job. The employer will contact you if selected.
                  </AlertDescription>
                </Alert>
              ) : job.status !== 'open' ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    This job is no longer accepting applications (Status: {job.status}).
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Textarea
                    placeholder="Tell the employer why you're a good fit (optional)..."
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    className="mb-4 min-h-24"
                    data-testid="input-application-message"
                  />
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleApply}
                    disabled={createApplicationMutation.isPending}
                    data-testid="button-apply"
                  >
                    {createApplicationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Employer Actions */}
        {user?.role === 'employer' && job.employerId === user.id && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Job Management
              </h2>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <strong>{applications.length}</strong> application{applications.length !== 1 ? 's' : ''} received
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/jobs/${jobId}/applications`)}
                  data-testid="button-view-applications"
                >
                  View Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Non-worker users */}
        {!user || (user.role !== 'worker' && user.role !== 'employer') && (
          <Card>
            <CardContent className="p-4">
              <Alert>
                <AlertDescription>
                  {!user
                    ? 'Please log in to apply for jobs.'
                    : 'Only workers can apply for jobs.'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
