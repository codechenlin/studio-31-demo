'use server';
/**
 * @fileOverview A flow to scan an email for spam using a self-hosted SpamAssassin API.
 *
 * - scanWithSpamAssassin: A function that handles the spam checking process.
 * - SpamAssassinInput: The input type for the scanWithSpamAssassin function.
 * - SpamAssassinOutput: The return type for the scanWithSpamAssassin function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const API_BASE = "https://gdvsjd6vdkw749874bkd83.fanton.cloud";
const API_KEY = "gfklVD7KBD099467gufdTBJ6785hflVNCI8GDOndk748DG8409421hujfGD87fBFK7fn";

export const SpamAssassinInputSchema = z.object({
  raw: z.string().describe('El mensaje de correo electrónico completo en formato RFC822.'),
  sensitivity: z.number().min(0.1).max(20.0).optional().default(5.0).describe('El umbral de sensibilidad de spam. Por defecto es 5.0.'),
});
export type SpamAssassinInput = z.infer<typeof SpamAssassinInputSchema>;

export const SpamAssassinOutputSchema = z.object({
  status: z.string(),
  score: z.number(),
  threshold: z.number(),
  is_spam: z.boolean(),
  details: z.string(),
});
export type SpamAssassinOutput = z.infer<typeof SpamAssassinOutputSchema>;

export async function scanWithSpamAssassin(
  input: SpamAssassinInput
): Promise<SpamAssassinOutput> {
  return spamAssassinFlow(input);
}

const spamAssassinFlow = ai.defineFlow(
  {
    name: 'spamAssassinFlow',
    inputSchema: SpamAssassinInputSchema,
    outputSchema: SpamAssassinOutputSchema,
  },
  async ({ raw, sensitivity }) => {
    
    if (!API_KEY) {
      throw new Error('SPAMASSASSIN_API_KEY is not defined in environment variables.');
    }
    
    const url = `${API_BASE}/scan-json`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ raw, sensitivity }),
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`SpamAssassin API Error: ${response.status}`, errorBody);
        throw new Error(`Error con la API de SpamAssassin: ${response.statusText}. Cuerpo: ${errorBody}`);
      }

      const result: SpamAssassinOutput = await response.json();
      return result;

    } catch (error: any) {
      console.error('SpamAssassin API call failed:', error);
      throw new Error(`No se pudo conectar con la API de SpamAssassin: ${error.message}`);
    }
  }
);
