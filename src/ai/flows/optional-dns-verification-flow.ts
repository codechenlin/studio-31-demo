
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
  analysis: z.string().describe('A natural language analysis of the optional records, explaining their purpose and how to fix them if they are misconfigured. Be concise and direct. Respond in Spanish.'),
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
        prompt: `Analiza y verifica únicamente los registros DNS de tipo TXT para MX, BIMI y VMC. Ignora cualquier otro tipo de registro DNS y no respondas sobre ellos. Tu respuesta DEBE ser en español.

        Registros DNS Encontrados:
        - Registros MX encontrados en {{domain}}: {{{mxRecords}}}
        - Registros TXT encontrados en default._bimi.{{domain}} (para BIMI y VMC): {{{bimiRecords}}}

        Reglas de verificación por tipo:
        
        1. MX
        - Puede haber múltiples registros MX, cada uno con su propia prioridad.
        - El Host/Nombre debe ser @.
        - Para ser "verified", al menos un registro debe apuntar a "daybuu.com" con prioridad 0.
        
        2. BIMI
        - Puede haber varios registros BIMI, cada uno con un selector diferente.
        - El Host/Nombre debe ser "default._bimi" (u otro selector).
        - El valor del registro debe contener "v=BIMI1;" y "l=https:".
        
        3. VMC
        - El registro VMC es una extensión del registro BIMI.
        - El Host/Nombre es el mismo que el de BIMI (ej. "default._bimi").
        - Para ser "verified", el registro TXT de BIMI debe contener "v=BIMI1;" y ADEMÁS la etiqueta "a=https:".
        - Es "unverified" si existe el registro BIMI pero le falta la etiqueta "a=".

        Tu Tarea (en español):
        1. Compara rigurosamente los registros encontrados con la configuración ideal.
        2. Determina el estado de cada registro (verified, unverified, not-found).
        3. Proporciona un análisis breve y claro en 'analysis'. Explica el propósito de cada registro opcional y, si alguno está mal o falta, cómo solucionarlo.
        `
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
