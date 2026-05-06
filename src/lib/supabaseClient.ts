import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

/**
 * Браузерный клиент Supabase для Vite.
 * Переменные: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (локально — `.env`, на Netlify — Environment variables).
 *
 * @returns `null`, если URL или ключ не заданы (приложение без Supabase продолжает работать).
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null
  if (!browserClient) {
    browserClient = createClient(url, anonKey)
  }
  return browserClient
}

/** Проверка, заданы ли переменные для Supabase (без создания клиента). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL?.trim() && import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
  )
}
