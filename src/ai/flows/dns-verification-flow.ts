
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
        prompt: ``,
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

    
