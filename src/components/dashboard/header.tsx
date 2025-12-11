import { Gem } from 'lucide-react';
import { InsightGenerator } from './insight-generator';
import type { GenerateInsightsInput } from '@/ai/flows/automated-insight-generator';

interface DashboardHeaderProps {
  kpisForInsights: Omit<GenerateInsightsInput, 'promoType' | 'product' | 'region'>;
}

export function DashboardHeader({ kpisForInsights }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-2">
        <Gem className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">PromoPulse Dashboard</h1>
      </div>
      <div className="ml-auto">
        <InsightGenerator kpisForInsights={kpisForInsights} />
      </div>
    </header>
  );
}
