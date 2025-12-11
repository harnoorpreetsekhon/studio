'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, Label } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  sales: {
    label: 'Sales Volume',
    color: 'hsl(var(--chart-1))',
  },
};

export function PricePromoInteractionCurve({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    return data.filter(item => item.promo_flag && item.discount_pct > 0)
    .sort((a,b) => a.discount_pct - b.discount_pct)
    .map(item => ({
      discount: item.discount_pct * 100,
      sales: item.sales
    }));
  }, [data]);

  return (
    <ChartWrapper
      title="Price × Promo Interaction"
      description="Shows how sales volume changes as the promotional discount percentage increases."
      chartConfig={chartConfig}
    >
      <LineChart data={chartData} margin={{ left: 12, right: 30, top: 10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="discount"
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          unit="%"
        >
            <Label value="Discount %" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toLocaleString()}
        >
            <Label value="Sales" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <ChartTooltipFrame />
        <Line dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2} dot={{ r: 2 }} name="Sales" />
      </LineChart>
    </ChartWrapper>
  );
}
