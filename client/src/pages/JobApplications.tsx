import { useState } from 'react';
import { ArrowLeft, Briefcase, Timer, CheckCircle, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLocation, useRoute } from 'wouter';
import { useJobApplications, useJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import ApplicationCard from '@/components/ApplicationCard';
import JobCard from '@/components/JobCard';

export default function JobApplications() {
  const [match, params] = useRoute('/jobs/:jobId/applications');
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const jobId = params?.jobId ?? null;
  const { data: job, isLoading: isLoadingJob } = useJob(jobId);
  const { data: applications = [], isLoading: isLoadingApplications, error } = useJobApplications(jobId);

  // Filter applications by status
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Timer size={20} className="text-yellow-600" />;
      case 'accepted':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'rejected':
        return <X size={20} className="text-red-600" />;
      default:
        return <User size={20} />;
    }
  };

  const getStatusCounts = () => {
    return {
      pending: pendingApplications.length,
      accepted: acceptedApplications.length,
      rejected: rejectedApplications.length,
    };
  };

  const statusCounts = getStatusCounts();

  // Check if user is the employer who posted this job
  if (!user || user.role !== 'employer' || (job && job.employerId !== user.id)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              You can only view applications for your own job postings.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingJob) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Job Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              The job you're looking for doesn't exist.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/my-jobs')}
            >
              View My Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="h-10 w-10"
          >
            <ArrowLeft />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Applications</h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {job.title}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {applications.length} total
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Job Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <JobCard
              id={job.id}
              title={job.title}
              employer="You"
              location={job.location}
              wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
              wage={job.wage.toString()}
              skills={job.skills || []}
              postedTime={new Date(job.createdAt).toLocaleDateString()}
              headcount={job.headcount ?? undefined}
              status={job.status}
            />
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('pending')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('accepted')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.accepted}</div>
              <div className="text-xs text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('rejected')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.rejected}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              <div className="flex items-center gap-1">
                Pending
                {statusCounts.pending > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-5">
                    {statusCounts.pending}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs">
              Accepted
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {isLoadingApplications ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading applications...</div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-destructive mb-4">Failed to load applications</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <User size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    No one has applied to this job yet. Your job posting is live and workers can apply.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => navigate(`/jobs/${jobId}`)} variant="outline">
                      View Job
                    </Button>
                    <Button onClick={() => navigate('/post-job')}>
                      Post Another Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showEmployerActions={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Timer size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Applications</h3>
                  <p className="text-muted-foreground">
                    All applications have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Timer size={20} />
                      <span className="font-medium">
                        {statusCounts.pending} application{statusCounts.pending !== 1 ? 's' : ''} waiting for your review
                      </span>
                    </div>
                  </CardContent>
                </Card>
                {pendingApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showEmployerActions={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4 mt-4">
            {acceptedApplications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Accepted Applications</h3>
                  <p className="text-muted-foreground">
                    You haven't accepted any applications yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {acceptedApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showEmployerActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-4">
            {rejectedApplications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <X size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Rejected Applications</h3>
                  <p className="text-muted-foreground">
                    You haven't rejected any applications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rejectedApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showEmployerActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}