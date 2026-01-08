'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  newCustomers: {
    label: 'New Customers',
    color: 'hsl(var(--chart-2))',
  },
  returningCustomers: {
    label: 'Returning Customers',
    color: 'hsl(var(--chart-1))',
  },
};

export function NewVsReturningCustomersChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const aggregated = data.reduce((acc: { [key: string]: { date: string, newCustomers: number, returningCustomers: number } }, item) => {
          const week = item.date;
          if (!acc[week]) {
            acc[week] = { date: week, newCustomers: 0, returningCustomers: 0 };
          }
          acc[week].newCustomers += item.new_customers;
          acc[week].returningCustomers += item.returning_customers;
          return acc;
        }, {});
        return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }, [data]);

  return (
    <ChartWrapper
      title="New vs. Returning Customers"
      description="Breakdown of customer base into new and returning purchasers over time."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData} stackOffset="expand">
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
            tickFormatter={(value) => `${Math.round(value * 100)}%`}
        />
        <Legend />
        <ChartTooltipFrame />
        <Bar dataKey="returningCustomers" stackId="a" fill="var(--color-returningCustomers)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="newCustomers" stackId="a" fill="var(--color-newCustomers)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
