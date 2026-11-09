// Grant watch: new public calls that could pay for clients' digital work (websites, SEO, e-commerce, digitalisation).
// Sources: BDNS (national subsidy database: state, Junta de Andalucía, Diputación, town halls) and the BOE daily summary.
const UA = 'ImpulsoMediaCRM/1.0'
const WANT = /digitaliz|transformaci[oó]n digital|kit digital|kit consulting|comercio electr[oó]nico|tienda online|presencia (en )?(internet|online|digital)|marketing digital|tic\b|tecnolog[ií]as de la informaci[oó]n|innovaci[oó]n.{0,40}(pyme|comercio|empresa)|moderniza.{0,40}comercio/i
const WHO = /pyme|empresa|comercio|comercial|aut[oó]nom|emprend|artesan|hostel|turis|negocio/i
const NOT = /entidades locales|municipios? (de|en situaci)|ayuntamientos? (para|de) la|administraci[oó]n electr|brecha digital|centros educativos|universidad|investigaci[oó]n cient|personal docente|becas?/i
const PLACE = /andaluc|c[aá]diz|m[aá]laga|san roque|algeciras|l[ií]nea de la concepci|los barrios|tarifa|estepona|manilva|casares|campo de gibraltar|estado|nacional|red\.es|ministerio/i
const dmy = (d: Date) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')
export type Grant = { source: 'bdns' | 'boe'; ref: string; title: string; url: string; published: string | null; body?: string }

export async function fromBdns(days = 3, debug?: any): Promise<Grant[]> {
  const to = new Date(), from = new Date(Date.now() - days * 864e5)
  const out: Grant[] = []
  for (const term of ['digitalización', 'digital', 'comercio electrónico', 'tecnologías de la información']) {
    const u = `https://www.infosubvenciones.es/bdnstrans/api/convocatorias/busqueda?vpd=GE&page=0&pageSize=50&order=numeroConvocatoria&direccion=desc&descripcion=${encodeURIComponent(term)}&descripcionTipoBusqueda=1&fechaDesde=${encodeURIComponent(dmy(from))}&fechaHasta=${encodeURIComponent(dmy(to))}`
    try {
      const r = await fetch(u, { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(15000) })
      const txt = await r.text(); if (debug) debug.push({ term, status: r.status, head: txt.slice(0, 600) })
      if (!r.ok) continue
      const j = JSON.parse(txt)
      for (const c of j.content || []) {
        const title = String(c.descripcion || '').trim(); const org = [c.nivel1, c.nivel2, c.nivel3].filter(Boolean).join(' · ')
        if (!WANT.test(title) || !WHO.test(title + ' ' + org) || NOT.test(title) || !PLACE.test(org + ' ' + title)) continue
        out.push({ source: 'bdns', ref: String(c.numeroConvocatoria || c.id), title, url: `https://www.infosubvenciones.es/bdnstrans/GE/es/convocatorias/${c.numeroConvocatoria || c.id}`, published: c.fechaRecepcion ? String(c.fechaRecepcion).slice(0, 10) : null, body: org })
      }
    } catch (e: any) { if (debug) debug.push({ term, error: String(e?.message || e) }) }
  }
  return out
}

function walk(x: any, acc: any[]) { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) { x.forEach(y => walk(y, acc)); return } if (x.titulo && x.identificador) acc.push(x); for (const k of Object.keys(x)) if (typeof x[k] === 'object') walk(x[k], acc) }
export async function fromBoe(days = 3, debug?: any): Promise<Grant[]> {
  const out: Grant[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() - i * 864e5); if (d.getUTCDay() === 0) continue
    try {
      const r = await fetch(`https://www.boe.es/datosabiertos/api/boe/sumario/${ymd(d)}`, { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(15000) })
      if (debug) debug.push({ day: ymd(d), status: r.status })
      if (!r.ok) continue
      const items: any[] = []; walk((await r.json())?.data?.sumario, items)
      for (const it of items) {
        const t = String(it.titulo)
        if (!WANT.test(t) || !WHO.test(t) || NOT.test(t)) continue
        out.push({ source: 'boe', ref: it.identificador, title: t, url: it.url_html || it.url_pdf?.texto || `https://www.boe.es/diario_boe/txt.php?id=${it.identificador}`, published: `${ymd(d).slice(0, 4)}-${ymd(d).slice(4, 6)}-${ymd(d).slice(6, 8)}` })
      }
    } catch (e: any) { if (debug) debug.push({ day: ymd(d), error: String(e?.message || e) }) }
  }
  return out
}

export async function storeGrants(sb: any, list: Grant[]) {
  if (!list.length) return { found: 0, inserted: 0 }
  const { data } = await sb.from('crm_grant_alerts').upsert(list.map(g => ({ ...g })), { onConflict: 'source,ref', ignoreDuplicates: true }).select('id,title')
  return { found: list.length, inserted: data?.length || 0, titles: (data || []).map((x: any) => x.title) }
}
