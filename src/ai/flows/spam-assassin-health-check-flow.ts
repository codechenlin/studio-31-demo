'use server';
/**
 * @fileOverview A flow to check the health of the SpamAssassin API.
 *
 * - checkSpamAssassinHealth: A function that handles the health checking process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const API_BASE = "https://gdvsjd6vdkw749874bkd83.fanton.cloud:8081";

const SpamAssassinHealthOutputSchema = z.object({
  status: z.string(),
  spamd: z.object({
    host: z.string(),
    port: z.string(),
  }),
});
export type SpamAssassinHealthOutput = z.infer<typeof SpamAssassinHealthOutputSchema>;

export async function checkSpamAssassinHealth(): Promise<SpamAssassinHealthOutput> {
  return spamAssassinHealthFlow();
}

const spamAssassinHealthFlow = ai.defineFlow(
  {
    name: 'spamAssassinHealthFlow',
    outputSchema: SpamAssassinHealthOutputSchema,
  },
  async () => {
    const url = `${API_BASE}/health`;

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`SpamAssassin Health API Error: ${response.status}`, errorBody);
        throw new Error(`Error con la API de SpamAssassin: ${response.statusText}. Cuerpo: ${errorBody}`);
      }

      const result: SpamAssassinHealthOutput = await response.json();
      return result;

    } catch (error: any) {
      console.error('SpamAssassin Health API call failed:', error);
      throw new Error(`No se pudo conectar con la API de SpamAssassin: ${error.message}`);
    }
  }
);
