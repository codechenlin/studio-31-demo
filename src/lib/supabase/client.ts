"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Ensure the environment variables are not empty
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock or placeholder client if variables are not set
    // This prevents the app from crashing during development if keys are missing
    console.warn("Supabase URL or Anon Key is missing. Returning a mock client.");
    return {
      auth: {
        signInWithPassword: async () => ({ error: { message: "Supabase not configured." } }),
        signUp: async () => ({ error: { message: "Supabase not configured." } }),
        resetPasswordForEmail: async () => ({ error: { message: "Supabase not configured." } }),
      },
      // You can mock other Supabase methods if your app uses them
    } as any;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
