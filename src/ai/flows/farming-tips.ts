'use server';

/**
 * @fileOverview Provides tailored farming tips based on crop type and location.
 *
 * - getFarmingTips - A function that returns tailored farming tips.
 * - FarmingTipsInput - The input type for the getFarmingTips function.
 * - FarmingTipsOutput - The return type for the getFarmingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FarmingTipsInputSchema = z.object({
  cropType: z.string().describe('The type of crop for which tips are needed.'),
  location: z.string().describe('The location where the crop is being grown.'),
});
export type FarmingTipsInput = z.infer<typeof FarmingTipsInputSchema>;

const FarmingTipsOutputSchema = z.object({
  tips: z.string().describe('Tailored farming tips for the specified crop type and location.'),
});
export type FarmingTipsOutput = z.infer<typeof FarmingTipsOutputSchema>;

export async function getFarmingTips(input: FarmingTipsInput): Promise<FarmingTipsOutput> {
  return farmingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'farmingTipsPrompt',
  input: {schema: FarmingTipsInputSchema},
  output: {schema: FarmingTipsOutputSchema},
  prompt: `You are an expert agricultural advisor with decades of experience in various climates. A user is asking for farming tips.

Generate a comprehensive guide for growing '{{cropType}}' in '{{location}}'.

Provide clear, actionable advice structured in the following sections:

**1. Soil Preparation:**
- Recommended soil type (e.g., loamy, sandy).
- pH level recommendations.
- Suggested amendments (e.g., compost, manure, fertilizers).

**2. Planting:**
- Best time of year to plant in this location.
- Ideal seed depth and spacing.
- Any pre-planting seed treatments.

**3. Watering:**
- A suitable watering schedule (e.g., how often, how much).
- Best time of day to water.
- Signs of over or under-watering.

**4. Pest & Disease Control:**
- Common pests and diseases for this crop in the specified region.
- Organic and chemical control methods.
- Preventative measures.

**5. Harvesting:**
- How to know when the crop is ready to harvest.
- Proper harvesting techniques.
- Post-harvest storage tips.

Present the information in a clear, easy-to-read format.
`,
});

const farmingTipsFlow = ai.defineFlow(
  {
    name: 'farmingTipsFlow',
    inputSchema: FarmingTipsInputSchema,
    outputSchema: FarmingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
