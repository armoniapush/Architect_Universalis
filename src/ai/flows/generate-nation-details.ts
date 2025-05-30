
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
  culture: z.string().describe('A detailed description of the prevailing culture, including customs, beliefs, and social structures.'),
  politicalSystem: z.string().describe('A detailed description of the political system and governance structure.'),
  visualAesthetic: z.string().describe('The visual aesthetic of the generated nation.'),
  economy: z.string().describe("An overview of the nation's economy, including primary industries, trade, and economic principles."),
  languages: z.array(z.string()).describe('An array of prominent languages spoken in the nation, with the primary language listed first if possible.'),
  historySummary: z.string().describe("A summary of the nation's history, covering key periods from prehistory to the present, including significant events and developments."),
  foundingMythology: z.string().describe("A brief account of the nation's founding myths or key genealogical narratives that shape its identity."),
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
  prompt: `You are a worldbuilding assistant. Given a prompt describing a nation, you will generate the nation's details.

  Prompt: {{{prompt}}}

  Please generate the following nation details based on the prompt:
  - Name: The name of the generated nation.
  - Culture: A detailed description of the prevailing culture, including customs, beliefs, and social structures.
  - Political System: A detailed description of the political system and governance structure.
  - Visual Aesthetic: The visual aesthetic of the generated nation.
  - Economy: An overview of the nation's economy, including primary industries, trade, and economic principles.
  - Languages: An array of prominent languages spoken in the nation. List the primary language first if identifiable.
  - History Summary: A summary of the nation's history, covering key periods from prehistory to the present, including significant events and developments.
  - Founding Mythology: A brief account of the nation's founding myths or key genealogical narratives that shape its identity.

  The response should be formatted as a JSON object.`,
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
