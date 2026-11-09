import { createClient } from '@supabase/supabase-js'
// URL y clave publicable son públicas por diseño; la seguridad la dan las políticas RLS.
export const CRM_URL = process.env.CRM_SUPABASE_URL || 'https://doropcecjtladkupmqgl.supabase.co'
export const CRM_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_wmBcQxvb0cCMQYpNo8fi0g_CXE1GOM0'
export const crmTokenClient = (token: string) =>
  createClient(CRM_URL, CRM_KEY, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } })
export const crmAnonClient = () => createClient(CRM_URL, CRM_KEY, { auth: { persistSession: false } })

// Server-side bot session (for public endpoints that must write to the CRM, e.g. tracked-link clicks).
let botCache: { sb: any; until: number } | null = null
export async function crmBot() {
  if (botCache && botCache.until > Date.now()) return botCache.sb
  const sb = crmAnonClient()
  const { error } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (error) throw new Error('auth: ' + error.message)
  botCache = { sb, until: Date.now() + 45 * 60 * 1000 }
  return sb
}
