
'use server';
/**
 * @fileOverview A flow to scan a file for viruses using an external ClamAV API.
 *
 * - scanFileForViruses - A function that handles the virus scanning process.
 * - VirusScanInput - The input type for the scanFileForViruses function.
 * - VirusScanOutput - The return type for the scanFileForViruses function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VirusScanInputSchema = z.object({
  fileName: z.string(),
  fileDataUri: z.string().describe('The file content as a data URI.'),
});
export type VirusScanInput = z.infer<typeof VirusScanInputSchema>;

const VirusScanOutputSchema = z.object({
  isInfected: z.boolean(),
  viruses: z.array(z.string()),
  error: z.string().optional(),
});
export type VirusScanOutput = z.infer<typeof VirusScanOutputSchema>;

export async function scanFileForViruses(
  input: VirusScanInput
): Promise<VirusScanOutput> {
  return virusScanFlow(input);
}

const virusScanFlow = ai.defineFlow(
  {
    name: 'virusScanFlow',
    inputSchema: VirusScanInputSchema,
    outputSchema: VirusScanOutputSchema,
  },
  async ({ fileName, fileDataUri }) => {
    // This is the API endpoint you deployed on Coolify.
    const apiUrl = 'http://apiantivirus.fanton.cloud/api/v1/scan';

    try {
      // Convert data URI to a Buffer for sending.
      const base64Data = fileDataUri.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid data URI format.');
      }
      const buffer = Buffer.from(base64Data, 'base64');
      
      const formData = new FormData();
      formData.append('file', new Blob([buffer]), fileName);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Handle HTTP errors like 502, 500, etc.
        const errorText = await response.text();
        throw new Error(`Error from API (${response.status}): ${errorText || response.statusText}`);
      }
      
      // The cyberphor API returns a plain text string.
      const resultText = await response.text();
      
      // We need to parse this text to fit our expected JSON output.
      const cleanedResult = resultText.replace(/"/g, '').trim();

      if (cleanedResult === 'malicious') {
          return {
              isInfected: true,
              viruses: ['Eicar-Test-Signature'], // We can use a generic name or parse if available in other contexts
          };
      } else if (cleanedResult === 'benign') {
          return {
              isInfected: false,
              viruses: [],
          };
      } else {
           // If the response is something else, treat it as an error.
          throw new Error(`Unexpected response from API: ${resultText}`);
      }

    } catch (error: any) {
      console.error('Virus Scan Flow Error:', error);
      // Ensure that a consistent error format is returned.
      return {
        isInfected: false,
        viruses: [],
        error: `Error al contactar el servicio de antivirus: ${error.message}`,
      };
    }
  }
);
