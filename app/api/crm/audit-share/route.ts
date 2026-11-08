// CRM → "Create their report": runs the free audit on a lead's website and returns a private link to send them.
// Only the CRM owner can call it (RLS on the token). The row is flagged internal: no email to anyone, no new lead,
// and the first time the prospect opens the link Chris gets a push notification (see GET /api/free-audit).
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { crmTokenClient } from '@/lib/crm-supabase'
import { runFreeAudit, normaliseUrl, type Lang } from '@/lib/free-audit'

export const maxDuration = 60
export const dynamic = 'force-dynamic'
const json = (b: any, s = 200) => NextResponse.json(b, { status: s, headers: { 'cache-control': 'no-store' } })

export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return json({ error: 'no_auth' }, 401)
  const sb = crmTokenClient(token)
  let body: any; try { body = await req.json() } catch { return json({ error: 'bad_json' }, 400) }
  const lang: Lang = body.lang === 'en' ? 'en' : 'es'
  const { data: lead } = await sb.from('crm_leads').select('id,name,website,contact_name').eq('id', String(body.lead_id || '')).single()
  if (!lead) return json({ error: 'not_found' }, 404)
  if (!lead.website) return json({ error: 'no_website' }, 400)
  const n = normaliseUrl(lead.website); if ('error' in n) return json({ error: 'url_' + n.error }, 400)
  // Same URL audited in the last 24 h: reuse the result.
  const { data: prev } = await sb.from('free_audits').select('result').eq('url', n.url).eq('lang', lang).eq('status', 'done').not('result', 'is', null).gte('created_at', new Date(Date.now() - 86400000).toISOString()).order('created_at', { ascending: false }).limit(1)
  let result = prev?.[0]?.result || null; let error: string | null = null
  if (!result) { try { const r = await runFreeAudit(n.url, lang, {}); if (r.ok) result = r.result; else error = r.error } catch (e: any) { error = String(e?.message || e).slice(0, 120) } }
  if (!result) return json({ error: error || 'audit_failed' }, 502)
  const now = new Date().toISOString()
  const { data: row, error: dbErr } = await sb.from('free_audits').insert({
    url: n.url, host: n.host, lang, name: lead.contact_name || lead.name, email: null, role: 'owner', answers: {}, utm: { utm_source: 'crm', utm_medium: 'outreach' },
    consent: false, status: 'done', attempts: 1, started_at: now, finished_at: now, result, lead_id: lead.id, email_sent: false,
    flags: { internal: true }, key: randomBytes(9).toString('base64url'),
  }).select('id,key,lang,flags,created_at,status').single()
  if (dbErr || !row) return json({ error: 'db' }, 500)
  await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Report created to send them (${lang.toUpperCase()}): score ${result.overall ?? '—'}/100.` })
  return json({ ok: true, report: row })
}
