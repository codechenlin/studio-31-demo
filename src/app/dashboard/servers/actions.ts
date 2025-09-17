
'use server';

import {
  verifyDnsHealth,
  type DnsHealthInput,
} from '@/ai/flows/dns-verification-flow';
import { z } from 'zod';
import dns from 'node:dns/promises';

const actionSchema = z.object({
  domain: z.string().describe('El nombre de dominio a verificar.'),
  dkimPublicKey: z.string().describe('La clave pública DKIM esperada para el selector "foxmiu".'),
});


export async function verifyDnsAction(input: DnsHealthInput) {
  try {
    const validatedInput = actionSchema.parse(input);
    const result = await verifyDnsHealth(validatedInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('DNS verification action error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

const verifyDomainOwnershipSchema = z.object({
  domain: z.string(),
  expectedValue: z.string(),
});

export async function verifyDomainOwnershipAction(input: z.infer<typeof verifyDomainOwnershipSchema>) {
  try {
    const { domain, expectedValue } = verifyDomainOwnershipSchema.parse(input);
    const records = await dns.resolveTxt(domain);
    const isVerified = records.some(record => record.includes(expectedValue));
    
    if (isVerified) {
      return { success: true };
    } else {
      return { success: false, error: 'No se pudo encontrar el registro TXT de verificación. Asegúrate de que se haya propagado correctamente.' };
    }
  } catch (error: any) {
    if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
      return { success: false, error: 'No se encontraron registros TXT para el dominio.' };
    }
    console.error('Domain ownership verification error:', error);
    return { success: false, error: 'Ocurrió un error inesperado al verificar el dominio.' };
  }
}
