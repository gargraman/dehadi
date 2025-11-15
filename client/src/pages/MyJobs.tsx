import { useState } from 'react';
import { ArrowLeft, Briefcase, Plus, Users, CreditCard, CheckCircle, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useJobs, useUpdateJobStatus, useCompleteJob } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import JobCard from '@/components/JobCard';
import { toast } from '@/components/ui/use-toast';

export default function MyJobs() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: allJobs = [], isLoading, error } = useJobs();
  const updateJobStatus = useUpdateJobStatus();
  const completeJob = useCompleteJob();

  // Filter jobs for current employer
  const myJobs = allJobs.filter(job => job.employerId === user?.id);

  // Filter jobs by status
  const openJobs = myJobs.filter(job => job.status === 'open');
  const inProgressJobs = myJobs.filter(job => job.status === 'in_progress');
  const awaitingPaymentJobs = myJobs.filter(job => job.status === 'awaiting_payment');
  const completedJobs = myJobs.filter(job => ['completed', 'paid'].includes(job.status));
  const cancelledJobs = myJobs.filter(job => job.status === 'cancelled');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Briefcase size={20} className="text-blue-600" />;
      case 'in_progress':
        return <Play size={20} className="text-orange-600" />;
      case 'awaiting_payment':
        return <CreditCard size={20} className="text-purple-600" />;
      case 'completed':
      case 'paid':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'cancelled':
        return <X size={20} className="text-red-600" />;
      default:
        return <Briefcase size={20} />;
    }
  };

  const getStatusCounts = () => {
    return {
      open: openJobs.length,
      inProgress: inProgressJobs.length,
      awaitingPayment: awaitingPaymentJobs.length,
      completed: completedJobs.length,
      cancelled: cancelledJobs.length,
    };
  };

  const handleMarkAsCompleted = async (jobId: string) => {
    try {
      await completeJob.mutateAsync(jobId);
      toast({
        title: "Job marked as completed",
        description: "The job has been marked as completed and is awaiting payment.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark job as completed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await updateJobStatus.mutateAsync({
        jobId,
        status: 'cancelled'
      });
      toast({
        title: "Job cancelled",
        description: "The job has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const statusCounts = getStatusCounts();

  if (!user || user.role !== 'employer') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              This page is only available for employers.
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">My Jobs</h1>
            <p className="text-sm text-muted-foreground">
              Manage your job postings
            </p>
          </div>
          <Button
            onClick={() => navigate('/post-job')}
            className="shrink-0"
          >
            <Plus size={18} className="mr-1" />
            Post Job
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('open')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.open}</div>
              <div className="text-xs text-muted-foreground">Open Jobs</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('in_progress')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('awaiting_payment')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.awaitingPayment}</div>
              <div className="text-xs text-muted-foreground">Awaiting Payment</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('completed')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Briefcase size={20} className="text-gray-600" />
              </div>
              <div className="text-2xl font-bold">{myJobs.length}</div>
              <div className="text-xs text-muted-foreground">Total Jobs</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">
              All ({myJobs.length})
            </TabsTrigger>
            <TabsTrigger value="open" className="text-xs">
              <div className="flex items-center gap-1">
                Open
                {statusCounts.open > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                    {statusCounts.open}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              <div className="flex items-center gap-1">
                Active
                {(statusCounts.inProgress + statusCounts.awaitingPayment) > 0 && (
                  <Badge variant="default" className="text-xs px-1.5 py-0.5 h-5">
                    {statusCounts.inProgress + statusCounts.awaitingPayment}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading jobs...</div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-destructive mb-4">Failed to load jobs</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : myJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Briefcase size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by posting your first job to find skilled workers.
                  </p>
                  <Button onClick={() => navigate('/post-job')}>
                    <Plus size={18} className="mr-1" />
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div key={job.id} className="relative">
                    <JobCard
                      id={job.id}
                      title={job.title}
                      employer="You"
                      location={job.location}
                      wageType={job.wageType}
                      wage={job.wage.toString()}
                      skills={job.skills || []}
                      postedTime={new Date(job.createdAt).toLocaleDateString()}
                      headcount={job.headcount}
                      status={job.status}
                    />

                    {/* Action buttons overlay */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-background/90 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/jobs/${job.id}/applications`);
                        }}
                      >
                        <Users size={16} className="mr-1" />
                        Applications
                      </Button>

                      {job.status === 'in_progress' && (
                        <Button
                          size="sm"
                          className="bg-background/90 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsCompleted(job.id);
                          }}
                          disabled={completeJob.isPending}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Complete
                        </Button>
                      )}

                      {job.status === 'awaiting_payment' && (
                        <Button
                          size="sm"
                          className="bg-background/90 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment?jobId=${job.id}`);
                          }}
                        >
                          <CreditCard size={16} className="mr-1" />
                          Pay Now
                        </Button>
                      )}

                      {job.status === 'open' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-background/90 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelJob(job.id);
                          }}
                          disabled={updateJobStatus.isPending}
                        >
                          <X size={16} className="mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Other tab contents similar to above but with filtered jobs */}
          <TabsContent value="open" className="space-y-4 mt-4">
            {openJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Briefcase size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Open Jobs</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any open job postings currently.
                  </p>
                  <Button onClick={() => navigate('/post-job')}>
                    Post a New Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {openJobs.map((job) => (
                  <div key={job.id} className="relative">
                    <JobCard
                      id={job.id}
                      title={job.title}
                      employer="You"
                      location={job.location}
                      wageType={job.wageType}
                      wage={job.wage.toString()}
                      skills={job.skills || []}
                      postedTime={new Date(job.createdAt).toLocaleDateString()}
                      headcount={job.headcount}
                      status={job.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-4">
            {[...inProgressJobs, ...awaitingPaymentJobs].length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Play size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Jobs</h3>
                  <p className="text-muted-foreground">
                    You don't have any jobs in progress or awaiting payment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...inProgressJobs, ...awaitingPaymentJobs].map((job) => (
                  <div key={job.id} className="relative">
                    <JobCard
                      id={job.id}
                      title={job.title}
                      employer="You"
                      location={job.location}
                      wageType={job.wageType}
                      wage={job.wage.toString()}
                      skills={job.skills || []}
                      postedTime={new Date(job.createdAt).toLocaleDateString()}
                      headcount={job.headcount}
                      status={job.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-4">
            {completedJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Jobs</h3>
                  <p className="text-muted-foreground">
                    You haven't completed any jobs yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <div key={job.id} className="relative">
                    <JobCard
                      id={job.id}
                      title={job.title}
                      employer="You"
                      location={job.location}
                      wageType={job.wageType}
                      wage={job.wage.toString()}
                      skills={job.skills || []}
                      postedTime={new Date(job.createdAt).toLocaleDateString()}
                      headcount={job.headcount}
                      status={job.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-4">
            {cancelledJobs.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <X size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Cancelled Jobs</h3>
                  <p className="text-muted-foreground">
                    You haven't cancelled any jobs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cancelledJobs.map((job) => (
                  <div key={job.id} className="relative">
                    <JobCard
                      id={job.id}
                      title={job.title}
                      employer="You"
                      location={job.location}
                      wageType={job.wageType}
                      wage={job.wage.toString()}
                      skills={job.skills || []}
                      postedTime={new Date(job.createdAt).toLocaleDateString()}
                      headcount={job.headcount}
                      status={job.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}