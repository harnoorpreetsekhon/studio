'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  promoEffect: {
    label: 'Promo Effect',
    color: 'hsl(var(--chart-2))',
  },
  baselineSales: {
    label: 'Baseline Sales',
    color: 'hsl(var(--chart-1))',
  },
};

export function BaselineVsPromoSalesChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const aggregated = data.reduce((acc: { [key: string]: { date: string, promoEffect: number, baselineSales: number } }, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, promoEffect: 0, baselineSales: 0 };
      }
      acc[item.date].promoEffect += item.promo_effect;
      acc[item.date].baselineSales += item.baseline_sales;
      return acc;
    }, {});
    return Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartWrapper
      title="Baseline vs. Promo Sales"
      description="Total sales decomposed into baseline volume and the lift from promotions."
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
        <Area dataKey="baselineSales" type="monotone" fill="var(--color-baselineSales)" stroke="var(--color-baselineSales)" stackId="1" />
        <Area dataKey="promoEffect" type="monotone" fill="var(--color-promoEffect)" stroke="var(--color-promoEffect)" stackId="1" />
      </AreaChart>
    </ChartWrapper>
  );
}
