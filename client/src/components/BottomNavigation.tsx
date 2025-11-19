import { Home, Briefcase, MessageCircle, Search } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

// Super simple navigation - only what people actually need
const workerNavigationItems = [
  { icon: Home, label: '🏠 घर', englishLabel: 'Home', path: '/', testId: 'nav-home' },
  { icon: Search, label: '🔍 खोजें', englishLabel: 'Search', path: '/search', testId: 'nav-search' },
  { icon: MessageCircle, label: '💬 बात करें', englishLabel: 'Messages', path: '/messages', testId: 'nav-messages' },
];

const employerNavigationItems = [
  { icon: Home, label: '🏠 घर', englishLabel: 'Home', path: '/', testId: 'nav-home' },
  { icon: Briefcase, label: '📝 काम दें', englishLabel: 'Post Work', path: '/post-job', testId: 'nav-post-job' },
  { icon: MessageCircle, label: '💬 बात करें', englishLabel: 'Messages', path: '/messages', testId: 'nav-messages' },
];

export default function BottomNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  // Choose navigation based on user role
  const navigationItems = user?.role === 'employer' ? employerNavigationItems : workerNavigationItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-8 border-blue-500 z-50 safe-area-pb shadow-2xl">
      <div className="flex items-center justify-around h-24 max-w-screen-xl mx-auto px-2">
        {navigationItems.map(({ icon: Icon, label, englishLabel, path, testId }) => {
          const isActive = location === path || (path === '/' && (location === '/search' || location === '/nearby'));
          return (
            <Link key={path} href={path}>
              <button
                data-testid={testId}
                className={`flex flex-col items-center justify-center gap-3 px-6 py-4 min-w-[100px] min-h-[80px] rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow-2xl transform scale-110 border-2 border-blue-300'
                    : 'text-gray-700 hover:bg-blue-50 active:scale-95 hover:shadow-lg'
                }`}
              >
                <Icon size={isActive ? 40 : 36} className={isActive ? 'drop-shadow-lg' : ''} />
                <span className={`font-bold leading-tight text-center ${isActive ? 'text-lg' : 'text-base'}`}>
                  <div className="mb-1">{label}</div>
                  <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>{englishLabel}</div>
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
