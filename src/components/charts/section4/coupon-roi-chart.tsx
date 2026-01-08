'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, ReferenceLine } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  roi: {
    label: 'Promo ROI',
    color: 'hsl(var(--chart-1))',
  },
};

export function CouponRoiChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const byPromoType = data.filter(i => i.promo_flag).reduce((acc: any, item) => {
        if (!acc[item.promo_type]) {
            acc[item.promo_type] = { name: item.promo_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), rois: [] };
        }
        if (item.promo_roi > 0) {
            acc[item.promo_type].rois.push(item.promo_roi);
        }
        return acc;
    }, {});
    
    return Object.values(byPromoType).map((p: any) => ({
        name: p.name,
        roi: p.rois.length > 0 ? p.rois.reduce((a:number, b:number) => a + b, 0) / p.rois.length : 0
    })).filter(p => p.roi > 0);

  }, [data]);

  const averageRoi = chartData.length > 0 ? chartData.reduce((sum, item) => sum + item.roi, 0) / chartData.length : 0;

  return (
    <ChartWrapper
      title="Coupon ROI Attribution"
      description="Return on investment attributed to each promotion type or coupon."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 30, top: 10, bottom: 20 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}>
            <Label value="Return on Investment (ROI)" offset={-15} position="insideBottom" />
        </XAxis>
        <YAxis dataKey="name" type="category" width={100} />
        <ChartTooltipFrame formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
        <ReferenceLine x={averageRoi} stroke="hsl(var(--foreground))" strokeDasharray="3 3">
          <Label value="Avg" position="insideTopLeft" fill="hsl(var(--foreground))" fontSize={12}/>
        </ReferenceLine>
        <Bar dataKey="roi" fill="var(--color-roi)" />
      </BarChart>
    </ChartWrapper>
  );
}
