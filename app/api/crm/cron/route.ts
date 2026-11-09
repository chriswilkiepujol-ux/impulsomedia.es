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
  const origin = new URL(req.url).origin
  const token = (await sb.auth.getSession()).data.session?.access_token
  // 1) Research the two best new candidates from "Find new businesses" (each runs in its own invocation, in parallel).
  const research: Promise<any>[] = []
  try {
    const { data: cands } = await sb.from('crm_candidates').select('id,name').eq('status', 'new').is('extra->research', null).not('category', 'in', '("Restaurante","Hostelería","Fitness")').order('score', { ascending: false }).limit(2)
    for (const c of cands || []) research.push(fetch(`${origin}/api/crm/research`, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: c.id }), signal: AbortSignal.timeout(55000) }).then(r => r.json()).then(j => ({ name: c.name, ...j })).catch(e => ({ name: c.name, error: String(e?.message || e) })))
  } catch {}
  // 2) Park leads that got the whole sequence (day-14 message) two weeks ago and never replied: back in 30 days.
  let parked = 0
  try {
    const { data: f14 } = await sb.from('crm_activities').select('lead_id,created_at').eq('meta->>step', 'f14').lt('created_at', new Date(Date.now() - 14 * 864e5).toISOString())
    const ids = Array.from(new Set((f14 || []).map((a: any) => a.lead_id)))
    if (ids.length) {
      const { data: stale } = await sb.from('crm_leads').select('id,next_action_at').in('id', ids).eq('status', 'contactado').lt('next_action_at', new Date().toISOString())
      for (const l of stale || []) {
        await sb.from('crm_leads').update({ next_action_at: new Date(Date.now() + 30 * 864e5).toISOString(), change_note: 'No reply after the full sequence: parked for 30 days' }).eq('id', l.id)
        await sb.from('crm_activities').insert({ lead_id: l.id, type: 'nota', body: 'No reply after the full sequence: parked automatically for 30 days.' }); parked++
      }
    }
  } catch {}
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString()
  const { data: leads } = await sb.from('crm_leads').select('*').eq('do_not_contact', false).eq('relationship', 'lead')
    .or(`last_audit_at.is.null,last_audit_at.lt.${cutoff}`).order('last_audit_at', { ascending: true, nullsFirst: true }).limit(2)
  const results: any[] = []
  // Audits first (bounded to ~40 s), then the morning digest so it includes anything they changed.
  const t0 = Date.now()
  for (const l of leads || []) { if (Date.now() - t0 > 30000) break; results.push({ name: l.name, ...(await auditLead(sb, l, { psi: false })) }) }
  const researched = await Promise.all(research)
  let digest: any = null
  try { digest = await runDigest(sb) } catch (e: any) { digest = { error: String(e?.message || e) } }
  return NextResponse.json({ audited: results.length, results, researched, parked, digest })
}
