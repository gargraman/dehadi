import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import JobCard from '@/components/JobCard';
import { MapPinned, Loader2, MapPin, AlertCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGeolocation, formatDistance } from '@/hooks/useGeolocation';
import type { Job } from '@shared/schema';

type JobWithDistance = Job & { distance: number };

const radiusOptions = [2, 5, 10, 25];

export default function Nearby() {
  const [selectedRadius, setSelectedRadius] = useState(5);
  const { 
    latitude, 
    longitude, 
    error: geoError, 
    isLoading: isLocating, 
    requestLocation,
    hasLocation,
    permissionState,
    isSupported
  } = useGeolocation();

  // Auto-request location on mount if not already available
  useEffect(() => {
    if (isSupported && !hasLocation && !isLocating && permissionState !== 'denied') {
      requestLocation();
    }
  }, [isSupported, hasLocation, isLocating, permissionState, requestLocation]);

  // Fetch nearby jobs when we have location
  const { 
    data: nearbyJobs = [], 
    isLoading: isLoadingJobs,
    refetch 
  } = useQuery<JobWithDistance[]>({
    queryKey: ['/api/jobs/nearby', latitude, longitude, selectedRadius],
    queryFn: async () => {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
      const response = await fetch(
        `/api/jobs/nearby?lat=${latitude}&lng=${longitude}&radius=${selectedRadius}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch nearby jobs');
      }
      return response.json();
    },
    enabled: hasLocation,
  });

  // Refetch when radius changes
  useEffect(() => {
    if (hasLocation) {
      refetch();
    }
  }, [selectedRadius, hasLocation, refetch]);

  const handleLocateMe = () => {
    requestLocation();
  };

  // Format employer name from job
  const getEmployerName = (job: Job) => {
    return job.employerId ? 'Employer' : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              <span className="block">पास की नौकरियां</span>
              <span className="block text-sm font-normal text-muted-foreground">Nearby Jobs</span>
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocateMe}
            disabled={isLocating}
            data-testid="button-locate-me"
          >
            {isLocating ? (
              <Loader2 size={18} className="mr-1 animate-spin" />
            ) : (
              <Navigation size={18} className="mr-1" />
            )}
            {isLocating ? 'खोज रहे...' : 'मुझे खोजें'}
          </Button>
        </div>
      </header>

      {!isSupported && (
        <Card className="mx-4 mt-4">
          <CardContent className="py-6 text-center">
            <AlertCircle size={48} className="text-destructive mx-auto mb-2" />
            <p className="text-foreground font-medium">Location Not Supported</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your browser does not support location services.
            </p>
          </CardContent>
        </Card>
      )}

      {geoError && (
        <Card className="mx-4 mt-4 border-destructive/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-medium text-sm">Location Error</p>
                <p className="text-sm text-muted-foreground mt-0.5">{geoError}</p>
                {permissionState === 'denied' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Please enable location access in your browser settings.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasLocation && (
        <div className="px-4 py-3 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">वर्तमान स्थान / Current location</p>
              <p className="text-sm font-medium text-foreground">
                {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-card border-b border-card-border">
        <p className="text-sm font-medium text-foreground mb-3">
          <span className="block">खोज दायरा</span>
          <span className="text-xs text-muted-foreground">Search Radius</span>
        </p>
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

      <div className="mx-4 mt-4 h-40 bg-muted rounded-lg flex items-center justify-center border border-border">
        <div className="text-center">
          <MapPinned size={40} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">नक्शा दृश्य / Map View</p>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedRadius} km के अंदर / Within {selectedRadius} km
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-base font-semibold text-foreground">
            {isLoadingJobs ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <>
                {nearbyJobs.length} नौकरियां मिलीं
                <span className="block text-xs font-normal text-muted-foreground">
                  {nearbyJobs.length} jobs found
                </span>
              </>
            )}
          </h2>
          <Badge variant="secondary" className="bg-chart-3 text-white">
            {selectedRadius} km के अंदर
          </Badge>
        </div>

        {!hasLocation && !isLocating && !geoError && (
          <Card>
            <CardContent className="py-8 text-center">
              <Navigation size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">Enable Location</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Allow location access to find jobs near you
              </p>
              <Button onClick={handleLocateMe} data-testid="button-enable-location">
                <MapPin size={18} className="mr-2" />
                Enable Location
              </Button>
            </CardContent>
          </Card>
        )}

        {isLocating && (
          <Card>
            <CardContent className="py-8 text-center">
              <Loader2 size={48} className="text-primary mx-auto mb-3 animate-spin" />
              <p className="text-foreground font-medium">Finding your location...</p>
              <p className="text-sm text-muted-foreground mt-1">
                आपका स्थान खोज रहे हैं...
              </p>
            </CardContent>
          </Card>
        )}

        {hasLocation && isLoadingJobs && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hasLocation && !isLoadingJobs && nearbyJobs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <MapPinned size={48} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No jobs found nearby</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try increasing the search radius
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                खोज दायरा बढ़ाकर देखें
              </p>
            </CardContent>
          </Card>
        )}

        {hasLocation && !isLoadingJobs && nearbyJobs.length > 0 && (
          <div className="space-y-4">
            {nearbyJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                employer={getEmployerName(job)}
                location={job.location}
                distance={formatDistance(job.distance)}
                wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                wage={job.wage.toString()}
                skills={job.skills || []}
                postedTime={new Date(job.createdAt).toLocaleDateString()}
                headcount={job.headcount || 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
