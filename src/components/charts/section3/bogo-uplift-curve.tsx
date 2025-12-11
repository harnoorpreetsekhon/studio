'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, Label } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  uplift: {
    label: 'Sales Uplift',
    color: 'hsl(var(--chart-2))',
  },
};

export function BogoUpliftCurve({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const bogoData = data.filter(item => item.promo_type === 'BOGO');
    const aggregated = bogoData.reduce((acc: { [key: string]: { date: string, uplift: number } }, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, uplift: 0 };
        }
        acc[item.date].uplift += item.incremental_sales;
        return acc;
      }, {});
      return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartWrapper
      title="BOGO Uplift Curve"
      description="Incremental sales volume generated during Buy-One-Get-One (BOGO) promotions over time."
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
        >
            <Label value="Incremental Sales" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <ChartTooltipFrame />
        <Line dataKey="uplift" type="monotone" stroke="var(--color-uplift)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartWrapper>
  );
}
