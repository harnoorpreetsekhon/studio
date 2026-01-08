'use server';

/**
 * @fileOverview A flow for optimizing a promotional calendar.
 *
 * - optimizePromoCalendar - A function that generates an optimized promo calendar.
 * - PromoCalendarInput - The input type for the optimizePromoCalendar function.
 * - PromoCalendarOutput - The return type for the optimizePromoCalendar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromoCalendarInputSchema = z.object({
  product: z.string().describe('The product to optimize promotions for (or "All").'),
  region: z.string().describe('The region to optimize promotions for (or "All").'),
  currentWeek: z.number().describe('The current week number of the year (1-52).'),
});
export type PromoCalendarInput = z.infer<typeof PromoCalendarInputSchema>;

const OptimizedPromoSchema = z.object({
    week: z.number().describe('The recommended week number (e.g., 24).'),
    promoType: z.enum(['% discount', 'BOGO', 'cashback', 'bundle', 'volume_offer']).describe('The recommended promotion mechanic.'),
    discountDepth: z.string().describe('The recommended discount depth (e.g., "15-20%", "High Value").'),
    justification: z.string().describe('A brief explanation for why this promotion is recommended for this week.'),
});

const PromoCalendarOutputSchema = z.object({
  recommendations: z.array(OptimizedPromoSchema).describe('An array of 3-5 recommended promotions for the next quarter.'),
});
export type PromoCalendarOutput = z.infer<typeof PromoCalendarOutputSchema>;


export async function optimizePromoCalendar(input: PromoCalendarInput): Promise<PromoCalendarOutput> {
  return promoOptimizerFlow(input);
}

const optimizerPrompt = ai.definePrompt({
  name: 'promoOptimizerPrompt',
  input: {schema: PromoCalendarInputSchema},
  output: {schema: PromoCalendarOutputSchema},
  prompt: `You are a marketing strategy expert specializing in promotional calendar optimization. Your task is to recommend an optimal promotional calendar for the next quarter.

Current state:
- Product Focus: {{{product}}}
- Region: {{{region}}}
- Current Week of Year: {{{currentWeek}}}

Your recommendations should:
1.  Be for the upcoming 12 weeks.
2.  Include 3-5 distinct promotional periods. Do not recommend promotions for every week.
3.  Vary the promotion mechanics (e.g., % discount, BOGO, bundle).
4.  Suggest an appropriate discount depth (e.g., "10-15%", "25%", "High Value BOGO").
5.  Provide a clear justification for each recommendation, considering factors like seasonality (e.g., Q4 holidays, summer), avoiding cannibalization, and preventing customer saturation from too-frequent discounts.
6.  Assume a standard seasonality model with peaks in summer and late Q4, and a dip post-holidays.

Generate a strategic, actionable promotional plan.`,
});


const promoOptimizerFlow = ai.defineFlow(
  {
    name: 'promoOptimizerFlow',
    inputSchema: PromoCalendarInputSchema,
    outputSchema: PromoCalendarOutputSchema,
  },
  async input => {
    const {output} = await optimizerPrompt(input);
    return output!;
  }
);
