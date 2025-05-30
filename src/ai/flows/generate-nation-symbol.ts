'use server';

/**
 * @fileOverview Generates a flag/banner for a nation based on a text prompt using GenAI image generation.
 *
 * - generateNationSymbol - A function that handles the generation of a nation's symbol.
 * - GenerateNationSymbolInput - The input type for the generateNationSymbol function.
 * - GenerateNationSymbolOutput - The return type for the generateNationSymbol function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNationSymbolInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired flag/banner for the nation.'),
});
export type GenerateNationSymbolInput = z.infer<typeof GenerateNationSymbolInputSchema>;

const GenerateNationSymbolOutputSchema = z.object({
  symbolDataUri: z
    .string()
    .describe(
      'A data URI containing the generated flag/banner image, including MIME type and Base64 encoding (e.g., data:image/png;base64,...).'
    ),
});
export type GenerateNationSymbolOutput = z.infer<typeof GenerateNationSymbolOutputSchema>;

export async function generateNationSymbol(input: GenerateNationSymbolInput): Promise<GenerateNationSymbolOutput> {
  return generateNationSymbolFlow(input);
}

const generateNationSymbolFlow = ai.defineFlow(
  {
    name: 'generateNationSymbolFlow',
    inputSchema: GenerateNationSymbolInputSchema,
    outputSchema: GenerateNationSymbolOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {symbolDataUri: media.url!};
  }
);
