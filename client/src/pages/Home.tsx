import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Notifications } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data
const mockJobs = [
  {
    id: '1',
    title: 'Mason (Brick, Block, Plaster)',
    employer: 'ABC Construction Pvt Ltd',
    location: 'Andheri West, Mumbai',
    distance: '2.3 km away',
    wageType: 'daily' as const,
    wage: '850',
    skills: ['Brick Laying', 'Plastering', 'Block Work'],
    postedTime: '2 hours ago',
    headcount: 3,
  },
  {
    id: '2',
    title: 'Electrician',
    employer: 'Metro Builders',
    location: 'Powai, Mumbai',
    distance: '5.1 km away',
    wageType: 'daily' as const,
    wage: '1200',
    skills: ['Wiring', 'Panel Installation', 'Troubleshooting', 'Safety Certified'],
    postedTime: '1 day ago',
  },
  {
    id: '3',
    title: 'Plumber',
    employer: 'City Projects Ltd',
    location: 'Bandra, Mumbai',
    distance: '3.8 km away',
    wageType: 'daily' as const,
    wage: '1000',
    skills: ['Pipe Fitting', 'Drainage', 'Repair Work'],
    postedTime: '3 hours ago',
    headcount: 2,
  },
];

export default function Home() {
  const [userRole] = useState('worker'); // TODO: Get from auth context

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dehadi</h1>
            <p className="text-xs text-muted-foreground">Find work nearby</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 relative" data-testid="button-notifications">
              <Notifications sx={{ fontSize: 24 }} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
                3
              </Badge>
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="p-4 bg-card border-b border-card-border">
        <SearchBar />
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-foreground">245</span>
            <span className="text-muted-foreground ml-1">jobs nearby</span>
          </div>
          <div>
            <span className="font-semibold text-chart-3">12</span>
            <span className="text-muted-foreground ml-1">new today</span>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Jobs For You</h2>
          <Button variant="ghost" size="sm" data-testid="button-see-all">
            See All
          </Button>
        </div>
        {mockJobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  );
}
