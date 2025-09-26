
'use server';
/**
 * @fileOverview A flow to scan a file for viruses using a remote ClamAV REST API.
 *
 * - scanFileForVirus - A function that handles the virus scanning process.
 * - VirusScanInput - The input type for the scanFileForVirus function.
 * - VirusScanOutput - The return type for the scanFileForVirus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const VirusScanInputSchema = z.object({
  fileName: z.string().describe('The name of the file to scan.'),
  fileBuffer: z.instanceof(Buffer).describe('The file content as a Buffer.'),
});
export type VirusScanInput = z.infer<typeof VirusScanInputSchema>;

export const VirusScanOutputSchema = z.object({
  isInfected: z.boolean().describe('Whether a virus was detected or not.'),
  message: z.string().describe('A summary of the scan result.'),
});
export type VirusScanOutput = z.infer<typeof VirusScanOutputSchema>;

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
        // La respuesta de la API de cyberphor es texto simple, incluso en errores.
        // El cuerpo del error podría estar en `resultText`.
        throw new Error(`Error from API (${response.status}): ${resultText || response.statusText}`);
      }
      
      // La API devuelve un texto simple: "malicious" o "benign".
      if (resultText.trim() === '"malicious"') {
        return {
          isInfected: true,
          message: `¡Peligro! Se encontró una amenaza en el archivo ${fileName}.`,
        };
      } else if (resultText.trim() === '"benign"') {
        return {
          isInfected: false,
          message: 'El archivo es seguro. No se encontraron amenazas.',
        };
      } else {
        // Si la respuesta no es lo que esperamos, lo tratamos como un error.
        throw new Error(`Respuesta inesperada de la API: ${resultText}`);
      }
    } catch (error: any) {
      console.error('Fallo en la llamada a la API de antivirus:', error);
      // Aseguramos que cualquier error capturado se vuelva a lanzar como un objeto Error estándar
      // para ser manejado por la acción del servidor.
      throw new Error(error.message || 'Error desconocido al contactar el servicio de antivirus.');
    }
  }
);
