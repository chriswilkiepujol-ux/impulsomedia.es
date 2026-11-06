import { NextResponse } from 'next/server'
import { crmAnonClient } from '@/lib/crm-supabase'
export const maxDuration = 60
const digits = (s?: string | null) => (s || '').replace(/\D/g, '').slice(-9)
const hostOf = (u?: string | null) => { try { return new URL(u!).hostname.replace(/^www\./, '') } catch { return '' } }

// Busca negocios nuevos en Google Places (API nueva) por sector y zona y los añade como leads fríos salientes.
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no auth' }, { status: 401 })
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return NextResponse.json({ error: 'Falta GOOGLE_PLACES_API_KEY en Vercel (Places API activada en Google Cloud)' }, { status: 200 })
  const sb = crmAnonClient()
  const { error: e } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (e) return NextResponse.json({ error: e.message }, { status: 500 })
  const { data: searches } = await sb.from('crm_searches').select('*').eq('active', true).order('last_run_at', { ascending: true, nullsFirst: true }).limit(2)
  const { data: existing } = await sb.from('crm_leads').select('place_id,phone,website')
  const seenPlace = new Set((existing || []).map(l => l.place_id).filter(Boolean))
  const seenTel = new Set((existing || []).map(l => digits(l.phone)).filter(x => x.length === 9))
  const seenHost = new Set((existing || []).map(l => hostOf(l.website)).filter(Boolean))
  const out: any[] = []
  for (const s of searches || []) {
    let added = 0, found = 0
    try {
      const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.businessStatus' },
        body: JSON.stringify({ textQuery: s.query, languageCode: 'es', regionCode: 'ES', pageSize: 20 }),
      })
      const j: any = await r.json()
      if (!r.ok) { out.push({ query: s.query, error: j?.error?.message || r.status }); continue }
      for (const p of j.places || []) {
        found++
        const name = p.displayName?.text; if (!name || p.businessStatus !== 'OPERATIONAL' || (p.userRatingCount || 0) < 5) continue
        const tel = digits(p.nationalPhoneNumber); const h = hostOf(p.websiteUri)
        if (seenPlace.has(p.id) || (tel.length === 9 && seenTel.has(tel)) || (h && seenHost.has(h))) continue
        const { error } = await sb.from('crm_leads').insert({ name, category: s.category, area: s.area, website: p.websiteUri || null, phone: p.nationalPhoneNumber || null, address: p.formattedAddress || null, google_rating: p.rating || null, google_reviews: p.userRatingCount || null, source: 'Google Maps (auto)', place_id: p.id, origin: 'outbound', lead_type: 'cold', relationship: 'lead', status: 'nuevo', service_fit: {}, fit_reasons: {} })
        if (!error) { added++; seenPlace.add(p.id); if (tel.length === 9) seenTel.add(tel); if (h) seenHost.add(h) }
      }
    } catch (err: any) { out.push({ query: s.query, error: String(err?.message || err) }); continue }
    await sb.from('crm_searches').update({ last_run_at: new Date().toISOString(), last_found: found, total_added: (s.total_added || 0) + added }).eq('id', s.id)
    out.push({ query: s.query, found, added })
  }
  return NextResponse.json({ ran: out })
}
