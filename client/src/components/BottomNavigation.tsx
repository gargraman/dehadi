import { Home, Search, MessageCircle, PlusCircle, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';

const workerNavigationItems = [
  { icon: Home, label: 'घर', englishLabel: 'Home', path: '/', testId: 'nav-home' },
  { icon: Search, label: 'खोजें', englishLabel: 'Search', path: '/search', testId: 'nav-search' },
  { icon: MessageCircle, label: 'संदेश', englishLabel: 'Messages', path: '/messages', testId: 'nav-messages' },
  { icon: User, label: 'प्रोफाइल', englishLabel: 'Profile', path: '/profile', testId: 'nav-profile' },
];

const employerNavigationItems = [
  { icon: Home, label: 'घर', englishLabel: 'Home', path: '/', testId: 'nav-home' },
  { icon: PlusCircle, label: 'काम दें', englishLabel: 'Post Job', path: '/post-job', testId: 'nav-post-job' },
  { icon: MessageCircle, label: 'संदेश', englishLabel: 'Messages', path: '/messages', testId: 'nav-messages' },
  { icon: User, label: 'प्रोफाइल', englishLabel: 'Profile', path: '/profile', testId: 'nav-profile' },
];

export default function BottomNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigationItems = user?.role === 'employer' ? employerNavigationItems : workerNavigationItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 safe-area-pb">
      <div className="flex items-center justify-around h-20 max-w-screen-xl mx-auto">
        {navigationItems.map(({ icon: Icon, label, englishLabel, path, testId }) => {
          const isActive = location === path || 
            (path === '/' && location === '/dashboard') ||
            (path === '/search' && location === '/nearby');
          
          return (
            <Link key={path} href={path}>
              <button
                data-testid={testId}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[72px] min-h-[64px] rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover-elevate'
                }`}
              >
                <Icon 
                  size={28} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-primary-foreground' : ''}
                />
                <div className="text-center">
                  <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-primary-foreground' : ''}`}>
                    {label}
                  </div>
                  <div className={`text-[10px] leading-tight ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {englishLabel}
                  </div>
                </div>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
