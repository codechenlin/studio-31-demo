
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
        prompt: `Analiza y verifica únicamente los registros DNS de tipo TXT para los siguientes tipos: SPF, DKIM, DMARC. Ignora cualquier otro tipo de registro DNS y no respondas sobre ellos. Tu respuesta DEBE ser en español.

        Registros DNS Encontrados:
        - Registros TXT encontrados en {{domain}}: {{{spfRecords}}}
        - Registros TXT encontrados en daybuu._domainkey.{{domain}}: {{{dkimRecords}}}
        - Registros TXT encontrados en _dmarc.{{domain}}: {{{dmarcRecords}}}
        
        Reglas de verificación por tipo:
        
        1. SPF
        - El Host/Nombre debe ser @.
        - Para que un registro TXT sea considerado SPF, DEBE comenzar con "v=spf1". Si no, ignóralo por completo.
        - Una vez identificado un registro SPF:
            - Debe contener la cadena "include:_spf.daybuu.com".
            - Debe terminar EXACTAMENTE con "-all".
            - No puede existir más de UN registro SPF por dominio. Si hay más de uno, es un error grave.
            - Puede contener otros mecanismos como 'include:', 'ip4:', 'a:', 'mx:'. Esto es correcto y se llama unificar. No lo marques como error. Simplemente verifica que nuestro 'include' esté presente.
        
        2. DKIM
        - Puede haber varios registros en el mismo dominio, cada uno con un selector diferente. No se unifican.
        - Verifica que el Host/Nombre sea exactamente "daybuu._domainkey.{{domain}}".
        - El valor del registro debe ser exactamente: "{{dkimPublicKey}}". Verifica que contenga "v=DKIM1;", "k=rsa;", y que la clave pública en "p=" coincida.
        
        3. DMARC
        - Solo puede existir un registro DMARC por dominio.
        - El Host/Nombre debe ser "_dmarc".
        - El valor del registro debe contener "v=DMARC1;", "p=reject;", "pct=100;", y "sp=reject;".
        - La etiqueta 'aspf' debe tener un valor de 's' (estricto) o 'r' (relajado).
        - La etiqueta 'adkim' debe tener un valor de 's' (estricto) o 'r' (relajado).

        Tu Tarea (en español):
        1. Para SPF: Primero, filtra la lista de registros en {{domain}} y quédate solo con los que empiezan con "v=spf1". Ignora todos los demás. Luego, aplica las reglas de verificación a los que quedaron.
        2. Compara rigurosamente los registros encontrados (SPF, DKIM, DMARC) con la configuración ideal. Un registro es "unverified" si existe pero no cumple con CUALQUIERA de las reglas (sintaxis, valores requeridos, unicidad, etc.).
        3. Determina el estado de cada registro (verified, unverified, not-found).
        4. Proporciona un análisis breve y claro en 'analysis'. Si todo es correcto, felicita al usuario. Si algo está mal, explica el problema específico y cómo solucionarlo de forma sencilla.
        5. Al mencionar el valor DKIM en tu análisis, NUNCA muestres la clave pública completa. Muestra solo el inicio, así: "v=DKIM1; k=rsa; p=MIIBIjA...".`
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
