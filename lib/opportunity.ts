// One number for "where should Chris spend his time": can they pay × do they need us × do we fit × can we reach them.
// Built only from things measured (audit, Google ad register, reviews, register data) so every point has a reason.
import { googleAdsByDomain } from './google-ads'

const HIGH_TICKET = /inmobil|real estate|dental|cl[ií]nica|m[eé]dic|est[eé]tica|abogad|solicitor|legal|reformas|construcci|piscina|arquitect|interior|hotel|golf|seguros|asesor|gestor|veterin|lifestyle|yacht|n[aá]utic|viajes|travel/i
const CORE = /sotogrande|san roque|guadiaro|torreguadiaro|san enrique|pueblo nuevo|la l[ií]nea|algeciras|los barrios|estepona|manilva|casares|sabinillas|benahav|tarifa|castellar|jimena|gibraltar|campo de gibraltar/i
const INTL = /inmobil|real estate|dental|cl[ií]nica|est[eé]tica|abogad|solicitor|hotel|golf|lifestyle|reformas|piscina/i

export type Opp = { score: number; tier: 'A' | 'B' | 'C'; why: string[]; budget: number; need: number; value: string }

export function opportunity(lead: any, a: any | null, ads: any | null): Opp {
  const cat = `${lead.category || ''} ${lead.name || ''}`; const why: string[] = []
  const rev = lead.google_reviews || 0, rating = Number(lead.google_rating || 0)
  const g30 = ads?.google_30d || 0, gAll = ads?.google_all || 0, meta = ads?.meta_state === 'yes'
  const high = HIGH_TICKET.test(cat), intl = INTL.test(cat)

  // ---- Can they pay? (0–45)
  let b = 0
  if (g30 >= 20) { b += 30; why.push(`💶 ${g30}${ads?.google_30d_more ? '+' : ''} Google ads in the last 30 days: real ad budget`) }
  else if (g30 >= 1) { b += 22; why.push(`💶 ${g30} Google ads in the last 30 days`) }
  else if (gAll >= 1) { b += 12; why.push(`💶 Ran ${gAll}${ads?.google_all_more ? '+' : ''} Google ads before, none in the last 30 days`) }
  else if (a?.has_google_ads_tag || a?.has_meta_pixel) { b += 6 }
  if (meta) { b += 8; why.push(`💶 Running Meta ads${ads?.meta_count ? ` (${ads.meta_count})` : ''}`) }
  if (high) { b += 8; why.push('High-ticket sector') }
  if (rev >= 200) { b += 7; why.push(`⭐ ${rev} reviews: busy business`) } else if (rev >= 60) b += 4
  if (a?.has_hreflang) b += 3
  if ((a?.page_count || 0) >= 40) b += 3
  const capital = Number(String(lead.capital || '').replace(/\./g, '').replace(',', '.')) || 0
  if (capital >= 30000) { b += 5; why.push(`Registered with €${Math.round(capital).toLocaleString('es-ES')} capital`) }
  b = Math.min(45, b)

  // ---- Do they need us? (0–35)
  let n = 0; const gaps: string[] = []
  if (!lead.website) { n += 22; gaps.push('no website found') }
  else if (a && !a.error) {
    if ((g30 || gAll || a.has_google_ads_tag) && !a.gads_conversion) { n += 12; gaps.push(g30 ? 'paying for ads with no conversion tracking' : 'ads tag without conversions') }
    if (a.load_ms >= 3000 || (a.pagespeed_mobile != null && a.pagespeed_mobile < 50)) { n += 5; gaps.push('slow') }
    if (a.has_whatsapp === false) { n += 4; gaps.push('no WhatsApp') }
    if (intl && a.has_hreflang === false && !/^en/i.test(a.html_lang || '')) { n += 6; gaps.push('no English version') }
    const jq = a.jquery_ver ? parseInt(String(a.jquery_ver), 10) : NaN
    if ((jq > 0 && jq < 2) || (a.copyright_year && a.copyright_year <= new Date().getFullYear() - 2)) { n += 5; gaps.push('outdated site') }
    if (a.has_viewport === false) { n += 6; gaps.push('not mobile-friendly') }
    if (a.has_analytics === false && !a.has_gtm) { n += 3; gaps.push('no analytics') }
  } else if (lead.website && a?.error) { n += 4 }
  if (lead.website && (lead.staleness || 0) >= 60 && !gaps.includes('outdated site')) { n += 4; gaps.push('dated design') }
  // Anyone spending on ads every month is worth an ad-account review, even with a decent site.
  if (g30 >= 1 || meta) { n += g30 >= 20 ? 12 : 8; gaps.push('ad-account review (they spend monthly)') }
  n = Math.min(35, n)
  if (gaps.length) why.push(`🔧 Needs: ${gaps.slice(0, 4).join(', ')}`)
  if (rating >= 4.6 && rev >= 40 && n >= 10) why.push(`Reputation (${rating}★/${rev}) better than the website`)

  // ---- Fit (0–12) and reach (0–8)
  let f = 0
  if (CORE.test(`${lead.area || ''} ${lead.address || ''} ${lead.name || ''}`)) f += 6
  if (high) f += 4
  if (lead.lead_type === 'warm') { f += 6; why.push('Warm contact') }
  f = Math.min(12, f)
  let r = 0
  if (lead.phone) r += 4; if (lead.email) r += 2; if (lead.contact_name) r += 2
  if (!lead.phone && !lead.email) why.push('⚠️ No phone or email yet')

  let score = b + n + f + r
  if (lead.source && /BORME/.test(lead.source)) { score = Math.max(score, high ? 58 : 40); why.unshift('🆕 Brand-new company: needs website, Google profile and launch') }
  if (lead.do_not_contact) score = 0
  score = Math.max(0, Math.min(100, score))
  const tier = score >= 68 ? 'A' : score >= 52 ? 'B' : 'C'
  // Rough value band so time goes to the bigger tickets.
  const value = g30 >= 20 ? 'Retainer €800–2,000/mo (ads + site)' : g30 >= 1 || meta ? 'Retainer €500–1,200/mo' : !lead.website ? (high ? 'Project €1,500–3,000' : 'Project €450–1,500') : high && n >= 12 ? 'Project €2,000–5,000 + SEO' : n >= 12 ? 'Project €1,000–2,500' : 'SEO €300–600/mo'
  return { score, tier, why: why.slice(0, 6), budget: b, need: n, value }
}

// Refreshes the Google ad numbers (keeping Meta as Chris set it) and stores the opportunity on the lead.
export async function refreshOpportunity(sb: any, lead: any, a: any | null, opts: { ads?: boolean } = { ads: true }) {
  let ads = lead.ads_counts || null
  const host = (() => { try { return new URL(String(lead.website).startsWith('http') ? lead.website : 'https://' + lead.website).hostname.replace(/^www\./, '') } catch { return '' } })()
  if (opts.ads !== false && host) {
    try {
      const [all, d30] = await Promise.all([googleAdsByDomain(host), googleAdsByDomain(host, 30)])
      if (all.ok && d30.ok) ads = { ...(ads || {}), google_30d: d30.count, google_30d_more: d30.more, google_all: all.count, google_all_more: all.more, google_advertisers: all.advertisers, google_checked_at: new Date().toISOString() }
    } catch { /* keep previous numbers */ }
  }
  const o = opportunity(lead, a, ads)
  const g = (ads?.google_30d || 0) > 0, m = ads?.meta_state === 'yes'
  const patch: any = { opp_score: o.score, opp_tier: o.tier, opp_why: o.why, opp_value: o.value, opp_at: new Date().toISOString() }
  if (ads) { patch.ads_counts = ads; if (ads.google_checked_at) patch.ads_live = g && m ? 'both' : g ? 'google' : m ? 'meta' : 'none' }
  await sb.from('crm_leads').update(patch).eq('id', lead.id)
  return o
}
