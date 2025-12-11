'use client';

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Legend, ZAxis } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
    effectiveness: {
      label: 'Effectiveness',
      color: 'hsl(var(--chart-1))',
    },
  };

export function OfferEffectivenessHeatmap({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const promoTypes = [...new Set(data.filter(i => i.promo_flag).map(i => i.promo_type))];
    return data
      .filter(item => item.promo_flag)
      .map(item => ({
        x: item.promo_type,
        y: Math.round(item.discount_pct * 100),
        z: item.incremental_sales,
      }));
  }, [data]);

  return (
    <ChartWrapper
      title="Offer Effectiveness Heatmap"
      description="Incremental sales by offer type and discount percentage. Darker/larger points are more effective."
      chartConfig={chartConfig}
    >
      <ScatterChart margin={{ left: 12, right: 12, top: 10 }}>
        <CartesianGrid />
        <XAxis dataKey="x" type="category" name="Promo Type" />
        <YAxis dataKey="y" type="number" name="Discount %" unit="%" />
        <ZAxis dataKey="z" type="number" range={[20, 400]} name="Incremental Sales" unit=" units" />
        <Legend />
        <ChartTooltipFrame cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Effectiveness" data={chartData} fill="var(--color-effectiveness)" shape="square" />
      </ScatterChart>
    </ChartWrapper>
  );
}
