'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  promo: { label: 'Promo', color: 'hsl(var(--chart-1))' },
  marketing: { label: 'Marketing', color: 'hsl(var(--chart-2))' },
  seasonality: { label: 'Seasonality', color: 'hsl(var(--chart-4))' },
};

export function SalesUpliftAttributionChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const promo = data.reduce((sum, item) => sum + item.promo_effect, 0);
    const marketing = data.reduce((sum, item) => sum + (item.marketing_spend_search + item.marketing_spend_social + item.marketing_spend_video) * 0.1, 0);
    const seasonality = data.reduce((sum, item) => sum + (item.baseline_sales / item.seasonality_index * (item.seasonality_index - 1)), 0);
    const total = promo + marketing + seasonality;

    return [{
        name: 'Attribution',
        promo: promo / total,
        marketing: marketing / total,
        seasonality: seasonality / total,
    }];
  }, [data]);

  return (
    <ChartWrapper
      title="Sales Uplift Attribution"
      description="Contribution of promotions, marketing, and seasonality to total sales uplift."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData} layout="vertical" stackOffset="expand" margin={{ left: 12, right: 12, top: 10 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={(value) => `${Math.round(value * 100)}%`} />
        <YAxis dataKey="name" type="category" hide />
        <Legend />
        <ChartTooltipFrame />
        <Bar dataKey="promo" stackId="a" fill="var(--color-promo)" />
        <Bar dataKey="marketing" stackId="a" fill="var(--color-marketing)" />
        <Bar dataKey="seasonality" stackId="a" fill="var(--color-seasonality)" />
      </BarChart>
    </ChartWrapper>
  );
}
