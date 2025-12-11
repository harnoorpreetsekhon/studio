'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  promoSales: {
    label: 'Promo Sales',
    color: 'hsl(var(--chart-2))',
  },
  nonPromoSales: {
    label: 'Non-Promo Sales',
    color: 'hsl(var(--chart-1))',
  },
};

export function PromoVsNonPromoSalesChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: item.date,
      promoSales: item.promo_flag ? item.sales : null,
      nonPromoSales: !item.promo_flag ? item.sales : null
    })).reduce((acc: any[], item) => {
      const found = acc.find(i => i.date === item.date);
      if (found) {
        if (item.promoSales) found.promoSales = (found.promoSales || 0) + item.promoSales;
        if (item.nonPromoSales) found.nonPromoSales = (found.nonPromoSales || 0) + item.nonPromoSales;
      } else {
        acc.push(item);
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <ChartWrapper
      title="Promo vs. Non-Promo Sales Trend"
      description="Weekly sales volume during promotional and non-promotional periods."
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
        <Line dataKey="promoSales" type="monotone" stroke="var(--color-promoSales)" strokeWidth={2} dot={false} name="Promo Sales" connectNulls />
        <Line dataKey="nonPromoSales" type="monotone" stroke="var(--color-nonPromoSales)" strokeWidth={2} dot={false} name="Non-Promo Sales" connectNulls />
      </LineChart>
    </ChartWrapper>
  );
}
