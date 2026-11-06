import { NextResponse } from 'next/server'
import { crmAnonClient } from '@/lib/crm-supabase'
import { auditLead } from '@/lib/crm-audit'
export const maxDuration = 60
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no auth' }, { status: 401 })
  const sb = crmAnonClient()
  const { error: e } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (e) return NextResponse.json({ error: e.message }, { status: 500 })
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString()
  const { data: leads } = await sb.from('crm_leads').select('*').not('website', 'is', null).eq('do_not_contact', false).eq('relationship', 'lead')
    .or(`last_audit_at.is.null,last_audit_at.lt.${cutoff}`).order('last_audit_at', { ascending: true, nullsFirst: true }).limit(3)
  const results: any[] = []
  for (const l of leads || []) results.push({ name: l.name, ...(await auditLead(sb, l)) })
  return NextResponse.json({ audited: results.length, results })
}
