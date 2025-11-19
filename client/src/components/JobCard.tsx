import { useLocation } from 'wouter';
import { MapPin, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

// Get simple work type emoji
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
  const wageLabel = wageType === 'daily' ? '/दिन' : wageType === 'hourly' ? '/घंटा' : '';
  const workEmoji = getWorkTypeEmoji(title);

  // Simple status check
  const isAvailable = status === 'open';

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl active:scale-98 border-2 ${
        isAvailable ? 'border-green-200 bg-white' : 'border-gray-200 bg-gray-50'
      }`}
      data-testid={`job-card-${id}`}
      onClick={() => navigate(`/jobs/${id}`)}
    >
      <CardContent className="p-6">
        {/* Main Job Info - Large and Clear */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-4xl">{workEmoji}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1" data-testid={`job-title-${id}`}>
                {title}
              </h3>
              <p className="text-base text-gray-600 flex items-center gap-1" data-testid={`location-${id}`}>
                <MapPin size={20} className="text-red-500" />
                {location}
              </p>
            </div>
          </div>

          {/* Large, Prominent Wage */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-2xl text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <IndianRupee size={18} />
              <span className="text-2xl font-bold">{wage}</span>
            </div>
            <p className="text-xs opacity-90">{wageLabel}</p>
          </div>
        </div>

        {/* Worker Count - If Multiple */}
        {headcount && headcount > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4" data-testid={`headcount-${id}`}>
            <p className="text-blue-800 font-semibold text-center">
              👥 {headcount} लोग चाहिए ({headcount} people needed)
            </p>
          </div>
        )}

        {/* Large Apply Button */}
        <Button
          className={`w-full h-16 text-xl font-bold rounded-2xl transition-all duration-200 ${
            isAvailable
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
            <>
              🤝 काम चाहिए
              <br />
              <span className="text-sm opacity-90">Apply for Work</span>
            </>
          ) : (
            <>
              ❌ काम बंद
              <br />
              <span className="text-sm opacity-75">Work Closed</span>
            </>
          )}
        </Button>

        {/* Time posted - Small and Simple */}
        <div className="text-center mt-3">
          <p className="text-sm text-gray-500">⏰ {postedTime}</p>
        </div>
      </CardContent>
    </Card>
  );
}
