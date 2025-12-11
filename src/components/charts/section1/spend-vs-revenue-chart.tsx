'use client';

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  revenue: {
    label: 'Incremental Revenue',
    color: 'hsl(var(--chart-1))',
  },
};

export function SpendVsRevenueChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        return data.filter(item => item.promo_flag).map(item => ({
            spend: item.promo_cost,
            revenue: item.incremental_revenue,
            roi: item.promo_roi
        }));
      }, [data]);

  return (
    <ChartWrapper
      title="Promo Spend vs. Incremental Revenue"
      description="Relationship between promotional spend and the incremental revenue generated."
      chartConfig={chartConfig}
    >
      <ScatterChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
        <CartesianGrid />
        <XAxis 
            dataKey="spend" 
            type="number" 
            name="Promo Spend" 
            unit="$" 
            tickFormatter={(value) => value.toLocaleString()}
            domain={['dataMin', 'dataMax']}
        />
        <YAxis 
            dataKey="revenue" 
            type="number" 
            name="Incremental Revenue" 
            unit="$" 
            tickFormatter={(value) => value.toLocaleString()}
            domain={['dataMin', 'dataMax']}
        />
        <ZAxis dataKey="roi" type="number" range={[50, 500]} name="ROI" unit="x" />
        <ChartTooltipFrame cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Promotions" data={chartData} fill="var(--color-revenue)" shape="circle" />
      </ScatterChart>
    </ChartWrapper>
  );
}
