'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  lagEffect: {
    label: 'Lag/Adstock Effect',
    color: 'hsl(var(--chart-4))',
  },
};

export function PromoImpactLagCurve({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const aggregated = data.reduce((acc: { [key: string]: { date: string, lagEffect: number } }, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, lagEffect: 0 };
        }
        acc[item.date].lagEffect += item.promo_lag_effect;
        return acc;
      }, {});
      return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartWrapper
      title="Promo Impact Lag Curve (Adstock)"
      description="The decaying effect of a promotion's impact over subsequent weeks."
      chartConfig={chartConfig}
    >
      <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Legend />
        <ChartTooltipFrame />
        <Area dataKey="lagEffect" type="monotone" fill="var(--color-lagEffect)" stroke="var(--color-lagEffect)" />
      </AreaChart>
    </ChartWrapper>
  );
}
