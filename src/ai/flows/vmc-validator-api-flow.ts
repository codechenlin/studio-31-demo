
'use server';
/**
 * @fileOverview A flow to validate a domain's BIMI, SVG, and VMC records using an external API.
 *
 * - validateVmcWithApi - A function that handles the validation process, including retries.
 * - VmcValidatorInput - The input type for the validation flow.
 * - VmcValidatorOutput - The return type for the validation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import https from 'https';

const API_BASE = "https://8b3i4m6i39303g2k432u.fanton.cloud";
const API_KEY = process.env.VMC_VALIDATOR_API_KEY;

// --- Zod Schemas for API Response ---
const DnsRecordSchema = z.object({
  name: z.string(),
  type: z.string(),
  values: z.array(z.string()),
});

const BimiSchema = z.object({
  exists: z.boolean(),
  syntax_ok: z.boolean(),
  dmarc_enforced: z.boolean(),
  raw: z.string().nullable(),
});

const SvgSchema = z.object({
  exists: z.boolean(),
  compliant: z.boolean(),
  sha256: z.string().nullable(),
  message: z.string(),
});

const VmcRetrySuggestionSchema = z.object({
  retry_after_seconds: z.number(),
  max_retries: z.number(),
});

const VmcSchema = z.object({
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
  retry_suggestion: VmcRetrySuggestionSchema.optional().nullable(),
});

const VmcValidatorOutputSchema = z.object({
  domain: z.string(),
  dns: z.object({
    bimi: DnsRecordSchema,
    dmarc: DnsRecordSchema,
    mx: z.object({
      exchanges: z.array(z.string()),
      preferences: z.array(z.number()),
    }),
  }),
  bimi: BimiSchema,
  svg: SvgSchema,
  vmc: VmcSchema,
  status: z.enum(["pass", "pass_without_vmc", "indeterminate_revocation", "fail"]),
  recommendations: z.record(z.string()).optional(),
  vmc_url_from_bimi: z.string().nullable(),
});
export type VmcValidatorOutput = z.infer<typeof VmcValidatorOutputSchema>;


const VmcValidatorInputSchema = z.object({
  domain: z.string().describe('The domain to validate.'),
});
export type VmcValidatorInput = z.infer<typeof VmcValidatorInputSchema>;

// Agent to handle https requests, ignoring self-signed cert errors in development
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function callApi(domain: string): Promise<VmcValidatorOutput> {
    if (!API_KEY) {
        throw new Error('VMC Validator API key is not configured.');
    }
    const url = `${API_BASE}/validate?domain=${encodeURIComponent(domain)}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
                'User-Agent': 'Mailflow-AI-Validator/1.0',
                'Accept': 'application/json',
            },
            // Use the custom agent only for https URLs
            agent: API_BASE.startsWith('https') ? httpsAgent : undefined,
        });

        if (!response.ok) {
            throw new Error(`API returned an error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        return VmcValidatorOutputSchema.parse(result);

    } catch (error: any) {
        console.error('Failed to validate domain with VMC API:', error);
        throw new Error(`Failed to validate domain with VMC API: ${error.message}`);
    }
}


export async function validateVmcWithApi(input: VmcValidatorInput): Promise<VmcValidatorOutput> {
  return vmcValidatorFlow(input);
}


const vmcValidatorFlow = ai.defineFlow(
  {
    name: 'vmcValidatorFlow',
    inputSchema: VmcValidatorInputSchema,
    outputSchema: VmcValidatorOutputSchema,
  },
  async ({ domain }) => {
    let result = await callApi(domain);

    // Handle retry logic for indeterminate revocation
    if (result.status === "indeterminate_revocation" && result.vmc.retry_suggestion) {
        const { retry_after_seconds, max_retries } = result.vmc.retry_suggestion;
        
        for (let i = 0; i < max_retries; i++) {
            await new Promise(r => setTimeout(r, retry_after_seconds * 1000));
            const retryResult = await callApi(domain);
            
            if (retryResult.vmc.revocation_ok === true) {
                // If revocation check succeeds, return the new result
                return retryResult;
            }
            
            // If it's still indeterminate but it's the last retry, update the result
            if (i === max_retries - 1) {
                result = retryResult;
            }
        }
    }
    
     // Handle retry logic for network/timeout errors on VMC download
    if (result.status === "fail" && result.vmc.message.includes("No se pudo descargar el VMC")) {
        const MAX_DOWNLOAD_RETRIES = 2;
        for (let i = 0; i < MAX_DOWNLOAD_RETRIES; i++) {
             await new Promise(r => setTimeout(r, 2000 * (i + 1))); // Wait 2s, then 4s
             const retryResult = await callApi(domain);
             
             // If the retry succeeds or fails for a different reason, return it
             if (retryResult.status !== "fail" || !retryResult.vmc.message.includes("No se pudo descargar el VMC")) {
                return retryResult;
             }
             result = retryResult;
        }
    }

    return result;
  }
);
