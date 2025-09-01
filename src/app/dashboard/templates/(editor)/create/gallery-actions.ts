
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const BUCKET_NAME = 'template_backgrounds';

export async function listFiles(userId: string) {
  const supabase = createClient();
  const { data: userAuth } = await supabase.auth.getUser();

  if (!userAuth.user || userAuth.user.id !== userId) {
    return { success: false, error: 'Usuario no autenticado o no autorizado.' };
  }

  const { data, error } = await supabase.storage.from(BUCKET_NAME).list(userId, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return { success: true, data: { files: data, supabaseUrl } };
}

export async function uploadFile(file: File, userId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        return { success: false, error: 'Debes iniciar sesión para subir un archivo.' };
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (uploadError) {
        return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return { success: true, publicUrl: data.publicUrl };
}

const renameFileSchema = z.object({
  userId: z.string().uuid(),
  oldPath: z.string(),
  newName: z.string().min(1),
});

export async function renameFile(userId: string, oldPath: string, newName: string) {
    const validated = renameFileSchema.safeParse({ userId, oldPath, newName });
    if (!validated.success) return { success: false, error: 'Datos inválidos.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) return { success: false, error: 'No autenticado.' };
    
    if (!oldPath.startsWith(user.id)) {
      return { success: false, error: "Permiso denegado." };
    }

    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join('/');

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No autenticado.' };
    
    if (!filePath.startsWith(user.id)) {
      return { success: false, error: "Permiso denegado." };
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    
    if (error) { 
        console.error("Supabase delete error:", error)
        return { success: false, error: error.message };
    }
    return { success: true };
}
