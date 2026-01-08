'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  StellarGlowSerum: {
    label: 'StellarGlow Serum',
    color: 'hsl(var(--chart-1))',
  },
  AquaHydrateMoisturizer: {
    label: 'AquaHydrate Moisturizer',
    color: 'hsl(var(--chart-2))',
  },
};

export function ParameterStabilityChart({ data }: { data: PromoData[] }) {
  const chartData = useMemo(() => {
    const weeklyElasticity: { [key: string]: { date: string, products: { [key:string]: number[] } } } = {};
    
    data.filter(d => d.promo_flag).forEach(item => {
        if (!weeklyElasticity[item.date]) {
            weeklyElasticity[item.date] = { date: item.date, products: {} };
        }
        if (!weeklyElasticity[item.date].products[item.product]) {
            weeklyElasticity[item.date].products[item.product] = [];
        }
        weeklyElasticity[item.date].products[item.product].push(item.promo_elasticity);
    });

    return Object.values(weeklyElasticity).map(week => {
        const entry: {[key: string]: any} = { date: week.date };
        for (const product in week.products) {
            const key = product.replace(/\s+/g, '');
            const elasticities = week.products[product];
            entry[key] = elasticities.reduce((a, b) => a + b, 0) / elasticities.length;
        }
        return entry;
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [data]);

  return (
    <ChartWrapper
      title="Parameter Stability (Promo Elasticity)"
      description="Tracking the stability of the promotion elasticity coefficient for each product over time."
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
          domain={[-2.5, -0.5]}
        />
        <Legend />
        <ChartTooltipFrame />
        <Line dataKey="StellarGlowSerum" type="monotone" stroke="var(--color-StellarGlowSerum)" strokeWidth={2} dot={false} connectNulls/>
        <Line dataKey="AquaHydrateMoisturizer" type="monotone" stroke="var(--color-AquaHydrateMoisturizer)" strokeWidth={2} dot={false} connectNulls/>
      </LineChart>
    </ChartWrapper>
  );
}
