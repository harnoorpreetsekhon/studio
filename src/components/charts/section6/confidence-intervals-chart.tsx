'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ErrorBar } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  elasticity: {
    label: 'Promo Elasticity',
    color: 'hsl(var(--chart-1))',
  },
};

export function ConfidenceIntervalsChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const byProduct = data.filter(i => i.promo_flag).reduce((acc: any, item) => {
        if (!acc[item.product]) {
            acc[item.product] = { product: item.product, elasticities: [] };
        }
        acc[item.product].elasticities.push(item.promo_elasticity);
        return acc;
    }, {});
    
    return Object.values(byProduct).map((p: any) => {
        const avg = p.elasticities.reduce((a:number, b:number) => a + b, 0) / p.elasticities.length;
        const stdDev = Math.sqrt(p.elasticities.map((x: number) => Math.pow(x - avg, 2)).reduce((a: number, b: number) => a + b, 0) / p.elasticities.length);
        const error = 1.96 * (stdDev / Math.sqrt(p.elasticities.length)); // 95% CI
        return {
            product: p.product,
            elasticity: avg,
            ci: [avg - error, avg + error]
        }
    });

  }, [data]);

  return (
    <ChartWrapper
      title="Parameter Confidence Intervals"
      description="95% confidence intervals for the promotion elasticity parameter of each product."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 10 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[-2.5, 0]} />
        <YAxis dataKey="product" type="category" width={80} />
        <ChartTooltipFrame />
        <Bar dataKey="elasticity" fill="var(--color-elasticity)">
             <ErrorBar dataKey="ci" width={4} strokeWidth={2} stroke="hsl(var(--foreground))" direction="x" />
        </Bar>
      </BarChart>
    </ChartWrapper>
  );
}
