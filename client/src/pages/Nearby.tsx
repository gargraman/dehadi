import { useState } from 'react';
import JobCard from '@/components/JobCard';
import { MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const radiusOptions = [2, 5, 10, 25];

const mockNearbyJobs = [
  {
    id: '1',
    title: 'Helper - Construction Site',
    employer: 'Quick Build Co.',
    location: 'Andheri West, Mumbai',
    distance: '1.2 km away',
    wageType: 'daily' as const,
    wage: '600',
    skills: ['Loading', 'Cleaning', 'General Help'],
    postedTime: '1 hour ago',
    headcount: 5,
  },
  {
    id: '2',
    title: 'Painter',
    employer: 'Home Decor Services',
    location: 'Versova, Mumbai',
    distance: '1.8 km away',
    wageType: 'daily' as const,
    wage: '900',
    skills: ['Wall Painting', 'Spray Painting'],
    postedTime: '3 hours ago',
  },
];

export default function Nearby() {
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    setIsLocating(true);
    console.log('Getting current location...');
    setTimeout(() => setIsLocating(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Nearby Jobs</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocateMe}
            disabled={isLocating}
            data-testid="button-locate-me"
          >
            <MapPinned size={18} className="mr-1" />
            {isLocating ? 'Locating...' : 'Locate Me'}
          </Button>
        </div>
      </header>

      {/* Current Location Display */}
      <div className="px-4 py-3 bg-primary/5 border-b border-primary/10">
        <p className="text-sm text-muted-foreground">Current location</p>
        <p className="font-medium text-foreground">Andheri West, Mumbai</p>
      </div>

      {/* Radius Selector */}
      <div className="p-4 bg-card border-b border-card-border">
        <p className="text-sm font-medium text-foreground mb-3">Search Radius</p>
        <div className="flex gap-2">
          {radiusOptions.map((radius) => (
            <Button
              key={radius}
              variant={selectedRadius === radius ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRadius(radius)}
              className="flex-1"
              data-testid={`radius-${radius}`}
            >
              {radius} km
            </Button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mx-4 mt-4 h-48 bg-muted rounded-lg flex items-center justify-center border border-border">
        <div className="text-center">
          <MapPinned size={48} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Map View</p>
          <p className="text-xs text-muted-foreground mt-1">Showing jobs within {selectedRadius} km</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {mockNearbyJobs.length} jobs nearby
          </h2>
          <Badge variant="secondary" className="bg-chart-3 text-white">
            Within {selectedRadius} km
          </Badge>
        </div>
        {mockNearbyJobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
}
