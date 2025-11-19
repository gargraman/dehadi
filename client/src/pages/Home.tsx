import { useLocation } from 'wouter';
import { Mic, Briefcase, MapPin, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useJobs } from '@/hooks/useJobs';
import JobCard from '@/components/JobCard';

// Helper to get work type display name
const getWorkTypeName = (workType: string) => {
  const names: Record<string, string> = {
    mason: 'Mason',
    electrician: 'Electrician',
    plumber: 'Plumber',
    carpenter: 'Carpenter',
    painter: 'Painter',
    helper: 'Helper',
    driver: 'Driver',
    cleaner: 'Cleaner',
    cook: 'Cook',
    security: 'Security Guard',
  };
  return names[workType] || workType;
};

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: jobs = [], isLoading } = useJobs();

  // Show only 3 most relevant jobs for simplicity
  const relevantJobs = user?.role === 'worker' && user.skills
    ? jobs.filter(job =>
        user.skills?.some(skill => skill.toLowerCase() === job.workType.toLowerCase())
      ).slice(0, 3)
    : jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-white pb-32 px-4">
      {/* Giant Welcome Section */}
      <div className="text-center py-12">
        <div className="text-8xl mb-6">👋</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          नमस्ते{user ? `, ${user.fullName.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-2xl text-gray-600 mb-2">
          {user?.role === 'worker' ? '💼 काम खोजें' : '👥 मजदूर खोजें'}
        </p>
        <p className="text-lg text-gray-500">
          {user?.role === 'worker' ? 'Find Work Today' : 'Find Workers Today'}
        </p>
      </div>

      {/* Giant Action Buttons */}
      <div className="space-y-6 max-w-md mx-auto">
        {/* Voice Search - HUGE and obvious */}
        <Button
          size="lg"
          className="w-full h-24 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl rounded-3xl"
          onClick={() => {
            // TODO: Implement voice search
            console.log('Voice search activated');
            navigate('/search');
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Mic size={48} />
            <div className="text-xl font-bold">🎤 बोलकर खोजें</div>
            <div className="text-sm opacity-90">Speak to Find Work</div>
          </div>
        </Button>

        {/* Search by typing */}
        <Button
          size="lg"
          variant="outline"
          className="w-full h-24 border-4 border-blue-300 hover:bg-blue-50 rounded-3xl"
          onClick={() => navigate('/search')}
        >
          <div className="flex flex-col items-center gap-2">
            <Search size={48} className="text-blue-500" />
            <div className="text-xl font-bold text-blue-600">🔍 टाइप करके खोजें</div>
            <div className="text-sm text-blue-500">Search by Typing</div>
          </div>
        </Button>

        {/* Post Job (only for employers) */}
        {user?.role === 'employer' && (
          <Button
            size="lg"
            className="w-full h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl rounded-3xl"
            onClick={() => navigate('/post-job')}
          >
            <div className="flex flex-col items-center gap-2">
              <Plus size={48} />
              <div className="text-xl font-bold">📝 काम का इश्तिहार दें</div>
              <div className="text-sm opacity-90">Post Work</div>
            </div>
          </Button>
        )}
      </div>

      {/* Simple Job Count Display */}
      {jobs.length > 0 && (
        <div className="text-center mt-12 bg-green-50 p-6 rounded-3xl mx-4">
          <div className="text-6xl mb-3">💼</div>
          <p className="text-3xl font-bold text-green-800 mb-2">{jobs.length}</p>
          <p className="text-xl text-green-700">काम उपलब्ध हैं</p>
          <p className="text-lg text-green-600">Jobs Available Today</p>
        </div>
      )}

      {/* Show 3 Jobs Maximum */}
      {relevantJobs.length > 0 && (
        <div className="mt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🔥 आज का काम</h2>
            <p className="text-lg text-gray-600">Today's Work</p>
          </div>

          <div className="space-y-6">
            {relevantJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={getWorkTypeName(job.workType)}
                employer="काम देने वाला"
                location={job.location}
                distance="पास में"
                wageType={job.wageType as 'daily' | 'hourly' | 'fixed'}
                wage={job.wage.toString()}
                skills={job.skills || []}
                postedTime="आज"
                headcount={job.headcount || undefined}
                status={job.status}
              />
            ))}
          </div>

          {/* See More Button */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="outline"
              className="border-4 border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-6 text-xl rounded-2xl"
              onClick={() => navigate('/search')}
            >
              और भी देखें →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
