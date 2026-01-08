'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  roi: {
    label: 'Promo ROI',
    color: 'hsl(var(--chart-1))',
  },
};

export function PromoRoiTrendChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const promoWeeks = data.filter(item => item.promo_flag);
        const aggregated = promoWeeks.reduce((acc: { [key: string]: { date: string, roi: number, count: number } }, item) => {
          if (!acc[item.date]) {
            acc[item.date] = { date: item.date, roi: 0, count: 0 };
          }
          acc[item.date].roi += item.promo_roi;
          acc[item.date].count++;
          return acc;
        }, {});
        return Object.values(aggregated).map(item => ({ date: item.date, roi: item.roi / item.count })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }, [data]);

  return (
    <ChartWrapper
      title="Promo ROI Trend"
      description="Return on investment for promotional activities over time."
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
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
        />
        <Legend />
        <ChartTooltipFrame formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
        <Line dataKey="roi" type="monotone" stroke="var(--color-roi)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartWrapper>
  );
}
