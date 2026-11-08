// Researches one candidate from "Find new businesses": website (found if missing), live Google ad spend, opportunity.
// Promotes it to a lead (with full audit) only when it looks like a paying client; otherwise stores the findings on the candidate.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { findWebsite, auditLead } from '@/lib/crm-audit'
import { googleAdsByDomain, domainForAdvertiser } from '@/lib/google-ads'
import { opportunity } from '@/lib/opportunity'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
const HIGH = /inmobil|real estate|dental|cl[ií]nica|m[eé]dic|est[eé]tica|abogad|legal|reformas|construcci|piscina|arquitect|hotel|golf|seguros|asesor|gestor|veterin|viajes/i
const CORE = /sotogrande|san roque|guadiaro|torreguadiaro|san enrique|pueblo nuevo|l[ií]nea|algeciras|los barrios|estepona|manilva|casares|sabinillas|benahav|tarifa|castellar|jimena|gibraltar/i
const hostOf = (u: string) => { try { return new URL(u.startsWith('http') ? u : 'https://' + u).hostname.replace(/^www\./, '') } catch { return '' } }

export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { id, lead_id } = await req.json().catch(() => ({}))
  // Fix-up mode: an advertiser already promoted without a website — find it through the ad register, then audit.
  if (lead_id) {
    const { data: lead } = await sb.from('crm_leads').select('*').eq('id', String(lead_id)).single()
    if (!lead || lead.website) return NextResponse.json({ ok: true, skipped: true })
    const { data: cand } = await sb.from('crm_candidates').select('extra').eq('lead_id', lead.id).maybeSingle()
    const adv = cand?.extra?.advertiser
    const dbg: any[] = []
    const d = adv ? await domainForAdvertiser(adv, dbg) : null
    if (!d) return NextResponse.json({ ok: true, found: false, adv, dbg })
    const url = 'https://' + d
    const { error: e2 } = await sb.from('crm_leads').update({ website: url }).eq('id', lead.id)
    if (e2) return NextResponse.json({ ok: true, found: d, duplicate: true })
    await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Website found on Google's ad register (ads paid by “${adv}”): ${url}` })
    try { await auditLead(sb, { ...lead, website: url }, { psi: false }) } catch {}
    const { data: fin } = await sb.from('crm_leads').select('opp_score,opp_tier').eq('id', lead.id).single()
    return NextResponse.json({ ok: true, found: d, opp: fin })
  }
  const { data: c } = await sb.from('crm_candidates').select('*').eq('id', String(id || '')).single()
  if (!c) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (c.status !== 'new') return NextResponse.json({ ok: true, skipped: c.status })
  let website = c.website as string | null; let found = false
  if (!website && c.source === 'ads' && c.extra?.advertiser) { try { const d = await domainForAdvertiser(c.extra.advertiser); if (d) { website = 'https://' + d; found = true } } catch {} }
  if (!website && c.source !== 'borme') { try { const w = await findWebsite({ name: c.extra?.advertiser || c.name, phone: c.phone, area: c.area, address: c.address }); if (w) { website = w.url; found = true } } catch {} }
  let ads: any = null
  const h = website ? hostOf(website) : ''
  if (h) { try { const [all, d30] = await Promise.all([googleAdsByDomain(h), googleAdsByDomain(h, 30)]); if (all.ok && d30.ok) ads = { google_30d: d30.count, google_30d_more: d30.more, google_all: all.count, google_all_more: all.more, google_advertisers: all.advertisers, google_checked_at: new Date().toISOString() } } catch {} }
  // Advertisers found by name keep their ad volume even without a website match.
  if (!ads && c.source === 'ads') ads = { google_all: c.extra?.ads_max || 0, google_all_more: false }
  const where = `${c.area || ''} ${c.address || ''} ${c.name}`
  const high = HIGH.test(`${c.category || ''} ${c.name} ${c.extra?.activity || ''}`), core = CORE.test(where)
  const pre = opportunity({ name: c.name, category: c.category, area: c.area, address: c.address, website, phone: c.phone, email: c.email, contact_name: c.extra?.admin, source: c.source === 'borme' ? 'New company (BORME)' : '', capital: c.extra?.capital }, null, ads)
  const g30 = ads?.google_30d || 0, gAll = ads?.google_all || 0
  const promote = g30 >= 1 || (gAll >= 5 && (high || core)) || (high && core && !!website) || (c.source === 'borme' && high && core)
  const research = { website, website_found: found, ads, high, core, pre: pre.score, at: new Date().toISOString() }
  if (!promote) { await sb.from('crm_candidates').update({ website, extra: { ...c.extra, research }, score: pre.score }).eq('id', c.id); return NextResponse.json({ ok: true, promoted: false, pre: pre.score, website, g30 }) }
  const src = c.source === 'borme' ? 'New company (BORME)' : c.source === 'ads' ? 'Google ad register' : 'OpenStreetMap'
  const notes = c.source === 'borme' ? `New company (BORME ${c.extra?.published || ''}). Activity: ${c.extra?.activity || '—'}. Administrator: ${c.extra?.admin || '—'}. Find their phone before contacting.`
    : c.source === 'ads' ? `On Google's ad register as “${c.extra?.advertiser}” (${c.extra?.ads_min}–${c.extra?.ads_max} ads).${found ? ` Website found automatically: ${website} (verify).` : ''}` : `From OpenStreetMap (${c.extra?.kind || ''}).${found ? ` Website found automatically: ${website} (verify).` : ''}`
  const { data: lead, error } = await sb.from('crm_leads').insert({ name: c.name, category: c.category, area: c.area, address: c.address, website, phone: c.phone, email: c.email, contact_name: c.extra?.admin || null, capital: c.extra?.capital || null, source: `${src} (researched)`, source_url: c.extra?.link || c.extra?.osm || c.extra?.pdf || null, notes, ads_counts: ads, origin: 'outbound', lead_type: 'cold', relationship: 'lead', status: 'nuevo', service_fit: {}, fit_reasons: {} }).select('*').single()
  if (error && /crm_leads_website_uq/.test(error.message)) { await sb.from('crm_candidates').update({ status: 'dismissed', website, extra: { ...c.extra, research, note: 'Already a lead (same website)' } }).eq('id', c.id); return NextResponse.json({ ok: true, promoted: false, duplicate: true }) }
  if (error || !lead) return NextResponse.json({ error: error?.message || 'insert' }, { status: 500 })
  await sb.from('crm_candidates').update({ status: 'added', lead_id: lead.id, website, extra: { ...c.extra, research }, score: pre.score }).eq('id', c.id)
  try { await auditLead(sb, lead, { psi: false }) } catch {}
  const { data: fin } = await sb.from('crm_leads').select('opp_score,opp_tier').eq('id', lead.id).single()
  return NextResponse.json({ ok: true, promoted: true, lead_id: lead.id, opp: fin, website, g30 })
}
