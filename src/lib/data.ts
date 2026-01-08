import type { PromoData, UniqueOptions } from './types';

const PRODUCTS = ["StellarGlow Serum", "AquaHydrate Moisturizer"];
const REGIONS = ["North", "South", "East", "West"];
const PROMO_TYPES = ["% discount", "BOGO", "cashback", "bundle", "volume_offer"];
const WEEKS = 104;

export function generatePromoData(): PromoData[] {
  const data: PromoData[] = [];
  let adstock = 0;
  const lambda = 0.5; // Adstock decay rate

  for (let week = 1; week <= WEEKS; week++) {
    for (const product of PRODUCTS) {
      for (const region of REGIONS) {
        const date = new Date(2022, 0, 3); // Start on first Monday of 2022
        date.setDate(date.getDate() + (week - 1) * 7);

        // Core fields
        const seasonality_index = 1 + Math.sin((week / 52) * 2 * Math.PI - Math.PI / 2) * 0.25; // Winter peak
        const baseline_sales = (500 + Math.random() * 100 + week * 5) * (product === "StellarGlow Serum" ? 1.2 : 0.8) * seasonality_index;
        
        let promo_flag = Math.random() < 0.25;
        const promo_type = promo_flag ? PROMO_TYPES[Math.floor(Math.random() * PROMO_TYPES.length)] : "none";
        let discount_pct = 0;
        if (promo_type === '% discount') discount_pct = (Math.floor(Math.random() * 6) + 1) * 0.05; // 5% to 30%
        if (promo_type === 'BOGO') discount_pct = 0.5;
        if (promo_type === 'cashback') discount_pct = 0.15;
        
        const price = (product === "StellarGlow Serum" ? 50 : 35) * (1 - discount_pct);
        const cost_of_goods = (product === "StellarGlow Serum" ? 15 : 10);
        const profit_margin = (price - cost_of_goods) / price;

        // MMM Drivers
        const marketing_spend_search = Math.random() * 500;
        const marketing_spend_social = Math.random() * 800;
        const marketing_spend_video = Math.random() * 1000;
        const competitor_price = price * (1 + (Math.random() - 0.5) * 0.2);

        // Operational Metrics
        const compliance_rate = promo_flag ? 0.85 + Math.random() * 0.15 : 1; // 85-100% for promo weeks
        const redemption_rate = (promo_type === 'cashback' || promo_type === '% discount') ? 0.4 + Math.random() * 0.3 : 0; // 40-70% for relevant types
        const stock_levels = 0.9 + Math.random() * 0.2; // 90% to 110% of expected sales

        // Derived Fields
        const promo_elasticity = -1.2 - Math.random() * 0.8;
        const marketing_effect = (marketing_spend_search + marketing_spend_social + marketing_spend_video) * 0.1;
        
        const promo_effect = promo_flag ? baseline_sales * (-promo_elasticity * discount_pct) * (1 - discount_pct) : 0; // Diminishing returns
        
        const sales = (baseline_sales + marketing_effect + promo_effect) * compliance_rate * (promo_flag ? stock_levels : 1) + (Math.random() - 0.5) * 50;
        const incremental_sales = Math.max(0, sales - baseline_sales);
        const incremental_revenue = incremental_sales * price;

        const promo_cost = promo_flag ? (sales * price * discount_pct) + (Math.random() * 200) : 0;
        const promo_units_sold = promo_flag ? sales : 0;
        const promo_revenue = promo_units_sold * price;
        
        adstock = (promo_flag ? 1 : 0) + adstock * lambda;
        const promo_lag_effect = adstock * promo_effect * 0.2; // Small lag effect

        const predicted_sales = baseline_sales + marketing_effect + promo_effect;
        const promo_roi = promo_cost > 0 ? incremental_revenue / promo_cost : 0;
        const profit_during_promo = promo_flag ? (sales * (price - cost_of_goods)) - promo_cost : 0;
        
        const promo_cannibalization = promo_flag ? Math.random() * 0.1 : 0; // 0-10% cannibalization
        const promo_halo_effect = promo_flag ? 1 + Math.random() * 0.05 : 1; // up to 5% halo
        
        const new_customers = promo_flag ? sales * (0.1 + Math.random() * 0.2) : sales * (0.05 + Math.random() * 0.05);
        const returning_customers = sales - new_customers;
        const loyalty_rate = returning_customers / sales;
        
        const acquisition_cost = promo_flag ? (promo_cost / new_customers) : 0;
        const retention_sales = returning_customers * price;


        data.push({
          date: date.toISOString().split('T')[0],
          product,
          region,
          sales: Math.round(sales),
          price,
          cost_of_goods,
          profit_margin,
          promo_flag,
          promo_type,
          discount_pct,
          promo_cost,
          promo_units_sold: Math.round(promo_units_sold),
          promo_revenue,
          marketing_spend_search,
          marketing_spend_social,
          marketing_spend_video,
          competitor_price,
          seasonality_index,
          baseline_sales: Math.round(baseline_sales),
          incremental_sales: Math.round(incremental_sales),
          incremental_revenue,
          promo_effect: Math.round(promo_effect),
          promo_elasticity,
          predicted_sales: Math.round(predicted_sales),
          promo_lag_effect: Math.round(promo_lag_effect),
          promo_roi,
          profit_during_promo,
          promo_cannibalization,
          promo_halo_effect,
          new_customers: Math.round(new_customers),
          returning_customers: Math.round(returning_customers),
          loyalty_rate,
          acquisition_cost,
          retention_sales,
          compliance_rate,
          redemption_rate,
          stock_levels,
        });
      }
    }
  }
  return data;
}

export const promoData = generatePromoData();

function getUniqueOptions(data: PromoData[]): UniqueOptions {
  const offerTypes = [...new Set(data.filter(d => d.promo_flag).map(d => d.promo_type))];
  const products = [...new Set(data.map(d => d.product))];
  const regions = [...new Set(data.map(d => d.region))];
  const discountBucketsRaw = [...new Set(data.filter(d=>d.discount_pct>0).map(d => Math.floor(d.discount_pct * 10)))];
  const discountBuckets = [...discountBucketsRaw].sort((a,b) => a-b).map(b => ({ label: `${b*10}-${(b+1)*10}%`, value: b.toString()}));

  return {
    offerType: offerTypes,
    product: products,
    region: regions,
    discountBucket: discountBuckets,
  };
}

export const uniqueFilterOptions = getUniqueOptions(promoData);
