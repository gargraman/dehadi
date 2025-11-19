import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, MapPin, IndianRupee, Briefcase, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useJob, useCreateApplication, useJobApplications } from '@/hooks/useJobs';

// Get work type emoji for simple visual recognition
const getWorkTypeEmoji = (workType: string) => {
  const emojiMap: Record<string, string> = {
    mason: '🧱',
    electrician: '⚡',
    plumber: '🔧',
    carpenter: '🔨',
    painter: '🎨',
    helper: '🤝',
    driver: '🚗',
    cleaner: '✨',
    cook: '👨‍🍳',
    security: '🛡️',
  };
  return emojiMap[workType.toLowerCase()] || '💼';
};

// Simple work type names in Hindi + English
const getWorkTypeName = (workType: string) => {
  const names: Record<string, string> = {
    mason: '🧱 मेसन (Mason)',
    electrician: '⚡ बिजली वाला (Electrician)',
    plumber: '🔧 नल वाला (Plumber)',
    carpenter: '🔨 बढ़ई (Carpenter)',
    painter: '🎨 रंगाई (Painter)',
    helper: '🤝 मददगार (Helper)',
    driver: '🚗 ड्राइवर (Driver)',
    cleaner: '✨ सफाई (Cleaner)',
    cook: '👨‍🍳 खाना बनाने वाला (Cook)',
    security: '🛡️ सुरक्षा गार्ड (Security)',
  };
  return names[workType] || `💼 ${workType}`;
};

export default function JobDetails() {
  const [, params] = useRoute('/jobs/:id');
  const [, navigate] = useLocation();
  const jobId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: job, isLoading, error } = useJob(jobId || null);
  const { data: applications = [] } = useJobApplications(jobId || null);
  const createApplicationMutation = useCreateApplication();

  // Check if current user has already applied
  const hasUserApplied = applications.some(app => app.workerId === user?.id);

  const handleApply = () => {
    if (!jobId) return;

    createApplicationMutation.mutate(
      {
        jobId,
        message: `मैं ${getWorkTypeName(job?.workType || '')} का काम कर सकता हूँ। मुझे यह काम चाहिए।`,
      },
      {
        onSuccess: () => {
          toast({
            title: '✅ काम के लिए अप्लाई हो गया!',
            description: 'आपका नाम काम देने वाले को भेज दिया गया है।',
          });
        },
        onError: (error) => {
          toast({
            title: '❌ अप्लाई नहीं हुआ',
            description: error instanceof Error && error.message.includes('duplicate key')
              ? 'आप पहले से ही इस काम के लिए अप्लाई कर चुके हैं।'
              : 'कुछ गड़बड़ी हुई। फिर से कोशिश करें।',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="p-4 text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-2xl font-bold text-gray-700">लोड हो रहा है...</p>
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <header className="bg-red-500 text-white px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold">❌ काम नहीं मिला</h1>
              <p className="text-red-100">Job Not Found</p>
            </div>
          </div>
        </header>

        <div className="text-center py-16 px-4">
          <div className="text-8xl mb-6">😔</div>
          <p className="text-2xl font-bold text-gray-700 mb-4">यह काम उपलब्ध नहीं है</p>
          <p className="text-lg text-gray-500 mb-8">This job is not available</p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-2xl"
          >
            🏠 वापस होम पेज पर जाएं
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Simple Header */}
      <header className="bg-green-500 text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">💼 काम की जानकारी</h1>
            <p className="text-green-100">Job Details</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8">
        {/* Giant Job Card */}
        <div className="bg-white border-4 border-green-200 rounded-3xl p-8 mb-8 shadow-xl">
          {/* Work Type with Big Emoji */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{getWorkTypeEmoji(job.workType)}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-job-title">
              {getWorkTypeName(job.workType)}
            </h1>
          </div>

          {/* Key Info - Simple and Big */}
          <div className="space-y-6">
            {/* Wage - Most Important */}
            <div className="text-center bg-green-50 p-6 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee size={32} className="text-green-500" />
                <span className="text-4xl font-bold text-green-800" data-testid="text-wage">
                  {job.wage}
                </span>
              </div>
              <p className="text-xl text-green-700">रोज का पैसा (Per Day)</p>
            </div>

            {/* Location */}
            <div className="text-center bg-blue-50 p-6 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin size={32} className="text-blue-500" />
                <span className="text-2xl font-bold text-blue-800" data-testid="text-location">
                  {job.location}
                </span>
              </div>
              <p className="text-lg text-blue-600">काम की जगह (Work Location)</p>
            </div>

            {/* People Needed */}
            {job.headcount && job.headcount > 1 && (
              <div className="text-center bg-orange-50 p-6 rounded-2xl" data-testid="text-headcount">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-2xl font-bold text-orange-800">{job.headcount} लोग चाहिए</p>
                <p className="text-lg text-orange-600">{job.headcount} People Needed</p>
              </div>
            )}
          </div>
        </div>

        {/* Simple Job Description */}
        <div className="bg-gray-50 p-6 rounded-2xl mb-8">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">📝</div>
            <h2 className="text-2xl font-bold text-gray-800">काम का विवरण</h2>
            <p className="text-lg text-gray-600">Work Description</p>
          </div>
          <p className="text-lg text-gray-700 text-center leading-relaxed" data-testid="text-description">
            {job.description}
          </p>
        </div>

        {/* Application Section - HUGE BUTTON */}
        {user?.role === 'worker' && (
          <div className="text-center">
            {hasUserApplied ? (
              <div className="bg-yellow-50 border-4 border-yellow-200 p-8 rounded-2xl">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-2xl font-bold text-yellow-800 mb-2">आप अप्लाई कर चुके हैं!</p>
                <p className="text-lg text-yellow-700">You have already applied!</p>
                <p className="text-base text-yellow-600 mt-4">
                  काम देने वाला आपको फोन करेगा अगर आप सेलेक्ट हुए
                </p>
              </div>
            ) : job.status !== 'open' ? (
              <div className="bg-red-50 border-4 border-red-200 p-8 rounded-2xl">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-2xl font-bold text-red-800 mb-2">यह काम बंद हो गया</p>
                <p className="text-lg text-red-700">This job is closed</p>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handleApply}
                disabled={createApplicationMutation.isPending}
                className="w-full h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl rounded-3xl"
                data-testid="button-apply"
              >
                {createApplicationMutation.isPending ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <div className="text-xl font-bold">भेजा जा रहा है...</div>
                    <div className="text-sm opacity-90">Applying...</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Briefcase size={48} />
                    <div className="text-2xl font-bold">🤝 इस काम के लिए अप्लाई करें</div>
                    <div className="text-sm opacity-90">Apply for This Job</div>
                  </div>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Contact/Call to Action for Employers */}
        {user?.role === 'employer' && job.employerId === user.id && (
          <div className="text-center">
            <div className="bg-blue-50 border-4 border-blue-200 p-8 rounded-2xl mb-4">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-2xl font-bold text-blue-800 mb-2">{applications.length} लोगों ने अप्लाई किया</p>
              <p className="text-lg text-blue-700">{applications.length} People Applied</p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate(`/jobs/${jobId}/applications`)}
              className="w-full h-20 bg-blue-500 hover:bg-blue-600 text-white text-xl rounded-2xl"
              data-testid="button-view-applications"
            >
              📋 अप्लाई करने वाले देखें
            </Button>
          </div>
        )}

        {/* Login Required */}
        {!user && (
          <div className="bg-gray-50 p-8 rounded-2xl text-center">
            <div className="text-6xl mb-4">🔐</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">लॉगिन करें</p>
            <p className="text-lg text-gray-600 mb-6">Please login to apply</p>
            <Button
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-2xl"
            >
              लॉगिन करें →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
