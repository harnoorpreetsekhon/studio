'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  incrementalSales: {
    label: 'Incremental Sales',
    color: 'hsl(var(--chart-2))',
  },
  baselineSales: {
    label: 'Baseline Sales',
    color: 'hsl(var(--chart-1))',
  },
};

export function IncrementalLiftChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const promoWeeks = data.filter(item => item.promo_flag);
        const aggregated = promoWeeks.reduce((acc: { [key: string]: { date: string, incrementalSales: number, baselineSales: number } }, item) => {
          if (!acc[item.date]) {
            acc[item.date] = { date: item.date, incrementalSales: 0, baselineSales: 0 };
          }
          acc[item.date].incrementalSales += item.incremental_sales;
          acc[item.date].baselineSales += item.baseline_sales;
          return acc;
        }, {});
        return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }, [data]);

  return (
    <ChartWrapper
      title="Incremental Lift During Promo"
      description="Additional sales volume generated on top of baseline sales during promo weeks."
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
        <Bar dataKey="baselineSales" stackId="a" fill="var(--color-baselineSales)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="incrementalSales" stackId="a" fill="var(--color-incrementalSales)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
