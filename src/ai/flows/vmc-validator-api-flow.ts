'use server';
/**
 * @fileOverview A flow to validate a domain's BIMI/VMC records using the external validator API.
 *
 * - validateVmcWithApi - A function that calls the external API and handles retry logic.
 * - VmcApiValidationInput - The input type for the function.
 * - VmcApiValidationOutput - The return type for the function, matching the API's JSON response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VmcApiValidationInputSchema = z.object({
  domain: z.string().describe('The domain to validate.'),
});
export type VmcApiValidationInput = z.infer<typeof VmcApiValidationInputSchema>;

// Define a comprehensive Zod schema based on the API documentation
const VmcApiValidationOutputSchema = z.object({
  domain: z.string(),
  bimi: z.object({
    exists: z.boolean(),
    syntax_ok: z.boolean(),
    dmarc_enforced: z.boolean(),
    raw: z.string().optional(),
  }),
  svg: z.object({
    exists: z.boolean(),
    compliant: z.boolean(),
    sha256: z.string().optional(),
    message: z.string(),
  }),
  vmc: z.object({
    exists: z.boolean(),
    authentic: z.boolean(),
    chain_ok: z.boolean(),
    valid_now: z.boolean(),
    revocation_ok: z.boolean().nullable(),
    ocsp_status: z.string().optional(),
    crl_status: z.string().optional(),
    vmc_logo_hash_present: z.boolean(),
    logo_hash_match: z.boolean().nullable(),
    message: z.string(),
    retry_suggestion: z.object({
        retry_after_seconds: z.number(),
        max_retries: z.number(),
    }).optional(),
  }),
  status: z.string(),
  recommendations: z.record(z.any()).optional(),
});
export type VmcApiValidationOutput = z.infer<typeof VmcApiValidationOutputSchema>;


const API_BASE = "https://8b3i4m6i39303g2k432u.fanton.cloud";

export async function validateVmcWithApi(input: VmcApiValidationInput): Promise<VmcApiValidationOutput> {
  return vmcValidatorApiFlow(input);
}


const vmcValidatorApiFlow = ai.defineFlow(
  {
    name: 'vmcValidatorApiFlow',
    inputSchema: VmcApiValidationInputSchema,
    outputSchema: VmcApiValidationOutputSchema,
  },
  async ({ domain }) => {
    const API_KEY = process.env.VMC_VALIDATOR_API_KEY;
    if (!API_KEY) {
      throw new Error('VMC Validator API key is not configured.');
    }

    const headers = { "X-API-KEY": API_KEY };
    
    try {
        const response = await fetch(`${API_BASE}/validate?domain=${encodeURIComponent(domain)}`, { headers });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        
        let jsonResponse = await response.json();

        // Handle retry logic for indeterminate revocation status
        if (jsonResponse.status === "indeterminate_revocation" && jsonResponse.vmc?.retry_suggestion) {
            const { retry_after_seconds, max_retries } = jsonResponse.vmc.retry_suggestion;
            
            for (let i = 0; i < max_retries; i++) {
                await new Promise(r => setTimeout(r, retry_after_seconds * 1000));
                
                const retryRes = await fetch(`${API_BASE}/validate?domain=${encodeURIComponent(domain)}`, { headers });
                const retryJson = await retryRes.json();

                if (retryJson.vmc?.revocation_ok === true) {
                    jsonResponse = retryJson; // Update with the successful response
                    break; // Exit retry loop
                }
            }
        }
        
        // Validate the final response against the Zod schema
        const validatedOutput = VmcApiValidationOutputSchema.parse(jsonResponse);
        return validatedOutput;

    } catch (error: any) {
        console.error("VMC Validator API Flow Error:", error);
        throw new Error(`Failed to validate domain with VMC API: ${error.message}`);
    }
  }
);
