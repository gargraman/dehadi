import { useLocation } from 'wouter';
import { MapPin, IndianRupee, Users, Clock, Wrench, Zap, Droplets, Hammer, Paintbrush, HardHat, Car, Sparkles, ChefHat, Shield, Briefcase, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

const getWorkTypeIcon = (workType: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    mason: <Wrench className="w-6 h-6" />,
    electrician: <Zap className="w-6 h-6" />,
    plumber: <Droplets className="w-6 h-6" />,
    carpenter: <Hammer className="w-6 h-6" />,
    painter: <Paintbrush className="w-6 h-6" />,
    helper: <HardHat className="w-6 h-6" />,
    driver: <Car className="w-6 h-6" />,
    cleaner: <Sparkles className="w-6 h-6" />,
    cook: <ChefHat className="w-6 h-6" />,
    security: <Shield className="w-6 h-6" />,
  };
  return iconMap[workType.toLowerCase()] || <Briefcase className="w-6 h-6" />;
};

const getWorkTypeColor = (workType: string) => {
  const colorMap: Record<string, string> = {
    mason: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    electrician: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    plumber: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    carpenter: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    painter: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    helper: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    driver: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
    cleaner: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    cook: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    security: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };
  return colorMap[workType.toLowerCase()] || 'bg-muted text-muted-foreground';
};

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
  
  const wageLabel = wageType === 'daily' ? '/day' : wageType === 'hourly' ? '/hr' : '';
  const wageLabelHindi = wageType === 'daily' ? 'प्रतिदिन' : wageType === 'hourly' ? 'प्रति घंटा' : 'कुल';
  const isAvailable = status === 'open';

  const workType = title.split(' ')[0].toLowerCase();
  const iconColor = getWorkTypeColor(workType);

  return (
    <Card
      className={`overflow-visible cursor-pointer transition-all duration-200 hover-elevate ${
        isAvailable ? 'border-border' : 'border-muted bg-muted/30'
      }`}
      data-testid={`job-card-${id}`}
      onClick={() => navigate(`/jobs/${id}`)}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Work Type Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
            {getWorkTypeIcon(workType)}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground truncate" data-testid={`job-title-${id}`}>
              {title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-destructive shrink-0" />
              <span className="truncate" data-testid={`location-${id}`}>{location}</span>
            </div>
          </div>

          {/* Wage Badge */}
          <div className="bg-green-600 text-white px-3 py-2 rounded-xl text-center shrink-0">
            <div className="flex items-center gap-0.5 justify-center">
              <IndianRupee className="w-4 h-4" />
              <span className="text-lg font-bold">{wage}</span>
            </div>
            <p className="text-[10px] opacity-90">{wageLabelHindi}</p>
          </div>
        </div>

        {/* Worker Count Badge */}
        {headcount && headcount > 1 && (
          <div className="flex items-center gap-2 mb-3 p-2 bg-primary/5 rounded-lg" data-testid={`headcount-${id}`}>
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {headcount} लोग चाहिए • {headcount} workers needed
            </span>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <Button
            className={`flex-1 h-12 text-base font-semibold rounded-xl ${
              isAvailable
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            data-testid={`apply-button-${id}`}
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) {
                navigate(`/jobs/${id}`);
              }
            }}
          >
            {isAvailable ? (
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                काम चाहिए • Apply
              </span>
            ) : (
              <span>काम बंद • Closed</span>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${id}`);
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Posted Time */}
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{postedTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
