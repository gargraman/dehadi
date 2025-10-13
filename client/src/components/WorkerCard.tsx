import { LocationOn, Verified, Star } from '@mui/icons-material';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WorkerCardProps {
  id: string;
  name: string;
  photoUrl?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  experience: string;
  skills: string[];
  location: string;
  distance?: string;
  dailyRate?: string;
  hourlyRate?: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export default function WorkerCard({
  id,
  name,
  photoUrl,
  isVerified,
  rating,
  reviewCount,
  experience,
  skills,
  location,
  distance,
  dailyRate,
  hourlyRate,
  availability,
}: WorkerCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const availabilityColors = {
    available: 'bg-chart-3',
    busy: 'bg-chart-5',
    unavailable: 'bg-muted',
  };

  return (
    <Card className="hover-elevate active-elevate-2" data-testid={`worker-card-${id}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="relative">
            <Avatar className="h-16 w-16" data-testid={`avatar-${id}`}>
              <AvatarImage src={photoUrl} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-chart-3 rounded-full p-0.5" data-testid={`verified-badge-${id}`}>
                <Verified sx={{ fontSize: 16, color: 'white' }} />
              </div>
            )}
            <div 
              className={`absolute top-0 right-0 w-3 h-3 ${availabilityColors[availability]} border-2 border-card rounded-full`}
              data-testid={`availability-${id}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground" data-testid={`worker-name-${id}`}>
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1" data-testid={`rating-${id}`}>
                <Star sx={{ fontSize: 16, color: 'hsl(var(--chart-5))' }} />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground" data-testid={`experience-${id}`}>
                {experience}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5" data-testid={`skill-${id}-${index}`}>
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{skills.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground" data-testid={`location-${id}`}>
              <LocationOn sx={{ fontSize: 14 }} />
              <span>{location}</span>
              {distance && <span className="text-chart-4 font-medium ml-1">{distance}</span>}
            </div>

            <div className="flex items-center gap-3 mt-3">
              {dailyRate && (
                <div className="text-sm" data-testid={`daily-rate-${id}`}>
                  <span className="font-semibold text-foreground">₹{dailyRate}</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
              )}
              {hourlyRate && (
                <div className="text-sm" data-testid={`hourly-rate-${id}`}>
                  <span className="font-semibold text-foreground">₹{hourlyRate}</span>
                  <span className="text-muted-foreground">/hour</span>
                </div>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-auto"
                data-testid={`contact-button-${id}`}
                onClick={() => console.log('Contact clicked for worker:', id)}
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
