// CRM → "Find their ads": asks Google's Ads Transparency Center which ads point to the lead's domain (Spain).
// Domain-based, so it doesn't confuse "Sotogrande Living" the agency with every advertiser using those words.
// Unofficial endpoint (the one the public site uses): if Google changes it, this returns null and the manual link still works.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'

export const maxDuration = 30
export const dynamic = 'force-dynamic'
const json = (b: any, s = 200) => NextResponse.json(b, { status: s, headers: { 'cache-control': 'no-store' } })
const hostOf = (u: string) => { try { return new URL(u.startsWith('http') ? u : 'https://' + u).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' } }

const ymd = (d: Date) => Number(d.toISOString().slice(0, 10).replace(/-/g, ''))
async function googleAds(domain: string, days?: number) {
  const range = days ? { '6': ymd(new Date(Date.now() - days * 86400000)), '7': ymd(new Date()) } : {}
  const body = new URLSearchParams({ 'f.req': JSON.stringify({ '2': 100, '3': { ...range, '8': [2724], '12': { '1': domain, '2': true } }, '7': { '1': 1 } }) })
  const r = await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0', {
    method: 'POST', body, signal: AbortSignal.timeout(15000),
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', origin: 'https://adstransparency.google.com', referer: 'https://adstransparency.google.com/' },
  })
  const text = await r.text()
  if (!r.ok) return { ok: false as const, status: r.status, raw: text.slice(0, 300) }
  let j: any = {}; try { j = JSON.parse(text) } catch { return { ok: false as const, status: r.status, raw: text.slice(0, 300) } }
  const list: any[] = Array.isArray(j['1']) ? j['1'] : []
  const advertisers = Array.from(new Set(list.map(c => c?.['12']).filter(Boolean))).slice(0, 5)
  const total = Number(j['4'] ?? j['5'] ?? 0) || list.length
  return { ok: true as const, count: list.length ? Math.max(total, list.length) : 0, advertisers, more: !!j['2'], keys: Object.keys(j), sample: list[0] ? Object.keys(list[0]) : [] }
}

export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return json({ error: 'no_auth' }, 401)
  const sb = crmTokenClient(token)
  let body: any; try { body = await req.json() } catch { return json({ error: 'bad_json' }, 400) }
  const { data: lead } = await sb.from('crm_leads').select('id,website,ads_live,ads_counts').eq('id', String(body.lead_id || '')).single()
  if (!lead) return json({ error: 'not_found' }, 404)
  const domain = hostOf(lead.website || '')
  if (!domain) return json({ error: 'no_website' }, 400)
  let g: any
  if (body.debug) { const [all, d30] = await Promise.all([googleAds(domain).catch(e => String(e)), googleAds(domain, 30).catch(e => String(e))]); return json({ all, d30 }) }
  try { g = await googleAds(domain) } catch (e: any) { g = { ok: false, raw: String(e?.message || e).slice(0, 120) } }
  if (!g.ok) return json({ ok: false, domain, google: null, debug: body.debug ? g : undefined })
  const counts = { ...(lead.ads_counts || {}), google: g.count, google_more: g.more, google_advertisers: g.advertisers, google_checked_at: new Date().toISOString() }
  // Only Google is known automatically; keep whatever Chris set for Meta.
  const meta = lead.ads_live === 'meta' || lead.ads_live === 'both'
  const live = g.count > 0 ? (meta ? 'both' : 'google') : (meta ? 'meta' : (lead.ads_live === 'none' || !lead.ads_live ? 'none' : lead.ads_live))
  await sb.from('crm_leads').update({ ads_counts: counts, ads_live: live, ads_checked_at: new Date().toISOString() }).eq('id', lead.id)
  return json({ ok: true, domain, google: g.count, more: g.more, advertisers: g.advertisers, ads_live: live, debug: body.debug ? g : undefined })
}
