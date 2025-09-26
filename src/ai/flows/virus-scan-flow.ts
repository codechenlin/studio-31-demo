
'use server';
/**
 * @fileOverview A flow to scan a file for viruses using a remote ClamAV REST API.
 *
 * - scanFileForVirus - A function that handles the virus scanning process.
 */

import { ai } from '@/ai/genkit';
import { VirusScanInput, VirusScanInputSchema, VirusScanOutput, VirusScanOutputSchema } from './virus-scan-types';


export async function scanFileForVirus(
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
  async ({ fileName, fileBuffer }) => {
    const apiUrl = process.env.NEXT_PUBLIC_ANTIVIRUS_API_URL;
    if (!apiUrl) {
      throw new Error('La URL de la API de antivirus no está configurada en las variables de entorno.');
    }

    try {
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer]), fileName);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      const resultText = await response.text();

      if (!response.ok) {
        throw new Error(`Error from API (${response.status}): ${resultText || response.statusText}`);
      }
      
      if (resultText.trim().includes("malicious")) {
        return {
          isInfected: true,
          message: `¡Peligro! Se encontró una amenaza en el archivo ${fileName}.`,
        };
      } else if (resultText.trim().includes("benign")) {
        return {
          isInfected: false,
          message: 'El archivo es seguro. No se encontraron amenazas.',
        };
      } else {
        throw new Error(`Respuesta inesperada de la API: ${resultText}`);
      }
    } catch (error: any) {
      console.error('Fallo en la llamada a la API de antivirus:', error);
      throw new Error(error.message || 'Error desconocido al contactar el servicio de antivirus.');
    }
  }
);
