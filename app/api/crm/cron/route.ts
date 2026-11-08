import { NextResponse } from 'next/server'
import { crmAnonClient } from '@/lib/crm-supabase'
import { auditLead } from '@/lib/crm-audit'
import { runDigest } from '@/lib/digest'
export const maxDuration = 60
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no auth' }, { status: 401 })
  const sb = crmAnonClient()
  const { error: e } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (e) return NextResponse.json({ error: e.message }, { status: 500 })
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString()
  const { data: leads } = await sb.from('crm_leads').select('*').eq('do_not_contact', false).eq('relationship', 'lead')
    .or(`last_audit_at.is.null,last_audit_at.lt.${cutoff}`).order('last_audit_at', { ascending: true, nullsFirst: true }).limit(3)
  const results: any[] = []
  // Audits first (bounded to ~40 s), then the morning digest so it includes anything they changed.
  const t0 = Date.now()
  for (const l of leads || []) { if (Date.now() - t0 > 40000) break; results.push({ name: l.name, ...(await auditLead(sb, l, { psi: false })) }) }
  let digest: any = null
  try { digest = await runDigest(sb) } catch (e: any) { digest = { error: String(e?.message || e) } }
  return NextResponse.json({ audited: results.length, results, digest })
}
