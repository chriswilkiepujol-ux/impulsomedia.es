// Free lead sources beyond Google Maps. Each returns candidates; nothing becomes a lead until Chris approves it in the CRM.
//  - osm:   OpenStreetMap (Overpass) — businesses mapped in the area, with or without a website.
//  - ads:   Google Ads Transparency — advertisers whose name contains a local place name (they already spend on ads).
//  - borme: Boletín Oficial del Registro Mercantil — new companies registered with an address in our towns (no website yet).
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
export type Candidate = { source: 'osm' | 'ads' | 'borme'; source_ref: string; name: string; category?: string | null; area?: string | null; address?: string | null; website?: string | null; phone?: string | null; email?: string | null; extra?: Record<string, any>; score?: number }

// Campo de Gibraltar + western Costa del Sol (Tarifa to Estepona/Benahavís).
export const BBOX = [36.0, -5.62, 36.56, -5.0] as const
export const TOWNS = ['SAN ROQUE', 'SOTOGRANDE', 'GUADIARO', 'TORREGUADIARO', 'PUEBLO NUEVO DE GUADIARO', 'SAN ENRIQUE', 'TARAGUILLA', 'ESTACION DE SAN ROQUE', 'LA LINEA', 'LINEA DE LA CONCEPCION', 'ALGECIRAS', 'LOS BARRIOS', 'PALMONES', 'TARIFA', 'CASTELLAR', 'JIMENA', 'ESTEPONA', 'MANILVA', 'SABINILLAS', 'CASARES', 'BENAHAVIS', 'GIBRALTAR']
const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()
const townOf = (s: string) => { const p = plain(s); return TOWNS.find(t => p.includes(t)) || null }
const title = (s: string) => s.toLowerCase().replace(/(^|[\s(/-])\S/g, c => c.toUpperCase()).replace(/\b(S\.?l\.?u?|S\.?a\.?)\b\.?/gi, m => m.toUpperCase())

// ---------- OpenStreetMap ----------
const OSM_CATS: [RegExp, string][] = [
  [/dentist/, 'Clínica dental'], [/physiotherap/, 'Clínica de fisioterapia'], [/podiat|podolog/, 'Clínica de podología'], [/veterinar/, 'Veterinaria'],
  [/clinic|doctor|healthcare|optician|psycholog/, 'Clínica médica'], [/beauty|hairdresser|massage|cosmetics|nail|spa/, 'Estética'], [/fitness|sports_centre|yoga/, 'Fitness'],
  [/estate_agent/, 'Inmobiliaria'], [/lawyer|notary/, 'Abogados'], [/accountant|tax_advisor|financial|insurance/, 'Gestoría / asesoría'], [/architect|interior/, 'Reformas y construcción'],
  [/builder|carpenter|electrician|plumber|hvac|roofer|swimming_pool|pool|gardener|landscap|kitchen|bathroom/, 'Reformas y construcción'],
  [/restaurant|bar$|pub|cafe|ice_cream/, 'Restaurante'], [/hotel|guest_house|apartment|hostel/, 'Hostelería'], [/golf/, 'Golf'],
]
export async function fromOsm(): Promise<Candidate[]> {
  const [s, w, n, e] = BBOX
  const b = `(${s},${w},${n},${e})`
  const q = `[out:json][timeout:50];(
nwr["office"~"lawyer|estate_agent|accountant|tax_advisor|insurance|notary|architect|financial|company|consulting"]["name"]${b};
nwr["amenity"~"dentist|clinic|doctors|veterinary|restaurant"]["name"]${b};
nwr["healthcare"]["name"]${b};
nwr["shop"~"beauty|hairdresser|massage|optician|interior_decoration|kitchen|bathroom_furnishing|swimming_pool|cosmetics"]["name"]${b};
nwr["craft"~"builder|carpenter|electrician|plumber|hvac|roofer|gardener|swimming_pool"]["name"]${b};
nwr["tourism"~"hotel|guest_house|apartment"]["name"]${b};
nwr["leisure"~"fitness_centre|sports_centre"]["name"]${b};
);out center tags;`
  const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: new URLSearchParams({ data: q }), headers: { 'user-agent': 'ImpulsoMediaCRM/1.0 (chris@impulsomedia.es)' }, signal: AbortSignal.timeout(55000) })
  if (!r.ok) throw new Error('overpass ' + r.status)
  const j: any = await r.json()
  return (j.elements || []).map((el: any): Candidate | null => {
    const t = el.tags || {}; if (!t.name || t.brand || t['brand:wikidata']) return null
    const kind = [t.office, t.amenity, t.healthcare, t.shop, t.craft, t.tourism, t.leisure].filter(Boolean).join(' ')
    const cat = OSM_CATS.find(([re]) => re.test(kind))?.[1] || null
    const site = t.website || t['contact:website'] || t.url || null
    const addr = [t['addr:street'] && `${t['addr:street']} ${t['addr:housenumber'] || ''}`.trim(), t['addr:postcode'], t['addr:city'] || t['addr:place']].filter(Boolean).join(', ') || null
    return {
      source: 'osm', source_ref: `${el.type}/${el.id}`, name: t.name, category: cat, area: t['addr:city'] || t['addr:place'] || null, address: addr,
      website: site ? (String(site).startsWith('http') ? site : 'https://' + site) : null, phone: t.phone || t['contact:phone'] || null, email: t.email || t['contact:email'] || null,
      extra: { kind, lat: el.lat ?? el.center?.lat, lon: el.lon ?? el.center?.lon, osm: `https://www.openstreetmap.org/${el.type}/${el.id}` },
      // No website is the biggest opening; a known category is worth more than an unknown one.
      // OpenStreetMap often just lacks the website tag, so a missing site is a hint to check, not a fact.
      score: (site ? 30 : 45) + (cat && !/Restaurante|Hostelería/.test(cat) ? 25 : cat ? 5 : 0) + (t.phone || t['contact:phone'] ? 10 : 0),
    }
  }).filter(Boolean) as Candidate[]
}

// ---------- Google Ads Transparency: advertisers named after local places ----------
const AH = { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': UA, origin: 'https://adstransparency.google.com', referer: 'https://adstransparency.google.com/' }
export const AD_WORDS = ['sotogrande', 'san roque', 'guadiaro', 'la linea', 'algeciras', 'los barrios', 'tarifa', 'estepona', 'manilva', 'casares', 'benahavis', 'campo de gibraltar']
export async function fromAds(words = AD_WORDS): Promise<Candidate[]> {
  const out: Candidate[] = []
  for (const w of words) {
    try {
      const r = await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchSuggestions?authuser=0', { method: 'POST', headers: AH, body: new URLSearchParams({ 'f.req': JSON.stringify({ '1': w, '2': 30, '3': 30 }) }), signal: AbortSignal.timeout(12000) })
      if (!r.ok) continue
      const j: any = await r.json()
      for (const x of j['1'] || []) {
        const a = x['1']; if (!a?.['2'] || (a['3'] && a['3'] !== 'ES')) continue
        if (!plain(a['1']).includes(plain(w))) continue
        // People whose surname is a place ("Angel Casares Garcia") are not local businesses.
        if (!/\b(s\.?l\.?u?|s\.?a\.?u?|slp|sociedad|asoc|club|cl[ií]nica|hotel|golf|centro|grupo)\b/i.test(a['1']) && !plain(a['1']).startsWith(plain(w))) continue
        const lo = Number(a['4']?.['2']?.['1'] || 0), hi = Number(a['4']?.['2']?.['2'] || lo)
        if (!hi) continue
        out.push({ source: 'ads', source_ref: a['2'], name: title(a['1']), area: title(w), extra: { advertiser: a['1'], ads_min: lo, ads_max: hi, word: w, link: `https://adstransparency.google.com/advertiser/${a['2']}?region=ES` }, score: Math.min(100, 40 + Math.round(Math.log10(hi + 1) * 20)) })
      }
    } catch { /* one word failing shouldn't stop the rest */ }
  }
  return out
}

// ---------- BORME: new companies (Cádiz + Málaga) with an address in our towns ----------
const CNAE_CATS: [RegExp, string][] = [
  [/odont|dental/i, 'Clínica dental'], [/fisioter/i, 'Clínica de fisioterapia'], [/veterin/i, 'Veterinaria'], [/m[eé]dic|sanitari|cl[ií]nic|salud/i, 'Clínica médica'],
  [/est[eé]tic|peluquer|belleza|centro de bienestar|96\.0[24]/i, 'Estética'], [/gimnas|instalaciones deportivas|fitness|93\.13/i, 'Fitness'],
  [/inmobili|68\.3|compraventa de bienes inmuebles|alquiler de bienes inmuebles/i, 'Inmobiliaria'], [/servicios jur[ií]dicos|asesoramiento jur[ií]dico|abogac|abogad|69\.10?\b/i, 'Abogados'], [/contab|asesor[ií]a|fiscal|69\.2|seguros/i, 'Gestoría / asesoría'],
  [/construcci|reform|piscin|41\.|43\.|arquitect|instalaci[oó]n|fontaner|electricid|carpinter|jardin/i, 'Reformas y construcción'],
  [/restaur|56\.|bar(es)?\b|hostel|catering/i, 'Restaurante'], [/hotel|alojamiento|55\.|apartamentos tur/i, 'Hostelería'], [/viaje|turis|79\./i, 'Viajes'],
]
const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')
export async function fromBorme(days = 5): Promise<Candidate[]> {
  const out: Candidate[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() - i * 86400000); if ([0, 6].includes(d.getUTCDay())) continue
    let sum: any
    try { const r = await fetch(`https://www.boe.es/datosabiertos/api/borme/sumario/${ymd(d)}`, { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(15000) }); if (!r.ok) continue; sum = await r.json() } catch { continue }
    const secs = sum?.data?.sumario?.diario?.[0]?.seccion; if (!secs) continue
    const A = (Array.isArray(secs) ? secs : [secs]).find((x: any) => x.codigo === 'A'); if (!A) continue
    const items = (Array.isArray(A.item) ? A.item : [A.item]).filter((x: any) => /C[ÁA]DIZ|M[ÁA]LAGA/i.test(x.titulo))
    for (const it of items) {
      let xml = ''
      try { xml = await (await fetch(it.url_xml, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) })).text() } catch { continue }
      const re = /<p class="articulo">(\d+) - ([^<]+?)\.?<\/p>\s*<p class="parrafo">([^<]+)<\/p>/g
      let m: RegExpExecArray | null
      while ((m = re.exec(xml))) {
        const [, num, rawName, body] = m
        if (!/Constituci[oó]n\./.test(body)) continue
        const dom = body.match(/Domicilio: ([^.]+?(?:\([^)]+\))?)\./)?.[1] || ''
        const town = townOf(dom); if (!town) continue
        const obj = body.match(/Objeto social: (.+?)\. Domicilio:/)?.[1] || ''
        const cnae = obj.match(/(\d{2}\.\d{1,2})/)?.[1] || null
        const admin = body.match(/Adm\. (?:Unico|Solid\.|Mancom\.): ([^.]+)\./)?.[1] || null
        const capital = body.match(/Capital: ([\d.,]+) Euros/)?.[1] || null
        const start = body.match(/Comienzo de operaciones: ([\d.]+)/)?.[1] || null
        // Holding companies are not prospects; classify from the main activity, not the long list of secondary ones.
        const main = obj.split(/Actividad(?:es)? secundaria|Otras actividades|Actividades complementarias/i)[0]
        if (/holding|64\.2|tenencia.{0,40}participaciones|adquisici[oó]n.{0,40}participaciones/i.test(main)) continue
        const cat = CNAE_CATS.find(([re2]) => re2.test(main))?.[1] || null
        out.push({
          source: 'borme', source_ref: `${it.identificador}#${num}`, name: title(rawName.replace(/&amp;/g, '&')), category: cat, area: title(town), address: title(dom),
          extra: { activity: obj.replace(/&amp;/g, '&').slice(0, 400), cnae, admin: admin ? title(admin) : null, capital, start, published: ymd(d), pdf: it.url_pdf?.texto },
          score: 55 + (cat ? 25 : 0) + (capital && Number(capital.replace(/\./g, '').replace(',', '.')) > 10000 ? 10 : 0),
        })
      }
    }
  }
  return out
}

// ---------- store (dedupe against leads and earlier candidates) ----------
const norm = (s?: string | null) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\b(s\.?l\.?u?|s\.?a\.?|sociedad limitada)\b/g, '').replace(/[^a-z0-9]/g, '')
const hostOf = (u?: string | null) => { try { return new URL(u!.startsWith('http') ? u! : 'https://' + u).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' } }
const tel = (s?: string | null) => (s || '').replace(/\D/g, '').slice(-9)
export async function storeCandidates(sb: any, list: Candidate[]) {
  const { data: leads } = await sb.from('crm_leads').select('name,website,phone')
  const names = new Set((leads || []).map((l: any) => norm(l.name)).filter((x: string) => x.length > 3))
  const hosts = new Set((leads || []).map((l: any) => hostOf(l.website)).filter(Boolean))
  const tels = new Set((leads || []).map((l: any) => tel(l.phone)).filter((x: string) => x.length === 9))
  const fresh = list.filter(c => !names.has(norm(c.name)) && !(c.website && hosts.has(hostOf(c.website))) && !(tel(c.phone).length === 9 && tels.has(tel(c.phone))))
  // ignoreDuplicates keeps Chris's earlier "added"/"dismissed" decisions intact.
  let inserted = 0
  for (let i = 0; i < fresh.length; i += 200) {
    const { data, error } = await sb.from('crm_candidates').upsert(fresh.slice(i, i + 200).map(c => ({ ...c, extra: c.extra || {}, score: c.score || 0 })), { onConflict: 'source,source_ref', ignoreDuplicates: true }).select('id')
    if (!error) inserted += data?.length || 0
  }
  return { found: list.length, known: list.length - fresh.length, inserted }
}
