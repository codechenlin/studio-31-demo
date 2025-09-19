
'use server';
/**
 * @fileOverview An AI agent to verify and diagnose the health of a domain's DNS records for email.
 *
 * - verifyDnsHealth - A function that uses AI to analyze DNS records.
 * - DnsHealthInput - The input type for the verifyDnsHealth function.
 * - DnsHealthOutput - The return type for the verifyDnsHealth function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import dns from 'node:dns/promises';

export type DnsHealthInput = z.infer<typeof DnsHealthInputSchema>;
const DnsHealthInputSchema = z.object({
  domain: z.string().describe('The domain name to check.'),
  dkimPublicKey: z.string().describe('The expected DKIM public key for the "daybuu" selector.'),
});

export type DnsHealthOutput = z.infer<typeof DnsHealthOutputSchema>;
const DnsHealthOutputSchema = z.object({
  spfStatus: z.enum(['verified', 'unverified', 'not-found']).describe('Status of the SPF record.'),
  dkimStatus: z.enum(['verified', 'unverified', 'not-found']).describe('Status of the DKIM record.'),
  dmarcStatus: z.enum(['verified', 'unverified', 'not-found']).describe('Status of the DMARC record.'),
  analysis: z.string().describe('A natural language analysis of the findings, explaining what is wrong and how to fix it, if needed. Be concise and direct.'),
});

export async function verifyDnsHealth(
  input: DnsHealthInput
): Promise<DnsHealthOutput | null> {
  try {
    return await dnsHealthCheckFlow(input);
  } catch (error) {
    console.error("Flow execution failed:", error);
    // Propagate the original error message
    throw error;
  }
}

const getTxtRecords = async (name: string): Promise<string[]> => {
  try {
    // resolveTxt can return string[][]
    const records = await dns.resolveTxt(name);
    // Flatten and join to handle split TXT records
    return records.map(rec => rec.join(''));
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return [];
    }
    // Re-throw other errors
    throw error;
  }
};


const dnsHealthCheckFlow = ai.defineFlow(
  {
    name: 'dnsHealthCheckFlow',
    inputSchema: DnsHealthInputSchema,
    outputSchema: DnsHealthOutputSchema,
  },
  async ({ domain, dkimPublicKey }) => {
    
    const [spfRecords, dkimRecords, dmarcRecords] = await Promise.all([
      getTxtRecords(domain),
      getTxtRecords(`daybuu._domainkey.${domain}`),
      getTxtRecords(`_dmarc.${domain}`),
    ]);

    const expertPrompt = ai.definePrompt({
        name: 'dnsHealthExpertPrompt',
        output: { schema: DnsHealthOutputSchema },
        prompt: `Eres un experto en DNS y entregabilidad de correo electrónico. Tu respuesta DEBE ser en español.
        Tu única tarea es analizar los registros SPF, DKIM y DMARC para el dominio {{domain}}. 
        
        Regla de Oro para SPF: Un registro TXT solo se considera un registro SPF si y solo si comienza con "v=spf1". CUALQUIER OTRO REGISTRO TXT DEBE SER IGNORADO POR COMPLETO para el análisis de SPF.

        Configuración Ideal Esperada para los Registros Obligatorios:
        1.  Registro SPF:
            - Host/Nombre: @
            - DEBE existir solo UN registro TXT que comience con "v=spf1". Si hay más de uno, es un error grave.
            - El Valor del Registro debe comenzar con "v=spf1", contener "include:_spf.daybuu.com", y terminar con un mecanismo como "-all".
            - El registro puede contener otros mecanismos como 'include:spf.otro.com', 'ip4:', 'a:', 'mx:'. Esto es correcto y se llama unificar. No lo marques como error. Simplemente verifica que nuestro 'include' esté presente.
            - Ejemplo de registro unificado válido: 'v=spf1 include:spf.otro.com include:_spf.daybuu.com -all'

        2.  Registro DKIM:
            - Host/Nombre: daybuu._domainkey.{{domain}}
            - Pueden existir múltiples registros DKIM con diferentes selectores; tu trabajo es verificar únicamente el que corresponde a "daybuu".
            - Valor del Registro debe ser exactamente: "{{dkimPublicKey}}". Verifica que contenga "v=DKIM1;", "k=rsa;", y que la clave pública en "p=" coincida.

        3.  Registro DMARC:
            - Host/Nombre: _dmarc.{{domain}}
            - Debe existir solo UN registro DMARC.
            - Valor del Registro debe contener: "v=DMARC1;", "p=reject;", "pct=100;", "sp=reject;".
            - La etiqueta 'aspf' debe ser 's' o 'r'.
            - La etiqueta 'adkim' debe ser 's' o 'r'.

        Registros DNS Encontrados:
        - Registros TXT encontrados en {{domain}}: {{{spfRecords}}}
        - Registros TXT encontrados en daybuu._domainkey.{{domain}}: {{{dkimRecords}}}
        - Registros TXT encontrados en _dmarc.{{domain}}: {{{dmarcRecords}}}

        Tu Tarea (en español):
        1.  Para SPF: Primero, filtra la lista de registros en {{domain}} y quédate solo con los que empiezan con "v=spf1". Ignora todos los demás. Luego, aplica las reglas de verificación a los que quedaron.
        2.  Compara rigurosamente los registros encontrados (SPF, DKIM, DMARC) con la configuración ideal. Un registro es "unverified" si existe pero no cumple con CUALQUIERA de las reglas (sintaxis, valores requeridos, unicidad, etc.).
        3.  Determina el estado de cada registro (verified, unverified, not-found).
        4.  Proporciona un análisis breve y claro en 'analysis'. Si todo es correcto, felicita al usuario. Si algo está mal, explica el problema específico y cómo solucionarlo de forma sencilla.
        5.  Al mencionar el valor DKIM en tu análisis, NUNCA muestres la clave pública completa. Muestra solo el inicio, así: "v=DKIM1; k=rsa; p=MIIBIjA...".
        `
    });

    const { output } = await expertPrompt({
        domain,
        dkimPublicKey,
        spfRecords: JSON.stringify(spfRecords),
        dkimRecords: JSON.stringify(dkimRecords),
        dmarcRecords: JSON.stringify(dmarcRecords),
    });

    if (!output) {
      throw new Error("La IA no pudo generar un análisis.");
    }
    
    return output;
  }
);
