import { useLocation } from 'wouter';
import { 
  LocationOn, 
  Work, 
  AccessTime,
  PlayArrow,
  Payment,
  CheckCircle,
  Done,
  Cancel 
} from '@mui/icons-material';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getWorkTypeImage } from '@/lib/workTypeImages';

interface JobCardProps {
  id: string;
  title: string;
  employer: string;
  location: string;
  distance?: string;
  wageType: 'daily' | 'hourly' | 'fixed';
  wage: string;
  skills: string[];
  postedTime: string;
  headcount?: number;
  status?: string;
}

// Get status icon and color based on job status
function getStatusBadge(status: string) {
  const statusMap: Record<string, { icon: JSX.Element; label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    open: { 
      icon: <Work sx={{ fontSize: 16 }} />, 
      label: 'Open', 
      variant: 'default' 
    },
    in_progress: { 
      icon: <PlayArrow sx={{ fontSize: 16 }} />, 
      label: 'In Progress', 
      variant: 'default' 
    },
    awaiting_payment: { 
      icon: <Payment sx={{ fontSize: 16 }} />, 
      label: 'Awaiting Payment', 
      variant: 'secondary' 
    },
    paid: { 
      icon: <CheckCircle sx={{ fontSize: 16 }} />, 
      label: 'Paid', 
      variant: 'default' 
    },
    completed: { 
      icon: <Done sx={{ fontSize: 16 }} />, 
      label: 'Completed', 
      variant: 'default' 
    },
    cancelled: { 
      icon: <Cancel sx={{ fontSize: 16 }} />, 
      label: 'Cancelled', 
      variant: 'outline' 
    },
  };

  return statusMap[status] || statusMap.open;
}

export default function JobCard({
  id,
  title,
  employer,
  location,
  distance,
  wageType,
  wage,
  skills,
  postedTime,
  headcount,
  status = 'open',
}: JobCardProps) {
  const [, navigate] = useLocation();
  const wageLabel = wageType === 'daily' ? '/day' : wageType === 'hourly' ? '/hour' : '';
  const workImage = getWorkTypeImage(title);
  const statusInfo = getStatusBadge(status);

  return (
    <Card 
      className="hover-elevate active-elevate-2 overflow-hidden cursor-pointer" 
      data-testid={`job-card-${id}`}
      onClick={() => navigate(`/jobs/${id}`)}
    >
      {/* Work Type Image */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <img 
          src={workImage} 
          alt={title}
          className="w-full h-full object-cover"
          data-testid={`job-image-${id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-chart-3 text-white font-semibold px-3" 
          data-testid={`wage-${id}`}
        >
          ₹{wage}{wageLabel}
        </Badge>
        {status !== 'open' && (
          <Badge 
            variant={statusInfo.variant}
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm flex items-center gap-1" 
            data-testid={`status-${id}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1" data-testid={`job-title-${id}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5" data-testid={`employer-name-${id}`}>
              {employer}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1" data-testid={`location-${id}`}>
            <LocationOn sx={{ fontSize: 18 }} />
            <span>{location}</span>
          </div>
          {distance && (
            <span className="text-chart-4 font-medium" data-testid={`distance-${id}`}>
              {distance}
            </span>
          )}
        </div>

        {headcount && headcount > 1 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground" data-testid={`headcount-${id}`}>
            <Work sx={{ fontSize: 18 }} />
            <span>{headcount} positions</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs" data-testid={`skill-${id}-${index}`}>
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`posted-time-${id}`}>
            <AccessTime sx={{ fontSize: 16 }} />
            <span>{postedTime}</span>
          </div>
          <Button 
            className="min-h-9" 
            data-testid={`apply-button-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${id}`);
            }}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
