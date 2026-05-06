import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

let browserClient: SupabaseClient | null = null

/**
 * Клиент Supabase создаётся только при непустых `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
 * Иначе `@supabase/supabase-js` бросает исключение на `createClient('', '')` — на Netlify без
 * переменных на этапе сборки это давало бы белый экран.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return browserClient
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
