 "use server";

import { generateInsights, type GenerateInsightsInput } from "@/ai/flows/automated-insight-generator";

export async function getAiInsights(kpis: Omit<GenerateInsightsInput, 'promoType' | 'product' | 'region'>) {
    try {
        // These are approximations for the AI model as they can't be derived from aggregated KPIs
        const input: GenerateInsightsInput = {
            ...kpis,
            totalPromoRevenue: kpis.totalPromoRevenue,
            incrementalPromoRevenue: kpis.incrementalPromoRevenue,
            incrementalPromoSalesLift: kpis.incrementalPromoSalesLift,
            baselineSales: kpis.totalBaselineSales,
            promoElasticity: kpis.promoElasticity,
            averageDiscount: kpis.averageDiscount,
            offerEffectivenessIndex: kpis.offerEffectivenessIndex,
            promoRoi: kpis.promoRoi,
            profitDuringPromo: kpis.profitDuringPromo,
            promoCannibalization: kpis.promoCannibalization,
            promoHaloEffectIndex: kpis.promoHaloEffectIndex,
            seasonalityIndex: 1.1, // Assuming average seasonality
            promoType: "Mixed",
            product: "All",
            region: "All"
        };
        const result = await generateInsights(input);
        return { success: true, insights: result.insights };
    } catch (error) {
        console.error("Error generating insights:", error);
        return { success: false, error: "Failed to generate insights." };
    }
}
