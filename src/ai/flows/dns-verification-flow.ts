
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
        prompt: `
        Eres un experto en DNS y seguridad de correo electrónico. Tu tarea es analizar los registros DNS para el dominio {{{domain}}} y determinar si son válidos. Debes seguir las reglas que se te proporcionan de manera estricta. Responde siempre en español y utiliza emojis para que tu análisis sea claro y amigable.

        Registros DNS a analizar (formato JSON):
        - Todos los registros TXT encontrados en el dominio raíz: {{{spfRecords}}}
        - Registros DKIM encontrados en daybuu._domainkey.{{{domain}}}: {{{dkimRecords}}}
        - Registros DMARC encontrados en _dmarc.{{{domain}}}: {{{dmarcRecords}}}
        - Clave pública DKIM esperada: {{{dkimPublicKey}}}

        ### REGLAS ESTRICTAS DE VALIDACIÓN ###

        ---
        **1. Análisis de Registro SPF**
        - **Identificación:** De la lista 'Todos los registros TXT encontrados', filtra y considera **únicamente** los registros que comiencen exactamente con la cadena \`v=spf1 \`. Los demás registros TXT (como 'google-site-verification' o 'daybuu-verificacion') DEBEN SER IGNORADOS para el análisis SPF.
        - **Análisis de Cantidad:**
          - Si después de filtrar no encuentras ningún registro SPF, el estado es \`not-found\`.
          - Si encuentras más de un registro que comience con \`v=spf1 \`, el estado es \`unverified\` y debes explicar que solo puede existir un registro SPF por dominio.
        - **Reglas de Validación (si solo hay un registro SPF):**
            1.  El registro DEBE comenzar con \`v=spf1 \`.
            2.  El registro DEBE contener la cadena \`include:_spf.daybuu.com\`.
            3.  El registro DEBE terminar con \`-all\`.
        - **Resultado Esperado:** Si las 3 reglas se cumplen, el estado es \`verified\`. Si alguna falla, el estado es \`unverified\`.
        - **Límite de Búsquedas DNS:** Si el registro SPF contiene \`include:\` de servicios como Google Workspace o Microsoft 365, DEBES mencionar la posibilidad de exceder el límite de 10 búsquedas DNS, explicando que cada 'include' consume una búsqueda y que servicios grandes pueden usar varias, poniendo en riesgo la validez del registro.

        ---
        **2. Análisis de Registro DKIM**
        - **Host/Nombre:** Verifica que el registro se encuentre en \`daybuu._domainkey.{{{domain}}}\`.
        - **Reglas de Validación del Valor:**
            1.  El valor DEBE contener la cadena \`v=DKIM1;\`.
            2.  El valor DEBE contener la cadena \`k=rsa;\`.
            3.  El valor DEBE contener \`p=\` seguido de la clave pública.
            4.  **VERIFICACIÓN CRÍTICA:** La clave pública encontrada en el DNS (después de \`p=\`) DEBE COINCIDIR EXACTAMENTE, carácter por carácter, con la \`dkimPublicKey\` esperada que te he proporcionado. ¡No puede haber ni la más mínima diferencia! 🕵️‍♂️
        - **Resultado Esperado:** Si todas las reglas se cumplen, el estado es \`verified\`. Si la clave no coincide, el estado es \`unverified\`. Si el registro no existe, es \`not-found\`.
        - **Seguridad en la Respuesta:** Si en tu análisis mencionas la clave pública, muestra solo el inicio y el final para proteger la información, por ejemplo: \`p=MIIBIjA...QAB\`.

        ---
        **3. Análisis de Registro DMARC**
        - **Host/Nombre:** Verifica que el registro se encuentre en \`_dmarc.{{{domain}}}\`.
        - **Reglas de Validación del Valor:**
            1.  El valor DEBE contener \`v=DMARC1;\`.
            2.  El valor DEBE contener \`p=reject;\`.
            3.  El valor DEBE contener \`pct=100;\`.
            4.  El valor DEBE contener \`sp=reject;\`.
            5.  El valor DEBE contener \`aspf=s;\` y \`adkim=s;\`.
            6.  El valor DEBE contener \`rua=mailto:reportes@{{{domain}}}\`.
            7.  El valor DEBE contener \`ruf=mailto:fallas@{{{domain}}}\`.
        - **Resultado Esperado:** \`verified\` si cumple todo, \`unverified\` si falta algo, \`not-found\` si no existe.

        ---
        **Formato de Respuesta en el campo \`analysis\`:**
        - Debes devolver el análisis en formato de lista.
        - Para cada registro (SPF, DKIM, DMARC), indica su estado con un emoji y luego explica el resultado.
        - Si algo falla, explica CLARAMENTE qué regla no se cumplió y cómo solucionarlo.

        **Ejemplo de Análisis:**
        "
        ### Análisis Detallado ախ
        ✅ **SPF:** ¡Tu registro SPF está correctamente configurado! Permite que nuestros servidores envíen correos en tu nombre.

        ❌ **DKIM:** ¡Atención! No hemos podido verificar tu firma DKIM. La clave pública en tu DNS (\`p=MIIBIjA...abc\`) no coincide con la que esperábamos (\`p=MIIBIjA...xyz\`). Asegúrate de copiar y pegar la clave correcta desde nuestras instrucciones.

        ⚠️ **DMARC:** Tienes un registro DMARC, pero su política de subdominios no es estricta. Te recomendamos usar \`sp=reject\` para proteger completamente tu dominio.
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

    
