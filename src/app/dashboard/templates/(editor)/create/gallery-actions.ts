
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

  // Listar archivos en la raíz del bucket para el usuario autenticado
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
    // El filtrado por usuario se hace a través de RLS
  });

  if (error) {
    return { success: false, error: error.message };
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Filtramos para asegurarnos que solo traemos los archivos del usuario correcto si RLS fallara
  const userFiles = data.filter(file => file.owner === userId);

  return { success: true, data: { files: userFiles, supabaseUrl } };
}

export async function uploadFile(file: File, userId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        return { success: false, error: 'Debes iniciar sesión para subir un archivo.' };
    }

    const filePath = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            // La información del propietario se añade automáticamente por Supabase
        });

    if (uploadError) {
        return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return { success: true, publicUrl: data.publicUrl };
}

const renameFileSchema = z.object({
  oldPath: z.string(),
  newName: z.string().min(1),
});

export async function renameFile(oldPath: string, newName: string) {
    const validated = renameFileSchema.safeParse({ oldPath, newName });
    if (!validated.success) return { success: false, error: 'Datos inválidos.' };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No autenticado.' };
    
    const { error } = await supabase.storage.from(BUCKET_NAME).move(oldPath, newName);

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
    
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    
    if (error) { 
        console.error("Supabase delete error:", error)
        return { success: false, error: error.message };
    }
    return { success: true };
}
