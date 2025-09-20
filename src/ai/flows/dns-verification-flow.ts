
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
  analysis: z.string().describe('A natural language analysis of the findings, explaining what is wrong and how to fix it, if needed. Be concise and direct. Respond in Spanish and always use emojis.'),
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
        prompt: `Eres un experto en DNS y seguridad de correo electrónico. Analiza los siguientes registros DNS para el dominio {{{domain}}} y determina su estado de salud para el envío de correos. Responde siempre en español y utiliza emojis para que tu análisis sea más claro y amigable.

Contexto de los Registros (en formato JSON):
- Registros SPF encontrados en el dominio raíz: {{{spfRecords}}}
- Registros DKIM encontrados en daybuu._domainkey.{{{domain}}}: {{{dkimRecords}}}
- Registros DMARC encontrados en _dmarc.{{{domain}}}: {{{dmarcRecords}}}
- Clave pública DKIM esperada: {{{dkimPublicKey}}}

Sigue estas reglas ESTRICTAS para tu análisis:

1.  **Análisis SPF (Sender Policy Framework):**
    *   **Estado \`not-found\`**: Si el array \`spfRecords\` está vacío o no contiene ningún registro que empiece con \`v=spf1\`.
    *   **Estado \`unverified\`**:
        *   Si hay más de un registro SPF (más de un string que empiece con \`v=spf1\`). ¡SOLO PUEDE HABER UNO! 🚨
        *   Si el registro no contiene \`include:_spf.daybuu.com\`.
        *   Si el registro no termina con un mecanismo \`all\` válido, preferiblemente \`-all\` (RECHAZAR) o \`~all\` (FALLO SUAVE).
        *   Si el registro supera el límite de 10 búsquedas DNS. Explica esto con la analogía de la mochila: "Imagina que el límite de 10 búsquedas es como una mochila con 10 espacios. Si Google Workspace ya usa 9, y añades otro servicio que necesita 3, ¡la mochila se rompe y el SPF falla!".
    *   **Estado \`verified\`**: Si existe un único registro SPF que cumple con tener \`v=spf1\`, \`include:_spf.daybuu.com\` y un mecanismo \`all\` final. ✅

2.  **Análisis DKIM (DomainKeys Identified Mail):**
    *   **Estado \`not-found\`**: Si el array \`dkimRecords\` está vacío.
    *   **Estado \`unverified\`**:
        *   Si ningún registro contiene la etiqueta \`v=DKIM1;\`.
        *   Si ningún registro contiene la etiqueta \`k=rsa;\`.
        *   Si la clave pública en la etiqueta \`p=\` **no coincide exactamente** con la \`dkimPublicKey\` esperada. ¡Debe ser una coincidencia perfecta! 🕵️‍♂️
    *   **Estado \`verified\`**: Si se encuentra al menos un registro que contiene \`v=DKIM1;\`, \`k=rsa;\` y la clave pública en \`p=\` es idéntica a la \`dkimPublicKey\` esperada. ✅

3.  **Análisis DMARC (Domain-based Message Authentication, Reporting, and Conformance):**
    *   **Estado \`not-found\`**: Si el array \`dmarcRecords\` está vacío.
    *   **Estado \`unverified\`**:
        *   Si el registro no empieza con \`v=DMARC1;\`.
        *   Si falta la etiqueta de política \`p=\` o no es \`p=quarantine\` o \`p=reject\`. La política \`p=none\` es válida pero no recomendada para producción.
    *   **Estado \`verified\`**: Si existe un registro que empieza con \`v=DMARC1;\` y tiene una política \`p=\` válida (\`quarantine\` o \`reject\` son ideales). ✅

**Formato de la Respuesta en el campo \`analysis\`:**

Genera un resumen claro y conciso. Para cada registro (SPF, DKIM, DMARC), indica su estado y, si está \`unverified\` o \`not-found\`, explica el problema específico y cómo solucionarlo.

**Ejemplo de Análisis:**
"
### Análisis Detallado ախ
✅ **SPF:** ¡Tu registro SPF está correctamente configurado! Permite que nuestros servidores envíen correos en tu nombre.

❌ **DKIM:** No hemos podido verificar tu firma DKIM. La clave pública en tu DNS no coincide con la que esperábamos. Asegúrate de copiar y pegar la clave correcta desde nuestras instrucciones.

⚠️ **DMARC:** Tienes un registro DMARC, pero su política es \`p=none\`. Te recomendamos cambiarla a \`p=quarantine\` o \`p=reject\` para proteger mejor tu dominio contra la suplantación de identidad.
"
`,
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
