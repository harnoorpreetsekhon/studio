export type PromoData = {
    date: string;
    product: string;
    region: string;
    sales: number;
    price: number;
    cost_of_goods: number;
    profit_margin: number;
    promo_flag: boolean;
    promo_type: string;
    discount_pct: number;
    promo_cost: number;
    promo_units_sold: number;
    promo_revenue: number;
    marketing_spend_search: number;
    marketing_spend_social: number;
    marketing_spend_video: number;
    competitor_price: number;
    seasonality_index: number;
    baseline_sales: number;
    incremental_sales: number;
    incremental_revenue: number;
    promo_effect: number;
    promo_elasticity: number;
    predicted_sales: number;
    promo_lag_effect: number;
    promo_roi: number;
    profit_during_promo: number;
    promo_cannibalization: number;
    promo_halo_effect: number;
    new_customers: number;
    returning_customers: number;
    loyalty_rate: number;
    acquisition_cost: number;
    retention_sales: number;
    compliance_rate: number;
    redemption_rate: number;
    stock_levels: number;
  };
  
  export type UniqueOptions = {
    offerType: string[];
    product: string[];
    region: string[];
    discountBucket: {label: string, value: string}[];
  };
  