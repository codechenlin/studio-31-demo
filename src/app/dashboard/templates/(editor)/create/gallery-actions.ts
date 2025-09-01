
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const BUCKET_NAME = 'template_backgrounds';

async function getAuthenticatedClient() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error(sessionError?.message || "Debes iniciar sesión para realizar esta acción.");
    }
    
    return { supabase, session };
}

export async function listFiles(userId: string) {
  try {
    const { supabase } = await getAuthenticatedClient();

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(userId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw error;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    return { success: true, data: { files: data, supabaseUrl } };
  } catch (error: any) {
    console.error("Error listing files:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadFile(userId: string, file: File) {
    try {
        const { supabase } = await getAuthenticatedClient();
        const filePath = `${userId}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        return { success: true, publicUrl: data.publicUrl };
    } catch (error: any) {
        console.error("Supabase upload error:", error);
        return { success: false, error: error.message };
    }
}

const renameFileSchema = z.object({
  oldPath: z.string().min(1),
  newPath: z.string().min(1),
});

export async function renameFile(oldPath: string, newPath: string) {
    const validated = renameFileSchema.safeParse({ oldPath, newPath });
    if (!validated.success) return { success: false, error: 'Datos inválidos.' };

    try {
        const { supabase } = await getAuthenticatedClient();
        const { error } = await supabase.storage.from(BUCKET_NAME).move(oldPath, newPath);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Supabase rename error:", error)
        return { success: false, error: error.message };
    }
}


const deleteFileSchema = z.object({
  filePath: z.string(),
});

export async function deleteFile(filePath: string) {
    const validated = deleteFileSchema.safeParse({ filePath });
    if (!validated.success) return { success: false, error: 'Datos inválidos.' };
    
    try {
        const { supabase } = await getAuthenticatedClient();
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Supabase delete error:", error)
        return { success: false, error: error.message };
    }
}
