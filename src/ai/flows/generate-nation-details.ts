'use server';

/**
 * @fileOverview Generates a fictional nation's details based on a text prompt.
 *
 * - generateNationDetails - A function that generates the nation details.
 * - GenerateNationDetailsInput - The input type for the generateNationDetails function.
 * - GenerateNationDetailsOutput - The return type for the generateNationDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNationDetailsInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired nation.'),
});
export type GenerateNationDetailsInput = z.infer<typeof GenerateNationDetailsInputSchema>;

const GenerateNationDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the generated nation.'),
  culture: z.string().describe('The culture of the generated nation.'),
  politicalSystem: z.string().describe('The political system of the generated nation.'),
  visualAesthetic: z.string().describe('The visual aesthetic of the generated nation.'),
});
export type GenerateNationDetailsOutput = z.infer<typeof GenerateNationDetailsOutputSchema>;

export async function generateNationDetails(
  input: GenerateNationDetailsInput
): Promise<GenerateNationDetailsOutput> {
  return generateNationDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNationDetailsPrompt',
  input: {schema: GenerateNationDetailsInputSchema},
  output: {schema: GenerateNationDetailsOutputSchema},
  prompt: `You are a worldbuilding assistant. Given a prompt describing a nation, you will generate the nation's name, culture, political system, and visual aesthetic.

  Prompt: {{{prompt}}}

  Please generate the nation details based on the prompt.
  The response should be formatted as a JSON object.`, // Ensure valid JSON is returned
});

const generateNationDetailsFlow = ai.defineFlow(
  {
    name: 'generateNationDetailsFlow',
    inputSchema: GenerateNationDetailsInputSchema,
    outputSchema: GenerateNationDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
