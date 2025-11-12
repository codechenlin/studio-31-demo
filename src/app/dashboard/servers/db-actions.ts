
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { type Domain } from './types';

interface FormState {
  success: boolean;
  message: string;
  domain?: Domain | null;
}

export async function createOrGetDomainAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { 
      success: false, 
      message: 'Usuario no autenticado. Por favor, inicie sesión de nuevo.' 
    };
  };
  
  const domainName = formData.get('domain') as string;

  if (!domainName || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainName)) {
      return { 
        success: false, 
        message: "Por favor, introduce un nombre de dominio válido." 
      };
  }

  // First, try to find the domain for the current user.
  let { data: existingDomain, error: fetchError } = await supabase
    .from('domains')
    .select('*')
    .eq('user_id', user.id)
    .eq('domain_name', domainName)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine.
    console.error('Error fetching domain:', fetchError);
    return { success: false, message: 'Error al buscar el dominio: ' + fetchError.message };
  }
  
  // If the domain already exists for this user, return it.
  if (existingDomain) {
    revalidatePath('/dashboard/servers');
    return { success: true, message: 'Dominio encontrado.', domain: existingDomain };
  }

  // If it doesn't exist, create it.
  const { data: newDomain, error: insertError } = await supabase
    .from('domains')
    .insert({ domain_name: domainName, user_id: user.id })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating domain:', insertError);
    return { success: false, message: 'Error al crear el dominio: ' + insertError.message };
  }
  
  revalidatePath('/dashboard/servers');
  return { success: true, message: 'Dominio creado con éxito.', domain: newDomain };
}


export async function updateDomainVerificationCode(domainId: string, verificationCode: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('domains')
    .update({ verification_code: verificationCode, updated_at: new Date().toISOString() })
    .eq('id', domainId);

  if (error) {
    console.error('Error updating verification code:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function setDomainAsVerified(domainId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('domains')
    .update({ is_verified: true, updated_at: new Date().toISOString() })
    .eq('id', domainId);

  if (error) {
    console.error('Error setting domain as verified:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// --- DNS CHECK ACTIONS ---
// These will be fleshed out in later steps.
export async function saveDnsChecks(domainId: string, checks: any) { 
  return { success: true };
}

export async function updateDkimKey(domainId: string, dkimPublicKey: string) {
  return { success: true };
}

// --- SMTP CREDENTIALS ACTIONS ---
// These will be fleshed out in later steps.
export async function saveSmtpCredentials(domainId: string, credentials: any) {
    return { success: true };
}
