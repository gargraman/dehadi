import { Home, Search, LocationOn, Chat, Person } from '@mui/icons-material';
import { Link, useLocation } from 'wouter';

const navigationItems = [
  { icon: Home, label: 'Home', path: '/', testId: 'nav-home' },
  { icon: Search, label: 'Search', path: '/search', testId: 'nav-search' },
  { icon: LocationOn, label: 'Nearby', path: '/nearby', testId: 'nav-nearby' },
  { icon: Chat, label: 'Messages', path: '/messages', testId: 'nav-messages' },
  { icon: Person, label: 'Profile', path: '/profile', testId: 'nav-profile' },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navigationItems.map(({ icon: Icon, label, path, testId }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button
                data-testid={testId}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon sx={{ fontSize: 28 }} />
                <span className="text-xs font-medium">{label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
