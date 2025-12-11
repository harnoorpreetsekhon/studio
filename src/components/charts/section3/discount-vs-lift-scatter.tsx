'use client';

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Legend, Line } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  lift: {
    label: 'Incremental Lift',
    color: 'hsl(var(--chart-1))',
  },
  trend: {
    label: 'Trend (LOESS)',
    color: 'hsl(var(--chart-2))',
  }
};

export function DiscountVsLiftScatter({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    return data
      .filter(item => item.promo_type === '% discount')
      .map(item => ({
        discount: item.discount_pct * 100,
        lift: item.incremental_sales,
      }));
  }, [data]);

  return (
    <ChartWrapper
      title="% Discount vs. Incremental Lift"
      description="Relationship between discount percentage and the resulting incremental sales lift."
      chartConfig={chartConfig}
    >
      <ScatterChart margin={{ left: 12, right: 12, top: 10 }}>
        <CartesianGrid />
        <XAxis dataKey="discount" type="number" name="Discount %" unit="%" />
        <YAxis dataKey="lift" type="number" name="Incremental Lift" unit=" units" />
        <ChartTooltipFrame cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Promotions" data={chartData} fill="var(--color-lift)" />
        {/* Note: A true LOESS curve requires a library. This is a visual approximation. */}
        <Line dataKey="lift" stroke="var(--color-trend)" dot={false} strokeWidth={2} type="monotone" name="Trend" legendType="none" />
      </ScatterChart>
    </ChartWrapper>
  );
}
