'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  upliftWithConstraint: {
    label: 'Uplift (with constraints)',
    color: 'hsl(var(--chart-2))',
  },
  potentialUplift: {
    label: 'Potential Uplift (no constraints)',
    color: 'hsl(var(--chart-1))',
  },
};

export function OperationalConstraintsChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const promoWeeks = data.filter(item => item.promo_flag);
        const aggregated = promoWeeks.reduce((acc: { [key: string]: { date: string, upliftWithConstraint: number, potentialUplift: number } }, item) => {
          if (!acc[item.date]) {
            acc[item.date] = { date: item.date, upliftWithConstraint: 0, potentialUplift: 0 };
          }
          const operationalMultiplier = item.compliance_rate * item.stock_levels;
          acc[item.date].upliftWithConstraint += item.incremental_sales;
          acc[item.date].potentialUplift += operationalMultiplier > 0 ? item.incremental_sales / operationalMultiplier : item.incremental_sales;
          
          return acc;
        }, {});
        return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }, [data]);

  return (
    <ChartWrapper
      title="Impact of Operational Constraints"
      description="Difference between potential and actual incremental uplift due to factors like compliance and stock levels."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
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
        <Bar dataKey="potentialUplift" stackId="a" fill="var(--color-potentialUplift)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="upliftWithConstraint" stackId="b" fill="var(--color-upliftWithConstraint)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
