
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

export type StorageFile = {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: {
        eTag: string;
        size: number;
        mimetype: string;
        cacheControl: string;
        lastModified: string;
        contentLength: number;
        httpStatusCode: number;
    };
};

const BUCKET_NAME = 'template_backgrounds';

export async function listFiles() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
        return { success: false, error: 'Usuario no autenticado.', data: null };
    }

    try {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).list(user.id, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) throw error;
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

        return { success: true, data: { files: data as StorageFile[], baseUrl: supabaseUrl }, error: null };
    } catch (error: any) {
        return { success: false, error: error.message, data: null };
    }
}


const uploadFileSchema = z.object({
  file: z.any(),
});
export async function uploadFile(input: { file: File }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
        return { success: false, error: 'Usuario no autenticado.', data: null };
    }
    
    const { file } = input;
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file);

        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

        return { success: true, data: { ...data, publicUrl: publicUrlData.publicUrl }, error: null };
    } catch (error: any) {
        return { success: false, error: error.message, data: null };
    }
}


const renameFileSchema = z.object({
  oldPath: z.string(),
  newPath: z.string(),
});
export async function renameFile(input: z.infer<typeof renameFileSchema>) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Usuario no autenticado.' };
    
    const validatedInput = renameFileSchema.safeParse(input);
    if (!validatedInput.success) return { success: false, error: 'Datos de entrada inválidos.' };

    const { oldPath, newPath } = validatedInput.data;

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .move(oldPath, newPath);
        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


const deleteFilesSchema = z.object({
  paths: z.array(z.string()),
});
export async function deleteFiles(input: z.infer<typeof deleteFilesSchema>) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
     const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Usuario no autenticado.' };

    const validatedInput = deleteFilesSchema.safeParse(input);
    if (!validatedInput.success) return { success: false, error: 'Datos de entrada inválidos.' };
    
    const { paths } = validatedInput.data;

    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(paths);
        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

