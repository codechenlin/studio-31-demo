
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const BUCKET_NAME = 'template_backgrounds';

export async function listFiles(userId: string) {
  if (!userId) {
    return { success: false, error: 'Usuario no autenticado.' };
  }
  const supabase = createClient();
  
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(userId, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    console.error("Error listing files:", error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data: { files: data, supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL! } };
}

export async function uploadFile(file: File, userId: string) {
    if (!userId) {
        return { success: false, error: "Debes iniciar sesión para subir archivos." };
    }
    const supabase = createClient();
    const filePath = `${userId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return { success: true, publicUrl: data.publicUrl };
}

const renameFileSchema = z.object({
  oldPath: z.string().min(1),
  newPath: z.string().min(1),
});

export async function renameFile(oldPath: string, newPath: string) {
    const validated = renameFileSchema.safeParse({ oldPath, newPath });
    if (!validated.success) return { success: false, error: 'Datos inválidos.' };

    const supabase = createClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).move(oldPath, newPath);

    if (error) {
        console.error("Supabase rename error:", error)
        return { success: false, error: error.message };
    }
    return { success: true };
}


const deleteFileSchema = z.object({
  filePath: z.string(),
});

export async function deleteFile(filePath: string) {
    const validated = deleteFileSchema.safeParse({ filePath });
    if (!validated.success) return { success: false, error: 'Datos inválidos.' };

    const supabase = createClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    
    if (error) { 
        console.error("Supabase delete error:", error)
        return { success: false, error: error.message };
    }
    return { success: true };
}
