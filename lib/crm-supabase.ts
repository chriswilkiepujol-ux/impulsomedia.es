import { createClient } from '@supabase/supabase-js'
// URL y clave publicable son públicas por diseño; la seguridad la dan las políticas RLS.
export const CRM_URL = process.env.CRM_SUPABASE_URL || 'https://doropcecjtladkupmqgl.supabase.co'
export const CRM_KEY = process.env.CRM_SUPABASE_KEY || 'sb_publishable_wmBcQxvb0cCMQYpNo8fi0g_CXE1GOM0'
export const crmTokenClient = (token: string) =>
  createClient(CRM_URL, CRM_KEY, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } })
export const crmAnonClient = () => createClient(CRM_URL, CRM_KEY, { auth: { persistSession: false } })
