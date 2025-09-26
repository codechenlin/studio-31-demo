
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
    const apiUrl = 'http://apiantivirus.fanton.cloud/scan';

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
      
      // The Node.js API returns a JSON object directly.
      const result = await response.json();
      
      // We expect a structure like { isInfected: boolean, viruses: string[] }
      if (typeof result.isInfected !== 'boolean' || !Array.isArray(result.viruses)) {
          throw new Error('API returned an invalid response format.');
      }

      return {
          isInfected: result.isInfected,
          viruses: result.viruses,
      };

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
