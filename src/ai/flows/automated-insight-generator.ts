'use server';

/**
 * @fileOverview A flow for generating automated insights based on dashboard data.
 *
 * - generateInsights - A function that generates insights from the provided data.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  totalPromoSpend: z.number().describe('Total promotional spend.'),
  totalPromoRevenue: z.number().describe('Total revenue generated from promotions.'),
  incrementalPromoRevenue: z.number().describe('Incremental revenue from promotions.'),
  incrementalPromoSalesLift: z.number().describe('Incremental sales lift percentage from promotions.'),
  baselineSales: z.number().describe('Baseline sales without promotions.'),
  promoElasticity: z.number().describe('Price elasticity of promotions.'),
  averageDiscount: z.number().describe('Average discount percentage offered during promotions.'),
  offerEffectivenessIndex: z.number().describe('Index indicating the effectiveness of different offers.'),
  promoRoi: z.number().describe('Return on investment for promotions.'),
  profitDuringPromo: z.number().describe('Profit generated during promotional periods.'),
  promoCannibalization: z.number().describe('Percentage of sales cannibalized from other products during promotions.'),
  promoHaloEffectIndex: z.number().describe('Index indicating the halo effect on other products during promotions.'),
  seasonalityIndex: z.number().describe('Index indicating the current seasonality.'),
  promoType: z.string().describe('Type of promotion (e.g., % discount, BOGO).'),
  product: z.string().describe('The product being promoted.'),
  region: z.string().describe('The region where the promotion is running.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('Array of actionable insights.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const insightPrompt = ai.definePrompt({
  name: 'insightPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an expert marketing analyst. Analyze the following data and generate 3 short, actionable insights for a business user. 

Consider factors such as offer type, seasonality, and pricing. Use the MMM results to provide clear findings.

Data:
Total Promo Spend: {{{totalPromoSpend}}}
Total Promo Revenue: {{{totalPromoRevenue}}}
Incremental Promo Revenue: {{{incrementalPromoRevenue}}}
Incremental Promo Sales Lift (%): {{{incrementalPromoSalesLift}}}
Baseline Sales: {{{baselineSales}}}
Promo Elasticity: {{{promoElasticity}}}
Average Discount %: {{{averageDiscount}}}
Offer Effectiveness Index: {{{offerEffectivenessIndex}}}
Promo ROI: {{{promoRoi}}}
Profit During Promo: {{{profitDuringPromo}}}
Promo Cannibalization %: {{{promoCannibalization}}}
Promo Halo Effect Index: {{{promoHaloEffectIndex}}}
Seasonality Index: {{{seasonalityIndex}}}
Promo Type: {{{promoType}}}
Product: {{{product}}}
Region: {{{region}}}

Insights:`,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await insightPrompt(input);
    return output!;
  }
);
