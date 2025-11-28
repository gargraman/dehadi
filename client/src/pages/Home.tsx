import { useLocation } from 'wouter';
import { Mic, Search, PlusCircle, Briefcase, Users, TrendingUp, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useJobs } from '@/hooks/useJobs';
import JobCard from '@/components/JobCard';

const getWorkTypeName = (workType: string) => {
  const names: Record<string, string> = {
    mason: 'Mason / राजमिस्त्री',
    electrician: 'Electrician / बिजली मिस्त्री',
    plumber: 'Plumber / प्लंबर',
    carpenter: 'Carpenter / बढ़ई',
    painter: 'Painter / पेंटर',
    helper: 'Helper / हेल्पर',
    driver: 'Driver / ड्राइवर',
    cleaner: 'Cleaner / सफाई',
    cook: 'Cook / रसोइया',
    security: 'Security / सुरक्षा गार्ड',
  };
  return names[workType] || workType;
};

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: jobs = [], isLoading } = useJobs();

  const relevantJobs = user?.role === 'worker' && user.skills
    ? jobs.filter(job =>
        user.skills?.some(skill => skill.toLowerCase() === job.workType.toLowerCase())
      ).slice(0, 3)
    : jobs.slice(0, 3);

  const firstName = user?.fullName?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-background pb-28 px-4">
      {/* Welcome Header */}
      <div className="pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              नमस्ते{firstName ? `, ${firstName}` : ''}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.role === 'worker' ? 'आज काम खोजें • Find work today' : 'मजदूर खोजें • Find workers'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats for Workers */}
      {user?.role === 'worker' && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Briefcase className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{jobs.length}</p>
              <p className="text-xs text-muted-foreground">उपलब्ध काम</p>
              <p className="text-[10px] text-muted-foreground">Jobs Available</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-muted-foreground">आवेदन</p>
              <p className="text-[10px] text-muted-foreground">Applications</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="space-y-4 mb-8">
        {/* Voice Search Button */}
        <Button
          size="lg"
          className="w-full h-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-lg"
          onClick={() => navigate('/search')}
          data-testid="button-voice-search"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold">बोलकर खोजें</div>
              <div className="text-sm opacity-90">Speak to Search</div>
            </div>
          </div>
        </Button>

        {/* Text Search Button */}
        <Button
          size="lg"
          variant="outline"
          className="w-full h-16 rounded-2xl border-2"
          onClick={() => navigate('/search')}
          data-testid="button-text-search"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-left flex-1">
              <div className="text-base font-semibold">टाइप करके खोजें</div>
              <div className="text-sm text-muted-foreground">Search by typing</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Button>

        {/* Post Job Button (Employer Only) */}
        {user?.role === 'employer' && (
          <Button
            size="lg"
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl"
            onClick={() => navigate('/post-job')}
            data-testid="button-post-job"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <div className="text-base font-semibold">नया काम पोस्ट करें</div>
                <div className="text-sm opacity-90">Post New Job</div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70" />
            </div>
          </Button>
        )}

        {/* Nearby Jobs Button */}
        <Button
          size="lg"
          variant="outline"
          className="w-full h-16 rounded-2xl border-2"
          onClick={() => navigate('/nearby')}
          data-testid="button-nearby"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left flex-1">
              <div className="text-base font-semibold">पास के काम</div>
              <div className="text-sm text-muted-foreground">Nearby Jobs</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Button>
      </div>

      {/* Available Jobs Section */}
      {relevantJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">आज के काम</h2>
              <span className="text-sm text-muted-foreground">Today's Jobs</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/search')}
              className="text-primary"
            >
              सभी देखें
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {relevantJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={getWorkTypeName(job.workType)}
                employer="Employer"
                location={job.location}
                distance="Nearby"
                wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                wage={job.wage.toString()}
                skills={job.skills || []}
                postedTime="Today"
                headcount={job.headcount || undefined}
                status={job.status}
              />
            ))}
          </div>

          {jobs.length > 3 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl"
                onClick={() => navigate('/search')}
              >
                और काम देखें • View More Jobs
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && jobs.length === 0 && (
        <Card className="text-center p-8">
          <CardContent className="space-y-4">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">अभी कोई काम नहीं है</h3>
              <p className="text-sm text-muted-foreground">No jobs available right now</p>
            </div>
            <Button onClick={() => navigate('/search')} className="mt-4">
              <Search className="w-4 h-4 mr-2" />
              काम खोजें • Search Jobs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
