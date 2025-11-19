import { useState } from 'react';
import { ArrowLeft, Briefcase, Timer, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useWorkerApplications } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import ApplicationCard from '@/components/ApplicationCard';

export default function MyApplications() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: applications = [], isLoading, error } = useWorkerApplications();

  // Filter applications by status
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');
  const withdrawnApplications = applications.filter(app => app.status === 'withdrawn');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Timer size={20} className="text-yellow-600" />;
      case 'accepted':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'rejected':
        return <X size={20} className="text-red-600" />;
      case 'withdrawn':
        return <X size={20} className="text-gray-600" />;
      default:
        return <Briefcase size={20} />;
    }
  };

  const getStatusCounts = () => {
    return {
      pending: pendingApplications.length,
      accepted: acceptedApplications.length,
      rejected: rejectedApplications.length,
      withdrawn: withdrawnApplications.length,
    };
  };

  const statusCounts = getStatusCounts();

  if (!user || user.role !== 'worker') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              This page is only available for workers.
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
          <div>
            <h1 className="text-xl font-bold text-foreground">My Applications</h1>
            <p className="text-sm text-muted-foreground">
              Track your job applications
            </p>
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon('withdrawn')}
              </div>
              <div className="text-2xl font-bold">{statusCounts.withdrawn}</div>
              <div className="text-xs text-muted-foreground">Withdrawn</div>
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
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                    {statusCounts.pending}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs">
              Accepted
            </TabsTrigger>
            <TabsTrigger value="other" className="text-xs">
              Other
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {isLoading ? (
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
                  <Briefcase size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't applied to any jobs yet. Start exploring opportunities!
                  </p>
                  <Button onClick={() => navigate('/search')}>
                    Find Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showWorkerActions={true}
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
                    All your applications have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showWorkerActions={true}
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
                    Keep applying to more jobs to increase your chances!
                  </p>
                  <Button onClick={() => navigate('/search')} className="mt-4">
                    Find More Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {acceptedApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showWorkerActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-4 mt-4">
            {[...rejectedApplications, ...withdrawnApplications].length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <X size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Other Applications</h3>
                  <p className="text-muted-foreground">
                    No rejected or withdrawn applications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...rejectedApplications, ...withdrawnApplications].map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    showWorkerActions={false}
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