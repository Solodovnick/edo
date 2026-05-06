import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

/** Единый клиент Supabase для работы с БД (Vite: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Тот же клиент или `null`, если переменные окружения не заданы
 * (удобно, когда приложение должно работать без Supabase).
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return supabase
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
