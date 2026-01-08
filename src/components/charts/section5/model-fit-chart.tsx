'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  actual: {
    label: 'Actual Sales',
    color: 'hsl(var(--chart-1))',
  },
  predicted: {
    label: 'Predicted Sales',
    color: 'hsl(var(--chart-2))',
  },
};

export function ModelFitChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const aggregated = data.reduce((acc: { [key: string]: { date: string, actual: number, predicted: number } }, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, actual: 0, predicted: 0 };
        }
        acc[item.date].actual += item.sales;
        acc[item.date].predicted += item.predicted_sales;
        return acc;
      }, {});
      return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartWrapper
      title="Model Fit: Actual vs. Predicted Sales"
      description="Comparison of actual sales data against the model's predictions over time."
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
        <Legend />
        <ChartTooltipFrame />
        <Line dataKey="actual" type="monotone" stroke="var(--color-actual)" strokeWidth={2} dot={false} />
        <Line dataKey="predicted" type="monotone" stroke="var(--color-predicted)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
      </LineChart>
    </ChartWrapper>
  );
}
