'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  residual: {
    label: 'Residual (Actual - Predicted)',
    color: 'hsl(var(--chart-1))',
  },
};

export function ResidualsChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const aggregated = data.reduce((acc: { [key: string]: { date: string, residual: number } }, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, residual: 0 };
        }
        acc[item.date].residual += item.sales - item.predicted_sales;
        return acc;
      }, {});
      return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartWrapper
      title="Residuals vs. Time"
      description="Plot of model residuals (errors) over time to check for patterns or trends."
      chartConfig={chartConfig}
    >
      <LineChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
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
        <ChartTooltipFrame />
        <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
        <Line dataKey="residual" type="monotone" stroke="var(--color-residual)" strokeWidth={2} dot={{r: 2}} />
      </LineChart>
    </ChartWrapper>
  );
}
