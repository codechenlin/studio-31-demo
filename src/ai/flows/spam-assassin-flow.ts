'use server';
/**
 * @fileOverview A flow to scan an email for spam using a self-hosted SpamAssassin API.
 *
 * - scanWithSpamAssassin: A function that handles the spam checking process.
 */

import { ai } from '@/ai/genkit';
import { SpamAssassinInputSchema, SpamAssassinOutputSchema, type SpamAssassinInput, type SpamAssassinOutput } from './spam-assassin-types';

const API_BASE = "https://gdvsjd6vdkw749874bkd83.fanton.cloud:8081";
const API_KEY = "gfklVD7KBD099467gufdTBJ6785hflVNCI8GDOndk748DG8409421hujfGD87fBFK7fn";


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
