import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Target,
  ShoppingCart,
  LineChart,
  GitMerge,
  Gift,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import type { Icon as LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  promoData,
  uniqueFilterOptions,
  type PromoData,
  type UniqueOptions,
} from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard/header";
import { Filters } from "@/components/dashboard/filters";
import { KpiCard } from "@/components/dashboard/kpi-card";

import { PromoVsNonPromoSalesChart } from "@/components/charts/section1/promo-vs-non-promo-sales-chart";
import { IncrementalLiftChart } from "@/components/charts/section1/incremental-lift-chart";
import { OfferPerformanceChart } from "@/components/charts/section1/offer-performance-chart";
import { SpendVsRevenueChart } from "@/components/charts/section1/spend-vs-revenue-chart";

import { BaselineVsPromoSalesChart } from "@/components/charts/section2/baseline-vs-promo-sales-chart";
import { PricePromoInteractionCurve } from "@/components/charts/section2/price-promo-interaction-curve";
import { SalesUpliftAttributionChart } from "@/components/charts/section2/sales-uplift-attribution-chart";
import { PromoElasticityChart } from "@/components/charts/section2/promo-elasticity-chart";
import { PromoImpactLagCurve } from "@/components/charts/section2/promo-impact-lag-curve";

import { OfferEffectivenessHeatmap } from "@/components/charts/section3/offer-effectiveness-heatmap";
import { BogoUpliftCurve } from "@/components/charts/section3/bogo-uplift-curve";
import { DiscountVsLiftScatter } from "@/components/charts/section3/discount-vs-lift-scatter";

import { PromoRoiTrendChart } from "@/components/charts/section4/promo-roi-trend-chart";
import { ProfitComparisonChart } from "@/components/charts/section4/profit-comparison-chart";

type Kpi = {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(value);
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value: number, decimals = 2) {
  return value.toFixed(decimals);
}

function calculateKpis(data: PromoData[]) {
  const totalPromoSpend = data.reduce((sum, d) => sum + d.promo_cost, 0);
  const totalPromoRevenue = data.reduce((sum, d) => sum + d.promo_revenue, 0);
  const incrementalPromoRevenue = data.reduce(
    (sum, d) => sum + d.incremental_revenue,
    0
  );
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  const totalBaselineSales = data.reduce((sum, d) => sum + d.baseline_sales, 0);
  const incrementalPromoSalesLift =
    totalBaselineSales > 0 ? (totalSales - totalBaselineSales) / totalBaselineSales : 0;
  const promoElasticity =
    data.filter(d=>d.promo_elasticity !== 0).reduce((sum, d) => sum + d.promo_elasticity, 0) / data.filter(d=>d.promo_elasticity !== 0).length || -1.5;
  const averageDiscount =
    data.filter(d=>d.discount_pct > 0).reduce((sum, d) => sum + d.discount_pct, 0) / data.filter(d=>d.discount_pct > 0).length || 0;
  const offerEffectivenessIndex =
    data.reduce((sum, d) => sum + (d.promo_roi * d.incremental_sales), 0) / data.reduce((sum, d) => sum + d.incremental_sales, 1) || 115;
  const promoRoi =
    totalPromoSpend > 0 ? incrementalPromoRevenue / totalPromoSpend : 0;
  const profitDuringPromo = data.reduce(
    (sum, d) => sum + d.profit_during_promo,
    0
  );
  const promoCannibalization =
    data.reduce((sum, d) => sum + d.promo_cannibalization, 0) / data.length || 0;
  const promoHaloEffectIndex =
    data.reduce((sum, d) => sum + d.promo_halo_effect, 0) / data.length || 1.05;

  return {
    totalPromoSpend,
    totalPromoRevenue,
    incrementalPromoRevenue,
    incrementalPromoSalesLift,
    totalBaselineSales,
    promoElasticity,
    averageDiscount,
    offerEffectivenessIndex,
    promoRoi,
    profitDuringPromo,
    promoCannibalization,
    promoHaloEffectIndex,
  };
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filteredData = promoData.filter((d) => {
    return (
      (!searchParams.offerType || d.promo_type === searchParams.offerType) &&
      (!searchParams.product || d.product === searchParams.product) &&
      (!searchParams.region || d.region === searchParams.region) &&
      (!searchParams.discountBucket ||
        (d.discount_pct > 0 &&
          Math.floor(d.discount_pct * 10) ==
            parseInt(searchParams.discountBucket)))
    );
  });

  const kpis = calculateKpis(filteredData);

  const kpiList: Kpi[] = [
    { title: "Total Promo Spend", value: formatCurrency(kpis.totalPromoSpend), icon: DollarSign, description: "Total amount spent on promotions." },
    { title: "Total Promo Revenue", value: formatCurrency(kpis.totalPromoRevenue), icon: TrendingUp, description: "Total revenue from units sold on promotion." },
    { title: "Incremental Revenue", value: formatCurrency(kpis.incrementalPromoRevenue), icon: Plus, description: "Additional revenue generated by promotions." },
    { title: "Incremental Sales Lift", value: formatPercentage(kpis.incrementalPromoSalesLift), icon: Percent, description: "Percentage increase in sales due to promotions." },
    { title: "Baseline Sales", value: formatCurrency(kpis.totalBaselineSales), icon: ShoppingCart, description: "Estimated sales without any promotional activity." },
    { title: "Promo Elasticity", value: formatNumber(kpis.promoElasticity), icon: GitMerge, description: "Sensitivity of sales to changes in discount." },
    { title: "Average Discount %", value: formatPercentage(kpis.averageDiscount), icon: Percent, description: "Average discount offered during promotions." },
    { title: "Offer Effectiveness", value: formatNumber(kpis.offerEffectivenessIndex, 0), icon: Gift, description: "Index of overall offer performance." },
    { title: "Promo ROI", value: formatPercentage(kpis.promoRoi), icon: Target, description: "Return on investment from promotional spend." },
    { title: "Profit During Promo", value: formatCurrency(kpis.profitDuringPromo), icon: LineChart, description: "Total profit generated during promo periods." },
    { title: "Cannibalization %", value: formatPercentage(kpis.promoCannibalization), icon: Minus, description: "Sales lost from non-promo items." },
    { title: "Halo Effect Index", value: formatNumber(kpis.promoHaloEffectIndex), icon: Sparkles, description: "Sales lift in related products." },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader kpisForInsights={kpis} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-6">
          {kpiList.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Filters options={uniqueFilterOptions} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-1 grid auto-rows-max gap-4 md:gap-8 xl:col-span-3">
             <Card>
              <CardHeader>
                <CardTitle>Promo Performance Summary</CardTitle>
                 <CardDescription>High-level overview of promotional effectiveness and financial impact.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card className="xl:col-span-2"><PromoVsNonPromoSalesChart data={filteredData} /></Card>
          <Card><IncrementalLiftChart data={filteredData} /></Card>
          <Card><OfferPerformanceChart data={filteredData} /></Card>
          <Card className="xl:col-span-2"><SpendVsRevenueChart data={filteredData} /></Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-1 grid auto-rows-max gap-4 md:gap-8 xl:col-span-3">
             <Card>
              <CardHeader>
                <CardTitle>Econometric Promo Effect Analysis</CardTitle>
                <CardDescription>Statistical analysis of promotional impact, elasticity, and attribution.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card className="xl:col-span-2"><BaselineVsPromoSalesChart data={filteredData} /></Card>
          <Card><SalesUpliftAttributionChart data={filteredData} /></Card>
          <Card><PricePromoInteractionCurve data={filteredData} /></Card>
          <Card><PromoElasticityChart data={filteredData} /></Card>
          <Card><PromoImpactLagCurve data={filteredData} /></Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-1 grid auto-rows-max gap-4 md:gap-8 xl:col-span-3">
             <Card>
              <CardHeader>
                <CardTitle>Offer Type Deep Dive</CardTitle>
                <CardDescription>Detailed analysis of specific offer mechanics and their performance.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card><OfferEffectivenessHeatmap data={filteredData} /></Card>
          <Card><BogoUpliftCurve data={filteredData} /></Card>
          <Card><DiscountVsLiftScatter data={filteredData} /></Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2">
          <div className="col-span-1 grid auto-rows-max gap-4 md:gap-8 lg:col-span-2">
             <Card>
              <CardHeader>
                <CardTitle>ROI & Financial Impact</CardTitle>
                <CardDescription>Bottom-line financial metrics to evaluate promotional profitability.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <Card><PromoRoiTrendChart data={filteredData} /></Card>
          <Card><ProfitComparisonChart data={filteredData} /></Card>
        </div>

      </main>
    </div>
  );
}
