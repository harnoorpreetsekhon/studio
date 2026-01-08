'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  acquisition: {
    label: 'Acquisition Cost',
    color: 'hsl(var(--chart-2))',
  },
  retention: {
    label: 'Retention Sales',
    color: 'hsl(var(--chart-1))',
  },
};

export function AcquisitionVsRetentionChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const promoWeeks = data.filter(item => item.promo_flag);
        const aggregated = promoWeeks.reduce((acc: { [key: string]: { date: string, acquisition: number, retention: number, count: number } }, item) => {
          const week = item.date;
          if (!acc[week]) {
            acc[week] = { date: week, acquisition: 0, retention: 0, count: 0 };
          }
          acc[week].acquisition += item.acquisition_cost;
          acc[week].retention += item.retention_sales;
          acc[week].count++;
          return acc;
        }, {});
        return Object.values(aggregated).map(item => ({
            ...item,
            acquisition: item.acquisition / item.count,
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }, [data]);

  return (
    <ChartWrapper
      title="Acquisition Cost vs. Retention Sales"
      description="Comparing the cost to acquire a new customer vs. sales from returning customers during promos."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
        />
        <YAxis yAxisId="left" orientation="left" stroke="var(--color-retention)" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}/>
        <YAxis yAxisId="right" orientation="right" stroke="var(--color-acquisition)" tickFormatter={(value) => `$${(value).toFixed(0)}`} />
        <Legend />
        <ChartTooltipFrame />
        <Bar yAxisId="left" dataKey="retention" fill="var(--color-retention)" radius={[4, 4, 0, 0]} name="Retention Sales" />
        <Bar yAxisId="right" dataKey="acquisition" fill="var(--color-acquisition)" radius={[4, 4, 0, 0]} name="Acquisition Cost" />
      </BarChart>
    </ChartWrapper>
  );
}
