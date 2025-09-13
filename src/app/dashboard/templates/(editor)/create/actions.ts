

'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath as nextRevalidatePath } from 'next/cache';

export async function revalidatePath(path: string) {
  nextRevalidatePath(path);
}

const saveTemplateSchema = z.object({
  name: z.string().min(1, 'El nombre de la plantilla es requerido.'),
  content: z.any(),
  categories: z.array(z.string()).optional(),
  templateId: z.string().uuid().optional(),
});

export async function saveTemplateAction(input: z.infer<typeof saveTemplateSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuario no autenticado.' };
  }

  const validatedInput = saveTemplateSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, error: 'Datos de entrada inválidos.', details: validatedInput.error.format() };
  }
  
  const { name, content, categories, templateId } = validatedInput.data;

  try {
    let result;
    if (templateId) {
      // Actualizar plantilla existente
      const { data, error } = await supabase
        .from('templates')
        .update({ name, content, categories, updated_at: new Date().toISOString() })
        .eq('id', templateId)
        .eq('user_id', user.id)
        .select('id, updated_at')
        .single();
        
      if (error) throw error;
      result = data;

    } else {
      // Crear nueva plantilla
      const { data, error } = await supabase
        .from('templates')
        .insert({ name, content, categories, user_id: user.id })
        .select('id, updated_at')
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    // Revalidate the path to show the new/updated template in the list
    revalidatePath('/dashboard/templates');

    return { success: true, data: result };

  } catch (error: any) {
    console.error('Error al guardar la plantilla:', error);
    return { success: false, error: error.message };
  }
}
