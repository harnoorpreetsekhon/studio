'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label, ReferenceLine } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  elasticity: {
    label: 'Promo Elasticity',
    color: 'hsl(var(--chart-1))',
  },
};

export function PromoElasticityChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const byProduct = data.filter(i => i.promo_flag).reduce((acc: any, item) => {
        if (!acc[item.product]) {
            acc[item.product] = { product: item.product, elasticities: [] };
        }
        acc[item.product].elasticities.push(item.promo_elasticity);
        return acc;
    }, {});
    
    return Object.values(byProduct).map((p: any) => ({
        product: p.product,
        elasticity: p.elasticities.reduce((a:number, b:number) => a + b, 0) / p.elasticities.length
    }));

  }, [data]);

  return (
    <ChartWrapper
      title="Elasticity of Promotions"
      description="Average price elasticity of demand for each product during promotions."
      chartConfig={chartConfig}
    >
      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 20 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number">
            <Label value="Elasticity" offset={-15} position="insideBottom" />
        </XAxis>
        <YAxis dataKey="product" type="category" width={80} />
        <ChartTooltipFrame />
        <ReferenceLine x={-1} stroke="hsl(var(--destructive))" strokeDasharray="3 3">
          <Label value="Unit Elastic" position="insideTopLeft" fill="hsl(var(--destructive))" fontSize={12}/>
        </ReferenceLine>
        <Bar dataKey="elasticity" fill="var(--color-elasticity)" />
      </BarChart>
    </ChartWrapper>
  );
}
