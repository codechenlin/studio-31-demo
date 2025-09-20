
'use server';
/**
 * @fileOverview An AI agent to verify and diagnose the health of a domain's OPTIONAL DNS records.
 *
 * - verifyOptionalDnsHealth - A function that uses AI to analyze optional DNS records.
 * - OptionalDnsHealthInput - The input type for the verifyOptionalDnsHealth function.
 * - OptionalDnsHealthOutput - The return type for the verifyOptionalDnsHealth function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import dns from 'node:dns/promises';

export type OptionalDnsHealthInput = z.infer<typeof OptionalDnsHealthInputSchema>;
const OptionalDnsHealthInputSchema = z.object({
  domain: z.string().describe('The domain name to check.'),
});

export type OptionalDnsHealthOutput = z.infer<typeof OptionalDnsHealthOutputSchema>;
const OptionalDnsHealthOutputSchema = z.object({
  mxStatus: z.enum(['verified', 'unverified', 'not-found']).describe('Status of the MX record.'),
  bimiStatus: z.enum(['verified', 'unverified', 'not-found']).describe('Status of the BIMI record.'),
  vmcStatus: z.enum(['verified', 'unverified', 'not-found']).describe('Status of the VMC record.'),
  analysis: z.string().describe('A natural language analysis of the optional records, explaining their purpose and how to fix them if they are misconfigured. Be concise and direct. Respond in Spanish and always use emojis.'),
});

export async function verifyOptionalDnsHealth(
  input: OptionalDnsHealthInput
): Promise<OptionalDnsHealthOutput | null> {
  try {
    return await optionalDnsHealthCheckFlow(input);
  } catch (error) {
    console.error("Optional DNS flow execution failed:", error);
    throw error;
  }
}

const getTxtRecords = async (name: string): Promise<string[]> => {
  try {
    const records = await dns.resolveTxt(name);
    return records.map(rec => rec.join(''));
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return [];
    }
    throw error;
  }
};

const getMxRecords = async (domain: string): Promise<dns.MxRecord[]> => {
    try {
        return await dns.resolveMx(domain);
    } catch (error: any) {
        if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
            return [];
        }
        throw error;
    }
}


const optionalDnsHealthCheckFlow = ai.defineFlow(
  {
    name: 'optionalDnsHealthCheckFlow',
    inputSchema: OptionalDnsHealthInputSchema,
    outputSchema: OptionalDnsHealthOutputSchema,
  },
  async ({ domain }) => {
    
    const [mxRecords, bimiRecords] = await Promise.all([
      getMxRecords(domain),
      getTxtRecords(`default._bimi.${domain}`),
    ]);

    const expertPrompt = ai.definePrompt({
        name: 'optionalDnsHealthExpertPrompt',
        output: { schema: OptionalDnsHealthOutputSchema },
        prompt: `Eres un experto en DNS y reputación de marca por correo electrónico. Analiza los siguientes registros DNS opcionales para el dominio {{{domain}}} y explica su propósito y estado. Responde siempre en español y utiliza emojis para que tu análisis sea claro.

Contexto de los Registros (en formato JSON):
- Registros MX encontrados en el dominio raíz: {{{mxRecords}}}
- Registros BIMI/VMC encontrados en default._bimi.{{{domain}}}: {{{bimiRecords}}}

Sigue estas reglas para tu análisis:

1.  **Análisis MX (Mail Exchange):**
    *   **Estado \`not-found\`**: Si el array \`mxRecords\` está vacío.
    *   **Estado \`unverified\`**: Si ningún registro MX tiene el valor (exchange) \`daybuu.com\`.
    *   **Estado \`verified\`**: Si al menos un registro MX apunta a \`daybuu.com\` (la prioridad no importa para esta verificación). ✅

2.  **Análisis BIMI (Brand Indicators for Message Identification):**
    *   **Estado \`not-found\`**: Si el array \`bimiRecords\` está vacío.
    *   **Estado \`unverified\`**: Si ningún registro contiene la etiqueta \`v=BIMI1;\` o si falta la etiqueta \`l=https://...\` que apunta a un logo SVG.
    *   **Estado \`verified\`**: Si se encuentra un registro que contiene \`v=BIMI1;\` y una etiqueta \`l=\` con una URL. ✅

3.  **Análisis VMC (Verified Mark Certificate):**
    *   **Estado \`not-found\`**: Si no hay un registro BIMI o si el registro BIMI no contiene la etiqueta \`a=\`.
    *   **Estado \`unverified\`**: Si el registro BIMI existe pero la etiqueta \`a=\` está vacía o no apunta a una URL de un certificado \`.pem\`.
    *   **Estado \`verified\`**: Si el registro BIMI contiene una etiqueta \`a=\` que apunta a la URL de un certificado VMC. ✅

**Formato de la Respuesta en el campo \`analysis\`:**

Genera un resumen claro. Para cada registro (MX, BIMI, VMC), explica brevemente su propósito, indica su estado y, si no está verificado, explica por qué y cómo solucionarlo.

**Ejemplo de Análisis:**
"
### Análisis de Registros Opcionales  अतिरिक्त
✨ **MX:** ¡Configurado! Este registro le dice al mundo que nuestros servidores reciben correos para tu dominio.

🖼️ **BIMI:** ¡Encontrado! Este registro permite que tu logo aparezca en la bandeja de entrada de tus clientes, ¡genial para el reconocimiento de marca!

📜 **VMC:** No hemos encontrado un Certificado de Marca Verificada (VMC) en tu registro BIMI. Aunque es opcional, añadirlo aumenta aún más la confianza y es requerido por proveedores como Gmail para mostrar tu logo.
"
`,
    });

    const { output } = await expertPrompt({
        domain,
        mxRecords: JSON.stringify(mxRecords),
        bimiRecords: JSON.stringify(bimiRecords),
    });

    if (!output) {
      throw new Error("La IA no pudo generar un análisis para los registros opcionales.");
    }
    
    return output;
  }
);
