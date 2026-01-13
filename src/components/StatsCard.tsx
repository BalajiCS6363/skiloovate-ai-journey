import { ReactNode } from 'react';
import { Card, CardContent } from './ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  colorClass?: string;
}

export const StatsCard = ({ title, value, icon, trend, colorClass = 'from-primary to-purple-500' }: StatsCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold font-display mt-1">{value}</p>
            {trend && (
              <p className="text-sm text-success mt-1">{trend}</p>
            )}
          </div>
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-primary-foreground`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
