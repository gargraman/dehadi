import StatsCard from '@/components/StatsCard';
import JobCard from '@/components/JobCard';
import { Briefcase, User, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockRecentJobs = [
  {
    id: '1',
    title: 'Mason Required - Urgent',
    employer: 'Quick Build Co.',
    location: 'Andheri, Mumbai',
    wageType: 'daily' as const,
    wage: '900',
    skills: ['Mason', 'Plastering'],
    postedTime: '1 hour ago',
    headcount: 2,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-3">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform Overview</p>
      </header>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <StatsCard
          title="Active Jobs"
          value="245"
          icon={<Briefcase size={32} />}
          trend={{ value: 12, isPositive: true }}
          testId="stats-active-jobs"
        />
        <StatsCard
          title="Total Workers"
          value="1,234"
          icon={<User size={32} />}
          trend={{ value: 8, isPositive: true }}
          testId="stats-total-workers"
        />
        <StatsCard
          title="Placements"
          value="892"
          subtitle="This month"
          icon={<CheckCircle size={32} />}
          trend={{ value: 5, isPositive: false }}
          testId="stats-placements"
        />
        <StatsCard
          title="Avg Wage"
          value="₹875"
          subtitle="Per day"
          icon={<DollarSign size={32} />}
          testId="stats-avg-wage"
        />
      </div>

      {/* Activity Section */}
      <div className="px-4 pb-4">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Latest Job Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle size={48} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No pending reviews</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verification Queue</span>
                <span className="font-semibold text-foreground">23 pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Users (24h)</span>
                <div className="flex items-center gap-1 text-chart-3">
                  <TrendingUp size={16} />
                  <span className="font-semibold">456</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-semibold text-foreground">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
