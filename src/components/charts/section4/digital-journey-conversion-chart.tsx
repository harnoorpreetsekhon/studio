'use client';

import { Funnel, FunnelChart, LabelList, Tooltip, Cell } from 'recharts';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';
import { CHART_COLORS } from '@/lib/constants';

const chartConfig = {
  value: { label: 'Users' },
  ...Object.keys(CHART_COLORS).reduce((acc, key, index) => ({
      ...acc,
      [key]: { color: CHART_COLORS[key as keyof typeof CHART_COLORS] }
  }), {})
};

export function DigitalJourneyConversionChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const totalPromoSales = data.filter(d => d.promo_flag).reduce((sum, d) => sum + d.sales, 0);
        if (totalPromoSales === 0) return [];
        
        const exposure = totalPromoSales * (3 + Math.random() * 2); // 3-5x sales
        const engagement = exposure * (0.3 + Math.random() * 0.2); // 30-50% engagement
        const consideration = engagement * (0.4 + Math.random() * 0.2); // 40-60% consideration
        const conversion = totalPromoSales;

        return [
            { name: 'Exposure', value: Math.round(exposure) },
            { name: 'Engagement', value: Math.round(engagement) },
            { name: 'Consideration', value: Math.round(consideration) },
            { name: 'Conversion', value: Math.round(conversion) },
        ];
    }, [data]);

    if (chartData.length === 0) {
        return (
            <ChartWrapper title="Digital Journey Conversion" description="Simulated customer conversion funnel from exposure to purchase during promotions." chartConfig={chartConfig}>
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">No promotional data to display funnel.</div>
            </ChartWrapper>
        )
    }

  return (
    <ChartWrapper
      title="Digital Journey Conversion"
      description="Simulated customer conversion funnel from exposure to purchase during promotions."
      chartConfig={chartConfig}
    >
        <FunnelChart width={500} height={250}>
            <Tooltip />
            <Funnel
                dataKey="value"
                data={chartData}
                isAnimationActive
            >
                 <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                 <LabelList position="center" fill="#fff" stroke="none" dataKey="value" formatter={(v: number) => v.toLocaleString()} />
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[`chart${(index % 5) + 1}` as keyof typeof CHART_COLORS]} />
                ))}
            </Funnel>
        </FunnelChart>
    </ChartWrapper>
  );
}
