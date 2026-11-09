// CRM → Competitors. Owner-only actions:
//  scan     — check which agency built each lead's site (footer credit), a batch at a time
//  clients  — read a competitor's own client logos / portfolio and store the names
//  add      — add an agency by domain (confirms it describes itself as an agency)
//  candidate— send one of their clients to "Find new businesses" for research
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { detectAgency, describeAgency, competitorClients, hostOf } from '@/lib/agency'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

async function page(url: string) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 12000)
  try { const r = await fetch(url, { signal: c.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; ImpulsoMediaAudit/1.0; +https://impulsomedia.es)' } }); return r.ok ? { html: (await r.text()).slice(0, 1_500_000), url: r.url } : null } catch { return null } finally { clearTimeout(t) }
}

export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { data: u } = await sb.auth.getUser(); if (!u?.user) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  try {
    if (body.action === 'scan') {
      const all = !!body.all
      let q = sb.from('crm_leads').select('id,website').not('website', 'is', null).order('opp_score', { ascending: false, nullsFirst: false }).limit(Math.min(Number(body.limit) || 24, 40))
      if (!all) q = q.is('agency_checked_at', null)
      const { data: leads } = await q
      let found = 0; const t0 = Date.now()
      const list = leads || []
      for (let i = 0; i < list.length && Date.now() - t0 < 240_000; i += 6) {
        await Promise.all(list.slice(i, i + 6).map(async (l: any) => {
          const p = await page(l.website)
          const ag = p ? await detectAgency(sb, p.html, p.url).catch(() => null) : null
          if (ag) found++
          await sb.from('crm_leads').update({ agency_domain: ag?.domain || null, agency_name: ag?.name || null, agency_evidence: ag?.evidence?.slice(0, 200) || null, agency_checked_at: new Date().toISOString() }).eq('id', l.id)
        }))
      }
      const { count } = await sb.from('crm_leads').select('id', { count: 'exact', head: true }).not('website', 'is', null).is('agency_checked_at', null)
      return NextResponse.json({ ok: true, checked: list.length, found, left: count || 0 })
    }
    if (body.action === 'clients') {
      const { data: c } = await sb.from('crm_competitors').select('id,domain').eq('id', String(body.id)).single()
      if (!c) return NextResponse.json({ error: 'not_found' }, { status: 404 })
      const r = await competitorClients(c.domain)
      await sb.from('crm_competitors').update({ client_names: r.names, clients_checked_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', c.id)
      return NextResponse.json({ ok: true, count: r.names.length, pages: r.pages })
    }
    if (body.action === 'add') {
      const domain = hostOf(String(body.url || '').startsWith('http') ? String(body.url) : 'https://' + String(body.url || ''))
      if (!domain) return NextResponse.json({ error: 'bad_url' }, { status: 400 })
      const d = await describeAgency(domain)
      if (!d) return NextResponse.json({ error: 'unreachable' }, { status: 502 })
      const { data, error } = await sb.from('crm_competitors').upsert({ domain, name: String(body.name || d.name).slice(0, 60), website: `https://${domain}/`, title: d.title, description: d.description, services: d.services, city: d.city, status: 'tracked', source: 'added by hand', updated_at: new Date().toISOString() }, { onConflict: 'domain' }).select('id').single()
      if (error) throw new Error(error.message)
      return NextResponse.json({ ok: true, id: data.id, isAgency: d.isAgency })
    }
    if (body.action === 'candidate') {
      const { data: c } = await sb.from('crm_competitors').select('name,domain').eq('id', String(body.id)).single()
      const name = String(body.name || '').slice(0, 120); const dom = String(body.domain || '').toLowerCase().replace(/[^a-z0-9.-]/g, '').slice(0, 100)
      if (!c || !name) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
      const { error } = await sb.from('crm_candidates').upsert({ source: 'agency', source_ref: `${c.domain}:${dom || name.toLowerCase()}`, name, area: null, website: dom ? `https://${dom}/` : null, category: body.sector ? String(body.sector).slice(0, 60) : null, extra: { agency: c.name, agency_domain: c.domain, note: `Listed as a client on ${c.domain}` }, score: 40, status: 'new' }, { onConflict: 'source,source_ref', ignoreDuplicates: true })
      if (error) throw new Error(error.message)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'bad_action' }, { status: 400 })
  } catch (e: any) { return NextResponse.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 }) }
}
