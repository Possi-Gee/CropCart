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
  prompt: `You are an expert agricultural advisor. Provide tailored farming tips for growing {{cropType}} in {{location}}.\n`,
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
