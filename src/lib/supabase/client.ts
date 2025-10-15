
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing from .env file.");
  }

  // Se elimina la lógica de cookies para el cliente del navegador, 
  // ya que no es necesaria para operaciones públicas como la subida de archivos
  // y puede causar conflictos con FormData en Server Actions.
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
