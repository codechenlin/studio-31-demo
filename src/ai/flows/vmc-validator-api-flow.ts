
'use server';
/**
 * @fileOverview A flow to validate a domain's BIMI, SVG, and VMC records using an external API.
 *
 * - validateVmcWithApi - A function that handles the domain validation process, including retry logic.
 * - VmcApiValidationInput - The input type for the validateVmcWithApi function.
 * - VmcApiValidationOutput - The return type for the validateVmcWithApi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import https from 'https';

const API_BASE = "https://8b3i4m6i39303g2k432u.fanton.cloud";
const API_KEY = process.env.VMC_VALIDATOR_API_KEY;

// Define Zod schemas based on the API documentation
const DnsRecordSchema = z.object({
  name: z.string(),
  type: z.string(),
  values: z.array(z.any()),
});

const DnsInfoSchema = z.object({
  bimi: DnsRecordSchema.optional(),
  dmarc: DnsRecordSchema.optional(),
  mx: DnsRecordSchema.optional(),
  vmc_url_from_bimi: z.string().nullable().optional(),
});

const BimiInfoSchema = z.object({
  exists: z.boolean(),
  syntax_ok: z.boolean(),
  dmarc_enforced: z.boolean(),
  raw: z.string().nullable(),
});

const SvgInfoSchema = z.object({
  exists: z.boolean(),
  compliant: z.boolean(),
  sha256: z.string().nullable(),
  message: z.string(),
});

const VmcInfoSchema = z.object({
  exists: z.boolean(),
  authentic: z.boolean(),
  chain_ok: z.boolean(),
  valid_now: z.boolean(),
  revocation_ok: z.boolean().nullable(),
  ocsp_status: z.string().nullable(),
  crl_status: z.string().nullable(),
  vmc_logo_hash_present: z.boolean(),
  logo_hash_match: z.boolean().nullable(),
  message: z.string(),
  retry_suggestion: z.object({
    retry_after_seconds: z.number(),
    max_retries: z.number(),
  }).nullable().optional(),
});

export const VmcApiValidationInputSchema = z.object({
  domain: z.string().describe('The domain to validate.'),
});
export type VmcApiValidationInput = z.infer<typeof VmcApiValidationInputSchema>;

export const VmcApiValidationOutputSchema = z.object({
  domain: z.string(),
  dns: DnsInfoSchema,
  bimi: BimiInfoSchema,
  svg: SvgInfoSchema,
  vmc: VmcInfoSchema,
  status: z.enum(['pass', 'pass_without_vmc', 'indeterminate_revocation', 'fail']),
  recommendations: z.record(z.any()).optional(),
});
export type VmcApiValidationOutput = z.infer<typeof VmcApiValidationOutputSchema>;

// Agent for HTTPS calls, useful in some environments
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});


async function callApi(domain: string): Promise<VmcApiValidationOutput> {
  if (!API_KEY) {
    throw new Error('VMC Validator API key is not configured.');
  }

  const url = `${API_BASE}/validate?domain=${encodeURIComponent(domain)}`;
  const headers = {
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json',
    'User-Agent': 'MailflowAI-Validation-Client/1.0',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      agent: API_BASE.startsWith('https') ? httpsAgent : undefined,
    });

    if (!response.ok) {
        throw new Error(`API returned an error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return VmcApiValidationOutputSchema.parse(result);
  } catch (error: any) {
     console.error('Failed to validate domain with VMC API:', error);
     throw new Error(`Failed to validate domain with VMC API: ${error.message}`);
  }
}

export async function validateVmcWithApi(input: VmcApiValidationInput): Promise<VmcApiValidationOutput> {
  return vmcValidatorFlow(input);
}


const vmcValidatorFlow = ai.defineFlow(
  {
    name: 'vmcValidatorApiFlow',
    inputSchema: VmcApiValidationInputSchema,
    outputSchema: VmcApiValidationOutputSchema,
  },
  async ({ domain }) => {
    let result = await callApi(domain);

    // Implement retry logic for indeterminate revocation status
    if (result.status === 'indeterminate_revocation' && result.vmc.retry_suggestion) {
        const { retry_after_seconds, max_retries } = result.vmc.retry_suggestion;
        
        for (let i = 0; i < max_retries; i++) {
            await new Promise(r => setTimeout(r, retry_after_seconds * 1000));
            const retryResult = await callApi(domain);

            if (retryResult.vmc.revocation_ok === true) {
                return retryResult; // Success, return the new result
            }
             // Update result to keep the latest state in case all retries fail
            result = retryResult;
            if(result.status !== 'indeterminate_revocation') {
                break; // Exit loop if status changes
            }
        }
    }
    
    // Also handle retry for VMC download timeout/network errors
    if(result.status === 'fail' && result.vmc.message.includes('No se pudo descargar el VMC') && (result.vmc.message.includes('timeout') || result.vmc.message.includes('red'))) {
        for (let i = 0; i < 2; i++) { // Retry up to 2 times for network issues
            await new Promise(r => setTimeout(r, (i + 1) * 2000)); // wait 2, then 4 seconds
            const retryResult = await callApi(domain);
             if (retryResult.status !== 'fail' || !retryResult.vmc.message.includes('No se pudo descargar el VMC')) {
                return retryResult; // If it's no longer a download error, return result
            }
            result = retryResult;
        }
    }


    return result;
  }
);
