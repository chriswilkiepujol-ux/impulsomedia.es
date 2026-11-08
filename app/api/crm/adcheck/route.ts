// CRM → "Find their ads": asks Google's Ads Transparency Center which ads point to the lead's domain (Spain).
// Domain-based, so it doesn't confuse "Sotogrande Living" the agency with every advertiser using those words.
// Unofficial endpoint (the one the public site uses): if Google changes it, this returns null and the manual link still works.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { googleAdsByDomain as googleAds } from '@/lib/google-ads'
import { opportunity } from '@/lib/opportunity'

export const maxDuration = 30
export const dynamic = 'force-dynamic'
const json = (b: any, s = 200) => NextResponse.json(b, { status: s, headers: { 'cache-control': 'no-store' } })
const hostOf = (u: string) => { try { return new URL(u.startsWith('http') ? u : 'https://' + u).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' } }

export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return json({ error: 'no_auth' }, 401)
  const sb = crmTokenClient(token)
  let body: any; try { body = await req.json() } catch { return json({ error: 'bad_json' }, 400) }
  const { data: lead } = await sb.from('crm_leads').select('*').eq('id', String(body.lead_id || '')).single()
  if (!lead) return json({ error: 'not_found' }, 404)
  const domain = hostOf(lead.website || '')
  if (!domain) return json({ error: 'no_website' }, 400)
  let all: any, d30: any
  try { [all, d30] = await Promise.all([googleAds(domain), googleAds(domain, 30)]) } catch (e: any) { all = d30 = { ok: false, raw: String(e?.message || e).slice(0, 120) } }
  if (!all.ok || !d30.ok) return json({ ok: false, domain, google: null })
  const now = new Date().toISOString()
  const counts = { ...(lead.ads_counts || {}), google_30d: d30.count, google_30d_more: d30.more, google_all: all.count, google_all_more: all.more, google_advertisers: all.advertisers, google_checked_at: now }
  // Google is checked automatically; Meta stays whatever Chris set by hand (no public API without a verified token).
  const meta = lead.ads_counts?.meta_state === 'yes'
  const g = d30.count > 0
  const live = g && meta ? 'both' : g ? 'google' : meta ? 'meta' : lead.ads_counts?.meta_state === 'no' ? 'none' : 'none'
  const { data: au } = await sb.from('crm_audits').select('*').eq('lead_id', lead.id).order('audited_at', { ascending: false }).limit(1)
  const o = opportunity(lead, au?.[0] || null, counts)
  await sb.from('crm_leads').update({ ads_counts: counts, ads_live: live, ads_checked_at: now, opp_score: o.score, opp_tier: o.tier, opp_why: o.why, opp_value: o.value, opp_at: now }).eq('id', lead.id)
  return json({ ok: true, domain, counts, ads_live: live })
}
