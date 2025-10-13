import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import JobCard from '@/components/JobCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    title: 'Carpenter (Shuttering)',
    employer: 'Urban Developers',
    location: 'Goregaon, Mumbai',
    distance: '4.2 km away',
    wageType: 'daily' as const,
    wage: '1100',
    skills: ['Shuttering', 'Finishing', 'Wood Work'],
    postedTime: '5 hours ago',
  },
];

export default function Search() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Search</h1>
      </header>

      {/* Search & Filter */}
      <div className="p-4 bg-card border-b border-card-border space-y-3">
        <div className="flex gap-2">
          <SearchBar className="flex-1" />
          <FilterPanel />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="jobs" data-testid="tab-jobs">Jobs</TabsTrigger>
            <TabsTrigger value="workers" data-testid="tab-workers">Workers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="p-4">
        <Tabs value={activeTab}>
          <TabsContent value="jobs" className="space-y-4 mt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Found <span className="font-semibold text-foreground">127 jobs</span> matching your criteria
            </p>
            {mockJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </TabsContent>
          <TabsContent value="workers" className="mt-0">
            <p className="text-sm text-muted-foreground text-center py-8">
              Search for workers by skills or location
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
