import { useLocation } from 'wouter';
import {
  Briefcase,
  Clock,
  CheckCircle,
  X,
  Timer,
  User,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateApplicationStatus } from '@/hooks/useJobs';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';
import type { EnrichedJobApplication } from '@shared/schema';

interface ApplicationCardProps {
  application: EnrichedJobApplication;
  showEmployerActions?: boolean;
  showWorkerActions?: boolean;
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { icon: JSX.Element; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: {
      icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
      label: 'Pending',
      variant: 'outline'
    },
    accepted: {
      icon: <CheckCircle sx={{ fontSize: 16 }} />,
      label: 'Accepted',
      variant: 'default'
    },
    rejected: {
      icon: <Cancel sx={{ fontSize: 16 }} />,
      label: 'Rejected',
      variant: 'destructive'
    },
    withdrawn: {
      icon: <Cancel sx={{ fontSize: 16 }} />,
      label: 'Withdrawn',
      variant: 'secondary'
    },
  };

  return statusMap[status] || statusMap.pending;
}

export default function ApplicationCard({
  application,
  showEmployerActions = false,
  showWorkerActions = false,
}: ApplicationCardProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const updateApplicationStatus = useUpdateApplicationStatus();

  const { job, worker } = application;
  const statusInfo = getStatusBadge(application.status);

  const handleAcceptApplication = async () => {
    try {
      // Use the atomic accept operation that handles both application acceptance and job assignment
      await updateApplicationStatus.mutateAsync({
        applicationId: application.id,
        status: 'accepted'
      });

      toast({
        title: "Application accepted",
        description: `${worker.fullName} has been assigned to this job.`,
      });
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Error",
        description: "Failed to accept application. The job may already be assigned to another worker.",
        variant: "destructive",
      });
    }
  };

  const handleRejectApplication = async () => {
    try {
      await updateApplicationStatus.mutateAsync({
        applicationId: application.id,
        status: 'rejected'
      });

      toast({
        title: "Application rejected",
        description: "The application has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawApplication = async () => {
    try {
      await updateApplicationStatus.mutateAsync({
        applicationId: application.id,
        status: 'withdrawn'
      });

      toast({
        title: "Application withdrawn",
        description: "Your application has been withdrawn.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className="hover-elevate active-elevate-2 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`/avatars/${worker.id}.png`} />
              <AvatarFallback>
                {worker.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {showEmployerActions ? worker.fullName : job.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {showEmployerActions ? `Applied for: ${job.title}` : `Employer: ${job.employerId}`}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <LocationOn sx={{ fontSize: 16 }} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Work sx={{ fontSize: 16 }} />
                  <span>₹{job.wage}/{job.wageType === 'daily' ? 'day' : job.wageType === 'hourly' ? 'hour' : 'fixed'}</span>
                </div>
              </div>
            </div>
          </div>

          <Badge
            variant={statusInfo.variant}
            className="flex items-center gap-1 shrink-0"
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {application.message && (
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Message:</span> {application.message}
            </p>
          </div>
        )}

        {worker.skills && worker.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-muted-foreground">Skills:</span>
            {worker.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{worker.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <AccessTime sx={{ fontSize: 16 }} />
            <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex gap-2">
            {showEmployerActions && application.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectApplication();
                  }}
                  disabled={updateApplicationStatus.isPending}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptApplication();
                  }}
                  disabled={updateApplicationStatus.isPending}
                >
                  Accept & Hire
                </Button>
              </>
            )}

            {showWorkerActions && application.status === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWithdrawApplication();
                }}
                disabled={updateApplicationStatus.isPending}
              >
                Withdraw
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs/${job.id}`);
              }}
            >
              View Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}