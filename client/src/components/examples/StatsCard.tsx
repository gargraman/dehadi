import StatsCard from '../StatsCard';
import { Briefcase, User, DollarSign, CheckCircle } from 'lucide-react';

export default function StatsCardExample() {
  return (
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
  );
}
