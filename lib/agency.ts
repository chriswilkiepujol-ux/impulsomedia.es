// Which agency built / runs a business's website? Agencies credit themselves in the footer ("Diseño web: X",
// "Web by X", or just a bare link after the legal links, like Cinpy on juliaalvarezcp.com). We collect external
// footer links, drop the obvious non-agencies (social, maps, platforms, payments…), and confirm a candidate by
// checking that its own homepage describes an agency. Confirmed agencies go into crm_competitors.

const NOT_AGENCY = /(^|\.)(facebook|instagram|twitter|x|linkedin|youtube|tiktok|pinterest|whatsapp|wa\.me|google|goo\.gl|g\.page|maps|apple|microsoft|bing|wordpress|wordpress\.org|wix|wixsite|squarespace|shopify|webflow|godaddy|elementor|themeforest|envato|divi|elegantthemes|ionos|hostinger|siteground|cloudflare|cookiebot|cookieyes|complianz|iubenda|termly|onetrust|stripe|paypal|redsys|booking|tripadvisor|airbnb|trustpilot|doctoralia|top-doctors|thefork|eltenedor|glovo|ubereats|justeat|deliveroo|idealista|fotocasa|kyero|rightmove|spotify|vimeo|flickr|calendly|mailchimp|hubspot|jotform|typeform|w3|gnu|creativecommons|europa|gob|gov|boe|aepd|juntadeandalucia|andalucia|ue|eu|kitdigital|acelerapyme|red\.es|fondoseuropeos|camara|amazon|cdn|jsdelivr|unpkg|fonts|gstatic|schema|ogp|gmpg|validator|blogger|medium|github|feedburner|issuu|yelp|foursquare|guiarepsol|michelin|lafourchette|houzz|habitissimo|cronoshare|paginasamarillas|qdq|einforma|axesor|infoempresa|empresite|tripadvisor|hotels|expedia|trivago|weebly|jimdo|strikingly|duda|hostgator|bluehost|dondominio|arsys|nominalia|1and1|ovh|ovhcloud|raiolanetworks|webempresa|lucushost|digitalocean|vercel|netlify|heroku|tawk|zendesk|intercom|crisp|hotjar|clarity|clickcease|recaptcha|hcaptcha|turnstile|impulsomedia|smashballoon|famethemes|themeisle|themegrill|wpastra|generatepress|oceanwp|kadencewp|flatsome|vamtam|qodeinteractive|thimpress|themify|studiopress|elegantthemes|theme[a-z-]*|[a-z-]*themes?|[a-z-]*plugins?)\./i
const CREDIT = /(dise[ñn]|desarroll|realizad|creado|creada|hecho por|hecha por|web by|website by|site by|designed|developed|made by|built by|crafted|powered by|gestionad|mantenid|agencia|marketing|posicionamiento|\bseo\b)/i
const GENERIC_ANCHOR = /^(dise[ñn]o web|web design|website|web|aqu[ií]|here|click|link|error.*|powered by.*|designed by.*|design by.*|web by.*|made by.*|dise[ñn]ad[ao] por.*|desarrollad[ao] por.*|realizad[ao] por.*)$/i
const cleanName = (n: string) => n.replace(/^(powered by|designed by|design by|web by|website by|made by|built by|dise[ñn]ad[ao] por|desarrollad[ao] por|realizad[ao] por|dise[ñn]o web:?|by|por)\s+/i, '').trim()
const AGENCY = /(agencia|agency|marketing|dise[ñn]o web|web design|desarrollo web|web development|p[aá]ginas web|posicionamiento|\bseo\b|\bsem\b|google ads|publicidad|redes sociales|social media|branding|estudio creativo|creative studio|comunicaci[oó]n digital|digital studio|tiendas online|wordpress)/i

export const hostOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' } }
const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ntilde: 'ñ', Ntilde: 'Ñ', aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', uuml: 'ü', middot: '·', ndash: '–', mdash: '—', raquo: '»', laquo: '«' }
const decode = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&([a-z]+);/gi, (m, n) => ENT[n] ?? m)
const strip = (s: string) => decode(s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')).replace(/\s+/g, ' ').trim()

export type AgencyHit = { domain: string; name: string; evidence: string; credit: boolean; score: number }

// Footer-ish part of the page: <footer> blocks if present, else the last quarter of the HTML.
function footerOf(html: string) {
  const parts = html.match(/<footer[\s\S]*?<\/footer>/gi)
  const tail = html.slice(Math.floor(html.length * 0.75))
  return (parts?.join('\n') || '') + '\n' + tail
}

export function agencyCandidates(html: string, siteUrl: string): AgencyHit[] {
  const own = hostOf(siteUrl); const ownRoot = own.split('.').slice(-2).join('.')
  const foot = footerOf(html)
  const out = new Map<string, AgencyHit>()
  const re = /<a\b[^>]*href=["'](https?:\/\/[^"'#\s]+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let m: RegExpExecArray | null; const links: { d: string; anchor: string; idx: number; title: string }[] = []
  while ((m = re.exec(foot))) {
    const d = hostOf(m[1]); if (!d || d === own || d.endsWith('.' + ownRoot) || d === ownRoot || NOT_AGENCY.test(d + '.')) continue
    const tag = m[0].slice(0, m[0].indexOf('>') + 1)
    const title = (tag.match(/title=["']([^"']+)/i)?.[1] || '') + ' ' + (tag.match(/aria-label=["']([^"']+)/i)?.[1] || '') + ' ' + (m[2].match(/alt=["']([^"']+)/i)?.[1] || '')
    links.push({ d, anchor: strip(m[2]).slice(0, 80), idx: m.index, title: title.trim() })
  }
  links.forEach((l, i) => {
    const before = strip(foot.slice(Math.max(0, l.idx - 400), l.idx)).slice(-90)
    const credit = CREDIT.test(before.slice(-45)) || CREDIT.test(l.title) || /^(by|por)\b/i.test(l.anchor) || CREDIT.test(l.anchor)
    const brandy = l.anchor.length > 1 && l.anchor.split(' ').length <= 4
    const late = i >= links.length - 3
    const legalBefore = /(aviso legal|legal|privacidad|privacy|cookies|t[eé]rminos|terms)\s*$/i.test(before)
    const score = (credit ? 4 : 0) + (brandy ? 1 : 0) + (late ? 1 : 0) + (legalBefore ? 2 : 0) + (/copyright|©|todos los derechos/i.test(before) ? 1 : 0)
    const name = (l.anchor && l.anchor.length < 40 ? l.anchor : l.d.split('.')[0]).replace(/^(by|por)\s+/i, '')
    const prev = out.get(l.d)
    if (!prev || prev.score < score) out.set(l.d, { domain: l.d, name, evidence: `${before.slice(-60)} [${l.anchor || l.title || l.d}]`.trim(), credit, score })
  })
  // Text-only credits ("Diseño web: Agencia X") with no link are kept as name-only hints.
  return [...out.values()].filter(h => h.score >= 2).sort((a, b) => b.score - a.score).slice(0, 4)
}

async function getText(url: string, ms = 7000) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms)
  try {
    const r = await fetch(url, { signal: c.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; ImpulsoMediaAudit/1.0; +https://impulsomedia.es)', 'accept-language': 'es-ES,es;q=0.9,en;q=0.8' } })
    if (!r.ok) return null
    return (await r.text()).slice(0, 600_000)
  } catch { return null } finally { clearTimeout(t) }
}

// Is this domain an agency? Reads its homepage title + description + first headings.
export async function describeAgency(domain: string) {
  const html = await getText(`https://${domain}/`)
  if (!html) return null
  const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').slice(0, 160)
  const desc = decode(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] || html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i)?.[1] || '').slice(0, 300)
  const heads = strip((html.match(/<h[12][^>]*>[\s\S]*?<\/h[12]>/gi) || []).slice(0, 4).join(' ')).slice(0, 300)
  const text = `${title} ${desc} ${heads}`
  const isAgency = AGENCY.test(text)
  const services = [['Web design', /dise[ñn]o web|web design|p[aá]ginas web|desarrollo web|wordpress/i], ['SEO', /\bseo\b|posicionamiento/i], ['Google Ads', /google ads|\bsem\b|ppc/i], ['Social media', /redes sociales|social media|community manager|social ads/i], ['Branding', /branding|dise[ñn]o gr[aá]fico|identidad/i], ['E-commerce', /tienda online|ecommerce|e-commerce|woocommerce|shopify/i], ['AI / automation', /\bia\b|inteligencia artificial|\bai\b|automatiza/i]]
    .filter(([, r]) => (r as RegExp).test(text + ' ' + strip(html).slice(0, 8000))).map(([n]) => n as string)
  const city = (strip(html).match(/\b(Sotogrande|San Roque|Algeciras|La L[ií]nea|Los Barrios|Tarifa|Estepona|Marbella|M[aá]laga|Manilva|Casares|Gibraltar|Fuengirola|Benalm[aá]dena|C[aá]diz|Jerez|Sevilla|Madrid|Barcelona)\b/) || [])[1] || null
  const name = decode(html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)/i)?.[1] || title.split(/[|\-–·:•]/).map(x => x.trim()).filter(Boolean).pop() || domain).replace(/^[^\p{L}\p{N}]+/u, '').trim().slice(0, 60)
  return { isAgency, title, description: desc, services, city, name, html }
}

// Detect the agency for one lead site; known competitors match instantly, new ones are confirmed by a fetch.
export async function detectAgency(sb: any, html: string, siteUrl: string): Promise<{ domain: string; name: string; evidence: string } | null> {
  const cands = agencyCandidates(html, siteUrl)
  if (!cands.length) return null
  const { data: known } = await sb.from('crm_competitors').select('domain,name,status').in('domain', cands.map(c => c.domain))
  for (const c of cands) {
    const k = (known || []).find((x: any) => x.domain === c.domain)
    if (k && k.status !== 'ignored') return { domain: c.domain, name: k.name, evidence: c.evidence }
  }
  for (const c of cands.slice(0, 2)) {
    if ((known || []).some((x: any) => x.domain === c.domain)) continue // ignored
    const d = await describeAgency(c.domain)
    if (d?.isAgency) {
      await sb.from('crm_competitors').upsert({ domain: c.domain, name: (() => { const n = cleanName(c.name || ''); return n.length > 1 && n.length <= 24 && !GENERIC_ANCHOR.test(n) ? n : d.name })(), website: `https://${c.domain}/`, title: d.title, description: d.description, services: d.services, city: d.city, source: 'footer credit' }, { onConflict: 'domain', ignoreDuplicates: true })
      const { data: row } = await sb.from('crm_competitors').select('name').eq('domain', c.domain).single()
      return { domain: c.domain, name: row?.name || c.name, evidence: c.evidence }
    }
  }
  return null
}

// ---------- A competitor's own client list ----------
// Logos on their homepage / portfolio pages ("Algunos de los clientes que ya confían en…") and portfolio entries.
const JUNK = /^(logo|logotipo|icon|ico|img|image|banner|hero|bg|fondo|google|bing|facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp|chatgpt|clickcease|partner|premier|badge|resenas|reviews?|testimonios?|cropped|favicon|sello|award|kit digital|europa press|el mundo|cronica|alerta|placeholder|team|equipo|avatar|profile|foto|ecd|alertadigital|cronica global|europa press|diario.*|periodico.*|.*partner.*|.*premier.*|.*\bico\b.*|.*\bicon[oa]?\b.*|dise[nñ]o.*|.*clientes?)$/i
const tidy = (s: string) => { let t = s.replace(/\.(png|jpe?g|webp|svg|gif)$/i, '').replace(/-\d+x\d+(-\d+)?$/, '').replace(/[-_]+/g, ' ').replace(/([a-z])(logo|logotipo)(azul|blanco|negro)?(?=\s|$)/gi, '$1 ')
  for (let i = 0; i < 3; i++) t = t.replace(/^\s*(cropped|logo|logotipo)\s+/i, '').replace(/\s+(logo|logotipo|azul|blanco|negro|portfolio|agente exclusivo|agexclusivo|definitivo|home|web|color|\d+)\s*$/i, '')
  return t.replace(/\s+/g, ' ').trim() }

export type ClientRef = { name: string; domain?: string | null; sector?: string | null }
export async function competitorClients(domain: string) {
  const home = await getText(`https://${domain}/`, 10000)
  if (!home) return { names: [] as ClientRef[], pages: 0 }
  const linkRe = new RegExp(`href=["'](https?://(?:www\\.)?${domain.replace(/\./g, '\\.')}/[^"'#?]*(?:portfolio|proyectos|clientes|trabajos|casos|work|projects|clients|referencias|diseno-web)[^"'#?]*)["']`, 'gi')
  const pages = [...new Set([...home.matchAll(linkRe)].map(m => m[1]))].slice(0, 8)
  const htmls = [home, ...(await Promise.all(pages.map(p => getText(p, 9000)))).filter(Boolean) as string[]]
  const out = new Map<string, ClientRef>()
  const k = (n: string) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
  const own = domain.split('.')[0]
  const put = (r: ClientRef) => { const key = r.domain ? r.domain : k(r.name); if (key.length < 3) return; const byName = [...out.entries()].find(([, v]) => k(v.name) === k(r.name)); if (byName) { if (r.domain && !byName[1].domain) byName[1].domain = r.domain; return } if (!out.has(key)) out.set(key, r) }
  for (const h of htmls) {
    // 1) Portfolio entries: a text block that is just a domain, with the name in the block before it and
    //    usually the sector in the block after (e.g. Cinpy: "EIG Education" / "esgerencia.com" / "Educación").
    const nodes = h.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').split(/<[^>]+>/).map(x => x.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()).filter(Boolean)
    nodes.forEach((n, i) => {
      const dm = n.match(/^(?:https?:\/\/)?(?:www\.)?((?:[a-z0-9-]+\.)+[a-z]{2,6})\/?$/i)
      if (!dm) return
      const d = dm[1].toLowerCase()
      if (d.includes(own) || NOT_AGENCY.test(d + '.') || /\.(png|jpe?g|svg|webp|php|html)$/.test(d)) return
      const name = (nodes[i - 1] || '').slice(0, 60)
      if (!name || name.length < 2 || /\.(com|es|net)$/i.test(name) || (name === name.toUpperCase() && name.split(' ').length >= 3)) return
      const sector = nodes[i + 1] && nodes[i + 1].length < 40 && !/\./.test(nodes[i + 1]) ? nodes[i + 1] : null
      put({ name, domain: d, sector })
    })
    // 2) Client logos.
    for (const tag of h.match(/<img\b[^>]*>/gi) || []) {
      const src = tag.match(/(?:data-src|data-lazy-src|src)=["']([^"']+)["']/i)?.[1] || ''
      if (/^data:/.test(src) && !/data-src/.test(tag)) continue
      const file = (tag.match(/data-(?:lazy-)?src=["']([^"']+)["']/i)?.[1] || src).split('/').pop() || ''
      const alt = tag.match(/alt=["']([^"']*)["']/i)?.[1] || ''
      if (!/logo|client|portfolio|partner/i.test(file + ' ' + alt)) continue
      const n = tidy(alt && !/\.(png|jpe?g|svg|webp)$/i.test(alt) && alt.length < 50 ? alt : file)
      if (n.length < 3 || JUNK.test(n) || new RegExp(own, 'i').test(n)) continue
      put({ name: n.split(' ').map(w => w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' ') })
    }
  }
  return { names: [...out.values()].slice(0, 250), pages: htmls.length }
}
