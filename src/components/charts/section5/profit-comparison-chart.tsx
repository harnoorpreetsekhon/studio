'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  promoProfit: {
    label: 'Promo Week Profit',
    color: 'hsl(var(--chart-2))',
  },
  nonPromoProfit: {
    label: 'Non-Promo Week Profit',
    color: 'hsl(var(--chart-1))',
  },
};

export function ProfitComparisonChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const aggregated = data.reduce((acc: { [key: string]: { date: string, promoProfit: number, nonPromoProfit: number } }, item) => {
            const week = item.date;
            if (!acc[week]) {
                acc[week] = { date: week, promoProfit: 0, nonPromoProfit: 0 };
            }
            if (item.promo_flag) {
                acc[week].promoProfit += item.profit_during_promo;
            } else {
                acc[week].nonPromoProfit += item.sales * item.profit_margin;
            }
            return acc;
        }, {});
        return Object.values(aggregated).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

  return (
    <ChartWrapper
      title="Profit: Promo vs. Non-Promo Weeks"
      description="Comparison of total profit generated during promotional and non-promotional weeks."
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
            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
        />
        <Legend />
        <ChartTooltipFrame formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
        <Bar dataKey="nonPromoProfit" fill="var(--color-nonPromoProfit)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="promoProfit" fill="var(--color-promoProfit)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartWrapper>
  );
}
