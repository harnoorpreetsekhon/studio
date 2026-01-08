'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, CartesianGrid } from 'recharts';
import { ChartWrapper, ChartTooltipFrame } from '@/components/charts/chart-wrapper';
import type { PromoData } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  impact: {
    label: 'Channel Impact',
    color: 'hsl(var(--chart-1))',
  },
};

export function MarketingChannelImpactChart({ data }: { data: PromoData[] }) {
    const chartData = useMemo(() => {
        const promoData = data.filter(item => item.promo_flag);
        if (promoData.length === 0) return [];
        
        const totalSpendSearch = promoData.reduce((sum, item) => sum + item.marketing_spend_search, 0);
        const totalSpendSocial = promoData.reduce((sum, item) => sum + item.marketing_spend_social, 0);
        const totalSpendVideo = promoData.reduce((sum, item) => sum + item.marketing_spend_video, 0);
        const totalIncrementalSales = promoData.reduce((sum, item) => sum + item.incremental_sales, 0);

        if(totalIncrementalSales === 0) return [];

        const impactSearch = (totalSpendSearch / totalIncrementalSales) * 1000;
        const impactSocial = (totalSpendSocial / totalIncrementalSales) * 1000;
        const impactVideo = (totalSpendVideo / totalIncrementalSales) * 1000;

        return [
          { channel: 'Search', impact: impactSearch },
          { channel: 'Social', impact: impactSocial },
          { channel: 'Video', impact: impactVideo },
        ];
      }, [data]);

  return (
    <ChartWrapper
      title="Marketing Channel Impact"
      description="Relative impact of marketing spend per channel on incremental sales during promotions."
      chartConfig={chartConfig}
    >
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="channel" />
        <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 100']} />
        <ChartTooltipFrame />
        <Radar name="Impact" dataKey="impact" stroke="var(--color-impact)" fill="var(--color-impact)" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </ChartWrapper>
  );
}
