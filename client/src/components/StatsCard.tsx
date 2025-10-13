import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  testId?: string;
}

export default function StatsCard({ title, value, icon, trend, subtitle, testId }: StatsCardProps) {
  return (
    <Card className="hover-elevate" data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1" data-testid={`${testId}-title`}>{title}</p>
            <h3 className="text-2xl font-bold text-foreground mb-1" data-testid={`${testId}-value`}>{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground" data-testid={`${testId}-subtitle`}>{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                trend.isPositive ? 'text-chart-3' : 'text-destructive'
              }`} data-testid={`${testId}-trend`}>
                {trend.isPositive ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
                <span className="font-medium">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <div className="text-primary opacity-80">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
