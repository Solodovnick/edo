/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Project URL из Supabase: Settings → API → Project URL */
  readonly VITE_SUPABASE_URL?: string
  /** Publishable / anon key из Supabase: Settings → API Keys */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
