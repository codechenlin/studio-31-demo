
import { z } from 'zod';

export const dnsChecksSchema = z.object({
  id: z.string().uuid(),
  domain_id: z.string().uuid(),
  spf_verified: z.boolean(),
  dkim_verified: z.boolean(),
  dmarc_verified: z.boolean(),
  mx_verified: z.boolean(),
  bimi_verified: z.boolean(),
  vmc_verified: z.boolean(),
  dkim_public_key: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DnsChecks = z.infer<typeof dnsChecksSchema>;

export const domainSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  domain_name: z.string(),
  verification_code: z.string().nullable(),
  is_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  dns_checks: dnsChecksSchema.optional().nullable(),
});

export type Domain = z.infer<typeof domainSchema>;


export interface SmtpCredentials {
    id: string;
    domain_id: string;
    host: string;
    port: number;
    encryption: string;
    username: string;
    password: string; // WARNING: Storing plain text passwords is not recommended. Use Supabase Vault.
    is_validated: boolean;
    created_at: string;
    updated_at: string;
}

    