// Free website review (short audit) for impulsomedia.es/auditoria-web-gratis.
// Measures what is observable from the public HTML of the homepage plus a handful of internal pages,
// optionally enriched with PageSpeed (PAGESPEED_API_KEY) and a Claude read of the first impression (ANTHROPIC_API_KEY).
// It is deliberately honest about its limits: it never claims to know ad spend, rankings or traffic.
import { analyse, fetchSite } from './crm-audit'

export type Lang = 'es' | 'en'
export type Finding = { ok: boolean | null; text: string }
export type Card = { key: string; title: string; score: number | null; summary: string; findings: Finding[]; action: string }
export type Result = {
  overall: number | null
  cards: Card[]
  facts: { platform: string | null; first_year: number | null; copyright_year: number | null; pages_checked: number; load_ms: number | null; https: boolean; final_url: string; title: string; word_count: number }
  psi: { score: number | null; lcp_ms: number | null; cls: number | null; tbt_ms: number | null; seo: number | null; screenshot: string | null } | null
  ai: { business: string; category: string; audience: string; clarity: number; cta: number; strengths: string[]; issues: string[]; quick_wins: string[] } | null
  tags: { ga4: boolean; gtm: boolean; google_ads: boolean; google_ads_conversion: boolean; meta: boolean; meta_events: boolean; bing: boolean; other: boolean; call_tracking: boolean }
  pages: { url: string; status: number; title: string; title_len: number; desc_len: number; h1: number; canonical: boolean; viewport: boolean; words: number; img_no_alt: number }[]
  limits: string[]
  generated_at: string
}

const YEAR = new Date().getFullYear()
const T = (lang: Lang) => (es: string, en: string) => (lang === 'es' ? es : en)
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))
const strip = (h: string) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const pick = (h: string, re: RegExp) => (h.match(re)?.[1] || '').replace(/\s+/g, ' ').trim()

export function normaliseUrl(raw: string): { url: string; host: string } | { error: string } {
  let s = (raw || '').trim()
  if (!s) return { error: 'empty' }
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s
  let u: URL
  try { u = new URL(s) } catch { return { error: 'invalid' } }
  const host = u.hostname.toLowerCase()
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) || /^(localhost|.*\.local|.*\.internal)$/.test(host) || /^\d+\.\d+\.\d+\.\d+$/.test(host) || host.endsWith('impulsomedia.es')) return { error: 'invalid' }
  u.hash = ''; u.search = ''
  return { url: u.toString(), host: host.replace(/^www\./, '') }
}

function pageFacts(url: string, html: string, status: number) {
  const a = analyse(html)
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0])
  return {
    url, status, title: a.title, title_len: a.title.length, desc_len: a.meta_description.length,
    h1: (html.match(/<h1[\s>]/gi) || []).length, canonical: a.has_canonical, viewport: a.has_viewport, words: a.word_count,
    img_no_alt: imgs.filter(i => !/\balt=/i.test(i)).length,
  }
}

function internalLinks(html: string, base: string) {
  const origin = new URL(base).origin
  const hrefs = [...html.matchAll(/<a\b[^>]+href=["']([^"'#]+)["']/gi)].map(m => m[1].trim())
  const out: string[] = []
  for (const h of hrefs) {
    try {
      const u = new URL(h, base)
      if (u.origin !== origin) continue
      if (/\.(pdf|jpe?g|png|gif|svg|webp|zip|mp4|mp3|docx?|xlsx?)$/i.test(u.pathname)) continue
      if (/mailto:|tel:|javascript:/i.test(h)) continue
      if (/wp-login|wp-admin|\/feed\/?$|\?s=|\/tag\/|\/author\/|\/page\/\d|\/cart|\/carrito|\/checkout|\/wp-json/i.test(u.pathname + u.search)) continue
      u.hash = ''; u.search = ''
      const s = u.toString().replace(/\/$/, '')
      if (s !== base.replace(/\/$/, '') && !out.includes(s)) out.push(s)
    } catch {}
  }
  // Prefer the pages a visitor would open: services, about, contact, then the rest in order.
  const score = (s: string) => /servic|about|nosotros|quien|contact|precio|pricing|tarifa|product|tratamiento|equipo|team/i.test(s) ? 0 : /blog|noticia|news|legal|privac|cookie|aviso/i.test(s) ? 2 : 1
  return out.sort((x, y) => score(x) - score(y)).slice(0, 6)
}

async function psiRun(url: string) {
  const key = process.env.PAGESPEED_API_KEY
  if (!key) return null
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 38000)
  try {
    const q = new URLSearchParams({ url, key, strategy: 'mobile' }); q.append('category', 'performance'); q.append('category', 'seo')
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: c.signal })
    if (!r.ok) return null
    const j: any = await r.json(); const lr = j.lighthouseResult; if (!lr) return null
    const au = lr.audits || {}
    return {
      score: lr.categories?.performance?.score != null ? Math.round(lr.categories.performance.score * 100) : null,
      lcp_ms: au['largest-contentful-paint']?.numericValue != null ? Math.round(au['largest-contentful-paint'].numericValue) : null,
      cls: au['cumulative-layout-shift']?.numericValue ?? null,
      tbt_ms: au['total-blocking-time']?.numericValue != null ? Math.round(au['total-blocking-time'].numericValue) : null,
      seo: lr.categories?.seo?.score != null ? Math.round(lr.categories.seo.score * 100) : null,
      screenshot: au['final-screenshot']?.details?.data || null,
    }
  } catch { return null } finally { clearTimeout(t) }
}

async function wayback(host: string) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 7000)
  try {
    const r = await fetch(`https://web.archive.org/cdx/search/cdx?output=json&filter=statuscode:200&fl=timestamp&limit=1&url=${host}`, { signal: c.signal })
    const j = r.ok ? await r.json() : null
    return Array.isArray(j) && j.length > 1 ? Number(String(j[1][0]).slice(0, 4)) : null
  } catch { return null } finally { clearTimeout(t) }
}

async function gtmTags(ids: string[]) {
  const out = { google_ads: false, conv: false, meta: false, meta_events: false, bing: false, other: false, scanned: false }
  for (const id of ids.slice(0, 2)) {
    try {
      const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000)
      const r = await fetch(`https://www.googletagmanager.com/gtm.js?id=${id}`, { signal: c.signal }); clearTimeout(t)
      if (!r.ok) continue
      const j = (await r.text()).slice(0, 1_500_000); out.scanned = true
      if (/AW-\d{6,}|__awct|googleadservices/.test(j)) out.google_ads = true
      if (/AW-\d{6,}\/[\w-]{6,}|__awct/.test(j)) out.conv = true
      if (/fbq\(|connect\.facebook\.net|__fbq/.test(j)) out.meta = true
      if (/fbq\(\s*['"]track['"]\s*,\s*['"](Lead|Contact|Purchase|Schedule|CompleteRegistration)/.test(j)) out.meta_events = true
      if (/bat\.bing\.com/.test(j)) out.bing = true
      if (/analytics\.tiktok\.com|snap\.licdn\.com|_linkedin_partner_id/.test(j)) out.other = true
    } catch {}
  }
  return out
}

// What a visitor sees first: the top of the document, before the fold-ish.
function aboveFold(html: string) {
  const body = html.split(/<body[^>]*>/i)[1] || html
  const head = body.slice(0, Math.min(body.length, Math.max(12000, Math.floor(body.length * 0.3))))
  const actionWords = /contact|contáct|llama|llámanos|call|whatsapp|reserva|book|pide|solicita|presupuesto|quote|cita|appointment|empieza|start|comprar|buy|cotiza|get |descubre|más info|more|escr[ií]be|hablamos|contratar|info|enquir|demo|ver /i
  const grab = (h: string) => [...h.matchAll(/<(a|button)\b([^>]*)>([\s\S]{0,160}?)<\/\1>/gi)]
    .map(m => ({ attrs: m[2], text: strip(m[3]) }))
    .filter(x => x.text && x.text.length < 60 && (actionWords.test(x.text) || /\b(btn|button|cta)\b/i.test(x.attrs) || /role=["']button/i.test(x.attrs)))
    .map(x => x.text)
  const tel = (h: string) => /href=["']?(tel|callto):/i.test(h) || /onclick=["'][^"']*tel:/i.test(h)
  const wa = (h: string) => /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(h)
  const form = (h: string) => /<form[\s>]/i.test(h) || /typeform\.com|hsforms\.net|jotform\.com|calendly\.com|tally\.so|docs\.google\.com\/forms|wpcf7|elementor-form|wpforms|gform_|hs-form|ninja-form/i.test(h)
  return {
    tel: tel(head), wa: wa(head), form: form(head), mail: /mailto:/i.test(head),
    telAny: tel(html), waAny: wa(html), formAny: form(html),
    ctas: [...new Set(grab(head))].slice(0, 8), ctasAny: [...new Set(grab(body))].length,
    h1: strip(pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    h2s: [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => strip(m[1])).filter(Boolean).slice(0, 8),
    nav: [...(html.match(/<nav[\s\S]*?<\/nav>/i)?.[0] || '').matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map(m => strip(m[1])).filter(s => s && s.length < 40).slice(0, 14),
    text: strip(head).slice(0, 1800),
  }
}

async function aiRead(lang: Lang, url: string, a: ReturnType<typeof analyse>, af: ReturnType<typeof aboveFold>) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  const prompt = `You review a business website's homepage the way a first-time visitor would, in ${lang === 'es' ? 'Spanish (Spain)' : 'English (UK)'}. Be concrete, fair and short. Never invent facts that are not in the data.
URL: ${url}
Title: ${a.title}
Meta description: ${a.meta_description}
H1: ${af.h1}
H2s: ${af.h2s.join(' | ')}
Navigation: ${af.nav.join(' | ')}
Call-to-action buttons/links near the top: ${af.ctas.join(' | ') || '(none detected)'}
Phone link near top: ${af.tel}; WhatsApp near top: ${af.wa}; form near top: ${af.form}
Visible text near the top (truncated): ${af.text}

Return ONLY JSON with these keys:
business: one sentence saying what this business appears to do (or "unclear" if you cannot tell from the text)
category: a 2–4 word business category in ${lang === 'es' ? 'Spanish' : 'English'} (e.g. "clínica dental", "inmobiliaria", "restaurante")
audience: one short phrase: who it seems to be for
clarity: 0–10, how clearly a stranger understands what is offered and for whom within seconds
cta: 0–10, how clear and easy the next step is (call, WhatsApp, book, quote)
strengths: array of up to 3 short sentences
issues: array of up to 4 short sentences, each a specific problem a visitor would feel
quick_wins: array of up to 3 short, specific, cheap changes (wording, button, placement). No generic advice.`
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 25000)
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: c.signal,
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.FREE_AUDIT_MODEL || 'claude-haiku-5-5', max_tokens: 900, messages: [{ role: 'user', content: prompt }] }),
    })
    if (!r.ok) return null
    const j: any = await r.json(); const txt: string = j.content?.map((x: any) => x.text || '').join('') || ''
    const m = txt.match(/\{[\s\S]*\}/); if (!m) return null
    const o = JSON.parse(m[0])
    const arr = (x: any) => (Array.isArray(x) ? x.map(String).slice(0, 4) : [])
    return { business: String(o.business || ''), category: String(o.category || ''), audience: String(o.audience || ''), clarity: Math.max(0, Math.min(10, Number(o.clarity) || 0)), cta: Math.max(0, Math.min(10, Number(o.cta) || 0)), strengths: arr(o.strengths), issues: arr(o.issues), quick_wins: arr(o.quick_wins) }
  } catch { return null } finally { clearTimeout(t) }
}

export async function runFreeAudit(rawUrl: string, lang: Lang, answers: Record<string, any> = {}): Promise<{ ok: true; result: Result } | { ok: false; error: string; result?: Result }> {
  const t = T(lang)
  const n = normaliseUrl(rawUrl); if ('error' in n) return { ok: false, error: n.error }
  const limits: string[] = []
  // Everything that only needs the URL starts at once; the HTML-dependent steps start when the homepage arrives.
  const psiP = psiRun(n.url); const wbP = wayback(n.host)
  let f = await fetchSite(n.url)
  if (!f.ok && /^https:/.test(n.url)) { const alt = await fetchSite(n.url.replace(/^https:/, 'http:')); if (alt.ok) f = alt }
  if (!f.ok || !f.html) {
    await Promise.allSettled([psiP, wbP])
    return { ok: false, error: f.status === 0 ? 'unreachable' : f.status === 403 || f.status === 429 ? 'blocked' : `http_${f.status}` }
  }
  // Old sites sometimes serve a frameset or a meta-refresh shell: follow it once so we read the real page.
  const hop = f.html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+url=([^"'>\s]+)/i)?.[1] || f.html.match(/<(?:frame|iframe)\b[^>]+src=["']([^"']+)["']/i)?.[1]
  if (hop && f.bytes < 4000) { try { const h2 = await fetchSite(new URL(hop, f.finalUrl).toString()); if (h2.ok && h2.bytes > f.bytes) f = h2 } catch {} }
  const a = analyse(f.html); const af = aboveFold(f.html)
  const unreadable = a.word_count < 40
  const links = internalLinks(f.html, f.finalUrl)
  const [pagesS, gtm, ai, psi, wbFirst] = await Promise.all([
    Promise.all(links.map(async u => { const r = await fetchSite(u); return r.html ? pageFacts(u, r.html, r.status) : { url: u, status: r.status, title: '', title_len: 0, desc_len: 0, h1: 0, canonical: false, viewport: false, words: 0, img_no_alt: 0 } })),
    gtmTags(a.gtm_ids), aiRead(lang, f.finalUrl, a, af), psiP, wbP,
  ])
  const home = pageFacts(f.finalUrl, f.html, f.status)
  const pages = [home, ...pagesS]
  const okPages = pages.filter(p => p.status > 0 && p.status < 400)
  const https = /^https:/i.test(f.finalUrl)
  const tags = {
    ga4: a.has_analytics, gtm: a.has_gtm, google_ads: a.has_google_ads_tag || gtm.google_ads, google_ads_conversion: a.gads_conversion || gtm.conv,
    meta: a.has_meta_pixel || gtm.meta, meta_events: a.meta_events || gtm.meta_events, bing: gtm.bing, other: a.has_other_pixel || gtm.other, call_tracking: a.call_tracking,
  }
  if (!psi) limits.push(t('La medición de velocidad con Lighthouse no estaba disponible; usamos el tiempo de respuesta del servidor.', 'Lighthouse speed measurement was not available; we used the server response time instead.'))
  if (!ai) limits.push(t('La lectura de la primera impresión se hizo con reglas, no con revisión asistida.', 'The first-impression read used rules only, not the assisted review.'))
  if (unreadable) limits.push(t('La portada apenas tiene texto en el HTML (se construye con JavaScript o con marcos), así que no hemos podido valorar la primera impresión ni los botones de contacto.', 'The homepage has almost no text in its HTML (it is built with JavaScript or frames), so we could not judge the first impression or the contact buttons.'))
  if (a.gtm_ids.length && !gtm.scanned) limits.push(t('No se pudo leer el contenedor de Tag Manager, así que puede haber etiquetas que no vemos.', 'The Tag Manager container could not be read, so there may be tags we cannot see.'))

  const cards: Card[] = []
  // 1. First impression
  {
    const fnd: Finding[] = []
    const clarity = ai ? ai.clarity : (af.h1 && af.h1.length > 8 ? 6 : 3) + (a.meta_description ? 1 : 0) + (a.word_count > 150 ? 1 : 0)
    if (ai) {
      fnd.push({ ok: null, text: t('Lo que entiende un visitante: ', 'What a visitor understands: ') + ai.business })
      ai.strengths.forEach(s => fnd.push({ ok: true, text: s })); ai.issues.forEach(s => fnd.push({ ok: false, text: s }))
    } else {
      fnd.push({ ok: !!af.h1, text: af.h1 ? t(`Titular principal: “${af.h1.slice(0, 90)}”`, `Main headline: “${af.h1.slice(0, 90)}”`) : t('La página no tiene un titular principal (H1) que diga qué ofreces.', 'The page has no main headline (H1) saying what you offer.') })
      fnd.push({ ok: a.title.length > 10, text: a.title ? t(`Título de la pestaña: “${a.title.slice(0, 80)}”`, `Tab title: “${a.title.slice(0, 80)}”`) : t('Falta el título de la página.', 'The page title is missing.') })
      fnd.push({ ok: a.word_count >= 150, text: a.word_count >= 150 ? t(`La portada tiene ${a.word_count} palabras de texto.`, `The homepage has ${a.word_count} words of text.`) : t(`La portada tiene muy poco texto (${a.word_count} palabras): cuesta saber qué ofreces y Google tiene poco que leer.`, `The homepage has very little text (${a.word_count} words): it is hard to tell what you offer and Google has little to read.`) })
    }
    const score = unreadable ? null : clamp(clarity * 10)
    if (unreadable) fnd.splice(0, fnd.length, { ok: null, text: t('No hemos podido leer el contenido de la portada: el HTML casi no tiene texto. Suele pasar con webs hechas solo con JavaScript o con marcos antiguos, y también le pasa a Google.', 'We could not read the homepage content: the HTML has almost no text. This happens with sites built only with JavaScript or old frames, and it happens to Google too.') })
    cards.push({ key: 'impression', title: t('Primera impresión', 'First impression'), score, findings: fnd,
      summary: score == null ? t('Sin valorar: no se pudo leer la portada.', 'Not rated: the homepage could not be read.') : score >= 75 ? t('Se entiende rápido qué haces y para quién.', 'It is quickly clear what you do and for whom.') : score >= 50 ? t('Se entiende, pero cuesta más de lo que debería.', 'It can be understood, but it takes more effort than it should.') : t('Un visitante nuevo no tiene claro qué ofreces ni por qué elegirte.', 'A new visitor is not clear on what you offer or why to choose you.'),
      action: ai?.quick_wins[0] || (af.h1 ? t('Debajo del titular, añade una frase con para quién es y en qué zona, y pon el botón de contacto al lado.', 'Under the headline, add one line saying who it is for and where, and put the contact button next to it.') : t('Pon en la parte alta un titular que diga qué haces, dónde y para quién, y un botón para contactar.', 'Put a headline at the top saying what you do, where and for whom, plus a contact button.')) })
  }
  // 2. Calls to action
  {
    const fnd: Finding[] = []
    const hasTel = a.has_tel_link || af.telAny, hasWa = a.has_whatsapp || af.waAny, hasForm = a.has_contact_form || af.formAny
    const channels = [hasTel, hasWa, hasForm, a.emails.length > 0].filter(Boolean).length
    const top = [af.tel, af.wa, af.form, af.mail].filter(Boolean).length + (af.ctas.length ? 1 : 0)
    fnd.push({ ok: hasTel, text: hasTel ? t('El teléfono se puede tocar para llamar desde el móvil.', 'The phone number is tappable to call from a phone.') : t('El teléfono no es un enlace: en el móvil hay que copiarlo a mano.', 'The phone number is not a link: on a phone it has to be copied by hand.') })
    fnd.push({ ok: hasWa, text: hasWa ? t('Hay botón de WhatsApp.', 'There is a WhatsApp button.') : t('No hay WhatsApp. En tu zona es el canal que más usan los clientes para preguntar.', 'No WhatsApp. In your area it is the channel customers use most to ask questions.') })
    fnd.push({ ok: hasForm, text: hasForm ? t('Hay un formulario de contacto.', 'There is a contact form.') : t('No hay formulario de contacto.', 'There is no contact form.') })
    fnd.push({ ok: top >= 1, text: top >= 1 ? t(`Hay llamadas a la acción visibles al entrar (${af.ctas.slice(0, 3).map(c => `“${c}”`).join(', ') || t('teléfono/WhatsApp', 'phone/WhatsApp')}).`, `There are visible calls to action on arrival (${af.ctas.slice(0, 3).map(c => `“${c}”`).join(', ') || 'phone/WhatsApp'}).`) : t('Al entrar no se ve ningún botón claro de “contactar”, “llamar” o “reservar”: el visitante tiene que buscarlo.', 'On arrival there is no clear “contact”, “call” or “book” button: the visitor has to look for it.') })
    const score = unreadable && channels === 0 ? null : clamp(channels * 15 + Math.min(top, 3) * 12 + (ai ? ai.cta * 2 : 8))
    if (score == null) fnd.splice(0, fnd.length, { ok: null, text: t('No hemos encontrado teléfono, WhatsApp ni formulario en el HTML, pero la portada no se pudo leer bien, así que no lo puntuamos.', 'We found no phone, WhatsApp or form in the HTML, but the homepage could not be read properly, so we do not score it.') })
    cards.push({ key: 'cta', title: t('Llamadas a la acción', 'Calls to action'), score, findings: fnd,
      summary: score == null ? t('Sin valorar: no se pudo leer la portada.', 'Not rated: the homepage could not be read.') : score >= 75 ? t('Contactar es fácil desde cualquier dispositivo.', 'Getting in touch is easy from any device.') : score >= 50 ? t('Se puede contactar, pero no es inmediato.', 'Contact is possible, but not immediate.') : t('A un cliente interesado le cuesta dar el siguiente paso.', 'An interested customer struggles to take the next step.'),
      action: ai?.quick_wins[1] || (!hasWa ? t('Añade un botón de WhatsApp fijo y un teléfono tocable en la cabecera.', 'Add a sticky WhatsApp button and a tappable phone number in the header.') : t('Pon una sola acción principal arriba (llamar, WhatsApp o reservar) y repítela al final de cada sección.', 'Put one main action at the top (call, WhatsApp or book) and repeat it at the end of each section.')) })
  }
  // 3. Speed
  {
    const fnd: Finding[] = []
    let score: number | null
    if (psi && psi.score != null) {
      score = psi.score
      fnd.push({ ok: psi.score >= 70, text: t(`Puntuación de rendimiento móvil (Lighthouse): ${psi.score}/100.`, `Mobile performance score (Lighthouse): ${psi.score}/100.`) })
      if (psi.lcp_ms != null) fnd.push({ ok: psi.lcp_ms <= 2500, text: t(`El contenido principal tarda ${(psi.lcp_ms / 1000).toFixed(1)} s en aparecer en móvil (Google recomienda menos de 2,5 s).`, `The main content takes ${(psi.lcp_ms / 1000).toFixed(1)} s to appear on mobile (Google recommends under 2.5 s).`) })
      if (psi.cls != null) fnd.push({ ok: psi.cls <= 0.1, text: psi.cls <= 0.1 ? t('La página no “salta” mientras carga.', 'The page does not jump around while loading.') : t('La página se mueve mientras carga (los elementos saltan), lo que provoca clics erróneos.', 'The page shifts while loading (elements jump), which causes wrong taps.') })
      if (psi.tbt_ms != null) fnd.push({ ok: psi.tbt_ms <= 300, text: psi.tbt_ms <= 300 ? t('La página responde rápido al toque.', 'The page responds quickly to taps.') : t(`La página se queda “congelada” ${Math.round(psi.tbt_ms)} ms por scripts pesados.`, `The page freezes for ${Math.round(psi.tbt_ms)} ms because of heavy scripts.`) })
    } else {
      score = Math.min(85, clamp(100 - Math.max(0, f.ms - 800) / 60 - Math.max(0, f.bytes - 400_000) / 25_000))
      fnd.push({ ok: f.ms <= 1500, text: t(`El servidor entregó la portada en ${(f.ms / 1000).toFixed(1)} s.`, `The server delivered the homepage in ${(f.ms / 1000).toFixed(1)} s.`) })
      fnd.push({ ok: f.bytes <= 400_000 ? (f.bytes > 2000 ? true : null) : false, text: t(`El HTML de la portada pesa ${Math.max(1, Math.round(f.bytes / 1024))} KB.`, `The homepage HTML weighs ${Math.max(1, Math.round(f.bytes / 1024))} KB.`) })
      fnd.push({ ok: null, text: t('Medida orientativa: la auditoría completa mide la carga real en móvil con Lighthouse.', 'Indicative measure: the full audit measures real mobile load with Lighthouse.') })
    }
    fnd.push({ ok: https, text: https ? t('La web usa HTTPS.', 'The site uses HTTPS.') : t('La web no carga por HTTPS: el navegador la marca como “no segura”.', 'The site does not load over HTTPS: browsers mark it “not secure”.') })
    cards.push({ key: 'speed', title: t('Velocidad', 'Speed'), score, findings: fnd,
      summary: score >= 75 ? t('Carga bien.', 'Loads well.') : score >= 50 ? t('Carga, pero más lento de lo que Google y tus visitantes toleran.', 'It loads, but slower than Google and your visitors tolerate.') : t('La lentitud te está costando visitas y posiciones.', 'Slowness is costing you visits and rankings.'),
      action: score >= 75 ? t('Mantén las imágenes optimizadas y revisa la velocidad tras cada cambio.', 'Keep images optimised and re-check speed after each change.') : t('Comprime las imágenes, quita plugins y scripts que no usas y activa caché. Suele ser la mejora más barata.', 'Compress images, remove unused plugins and scripts and enable caching. Usually the cheapest improvement.') })
  }
  // 4. Technical SEO across pages
  {
    const fnd: Finding[] = []
    const noTitle = okPages.filter(p => !p.title).length, longTitle = okPages.filter(p => p.title_len > 60).length
    const noDesc = okPages.filter(p => !p.desc_len).length, noH1 = okPages.filter(p => p.h1 === 0).length, multiH1 = okPages.filter(p => p.h1 > 1).length
    const noCanon = okPages.filter(p => !p.canonical).length, noView = okPages.filter(p => !p.viewport).length
    const dupT = okPages.length - new Set(okPages.map(p => p.title)).size
    const broken = pages.filter(p => p.status === 0 || p.status >= 400).length
    const thin = okPages.filter(p => p.words < 120).length
    const alt = okPages.reduce((s, p) => s + p.img_no_alt, 0)
    const N = okPages.length
    fnd.push({ ok: null, text: t(`Hemos revisado ${N} página${N === 1 ? '' : 's'} (portada y enlaces principales).`, `We checked ${N} page${N === 1 ? '' : 's'} (homepage and main links).`) })
    fnd.push({ ok: noTitle === 0 && dupT === 0, text: noTitle ? t(`${noTitle} página(s) sin título.`, `${noTitle} page(s) without a title.`) : dupT ? t(`${dupT} página(s) repiten el mismo título: Google no sabe cuál mostrar.`, `${dupT} page(s) share the same title: Google cannot tell which to show.`) : t('Cada página tiene su propio título.', 'Each page has its own title.') })
    if (longTitle) fnd.push({ ok: false, text: t(`${longTitle} título(s) superan los 60 caracteres y se cortan en Google.`, `${longTitle} title(s) exceed 60 characters and get cut off in Google.`) })
    fnd.push({ ok: noDesc === 0, text: noDesc ? t(`${noDesc} de ${N} páginas no tienen meta descripción (el texto bajo el enlace en Google).`, `${noDesc} of ${N} pages have no meta description (the text under the link in Google).`) : t('Todas las páginas revisadas tienen meta descripción.', 'All checked pages have a meta description.') })
    fnd.push({ ok: noH1 === 0 && multiH1 === 0, text: noH1 ? t(`${noH1} página(s) sin encabezado principal (H1).`, `${noH1} page(s) without a main heading (H1).`) : multiH1 ? t(`${multiH1} página(s) con varios H1.`, `${multiH1} page(s) with several H1s.`) : t('Encabezados principales correctos.', 'Main headings are correct.') })
    fnd.push({ ok: noView === 0, text: noView ? t('Hay páginas sin configuración móvil (viewport): se ven en miniatura en el teléfono.', 'Some pages have no mobile configuration (viewport): they show tiny on a phone.') : t('Las páginas están preparadas para móvil.', 'Pages are set up for mobile.') })
    fnd.push({ ok: noCanon === 0, text: noCanon ? t(`${noCanon} página(s) sin etiqueta canonical (riesgo de contenido duplicado).`, `${noCanon} page(s) without a canonical tag (duplicate-content risk).`) : t('Etiquetas canonical presentes.', 'Canonical tags present.') })
    fnd.push({ ok: a.has_schema, text: a.has_schema ? t('Hay datos estructurados (schema), que ayudan a Google a mostrar más información.', 'Structured data (schema) is present, which helps Google show richer results.') : t('No hay datos estructurados (schema): Google no recibe horario, teléfono o tipo de negocio de forma clara.', 'No structured data (schema): Google is not told your hours, phone or business type clearly.') })
    if (broken) fnd.push({ ok: false, text: t(`${broken} enlace(s) del menú no cargan o dan error.`, `${broken} menu link(s) fail to load or return an error.`) })
    if (thin) fnd.push({ ok: false, text: t(`${thin} página(s) con muy poco texto (menos de 120 palabras).`, `${thin} page(s) with very little text (under 120 words).`) })
    if (alt > 5) fnd.push({ ok: false, text: t(`${alt} imágenes sin texto alternativo (accesibilidad y SEO de imágenes).`, `${alt} images without alt text (accessibility and image SEO).`) })
    const multi = /href=["'][^"']*\/(en|es|de|fr|it|ru|nl|sv)(?:\/|["'?#])/i.test(f.html) || /[?&]lang=(en|es|de|fr)\b/i.test(f.html) || /\b(english|español|deutsch|français)\b/i.test(af.nav.join(' '))
    fnd.push({ ok: a.has_hreflang || !multi, text: a.has_hreflang ? t('Idiomas bien señalizados para Google (hreflang).', 'Languages are flagged correctly for Google (hreflang).') : multi ? t('La web tiene varios idiomas pero no lo indica a Google (hreflang).', 'The site has several languages but does not tell Google (hreflang).') : t('Un solo idioma: no hace falta hreflang.', 'Single language: hreflang not needed.') })
    const pr = (n: number) => (N ? n / N : 0)
    let score = 100 - pr(noTitle) * 30 - pr(dupT) * 20 - pr(longTitle) * 6 - pr(noDesc) * 20 - pr(noH1) * 18 - pr(multiH1) * 6 - pr(noView) * 30 - pr(noCanon) * 8 - (a.has_schema ? 0 : 10) - Math.min(20, broken * 7) - pr(thin) * 10 - (alt > 5 ? 5 : 0)
    if (psi?.seo != null) score = Math.round(score * 0.7 + psi.seo * 0.3)
    score = clamp(score)
    cards.push({ key: 'seo', title: t('SEO técnico', 'Technical SEO'), score, findings: fnd,
      summary: score >= 75 ? t('La base técnica está bien; el SEO ahora depende del contenido y la autoridad.', 'The technical base is fine; SEO now depends on content and authority.') : score >= 50 ? t('Hay fallos básicos que frenan a Google y se arreglan rápido.', 'Basic faults hold Google back and are quick to fix.') : t('La web no le pone fácil a Google entender ni posicionar tus páginas.', 'The site makes it hard for Google to understand or rank your pages.'),
      action: noDesc || noTitle || dupT ? t('Escribe un título y una descripción únicos para cada página, con el servicio y la zona.', 'Write a unique title and description for every page, naming the service and the area.') : !a.has_schema ? t('Añade datos estructurados de negocio local (nombre, dirección, teléfono, horario).', 'Add local-business structured data (name, address, phone, hours).') : t('Crea páginas propias para cada servicio y zona que quieras posicionar.', 'Create a dedicated page for each service and area you want to rank for.') })
  }
  // 5. Tracking & marketing
  {
    const fnd: Finding[] = []
    const ads = String(answers.ads || '')
    fnd.push({ ok: tags.ga4 || tags.gtm, text: tags.ga4 || tags.gtm ? t('Hay analítica instalada (Google Analytics / Tag Manager).', 'Analytics is installed (Google Analytics / Tag Manager).') : t('No hay analítica: no sabes cuánta gente entra ni qué hace.', 'No analytics: you do not know how many people visit or what they do.') })
    fnd.push({ ok: null, text: tags.google_ads ? (tags.google_ads_conversion ? t('Etiqueta de Google Ads con seguimiento de conversiones.', 'Google Ads tag with conversion tracking.') : t('Hay etiqueta de Google Ads pero no vemos conversiones configuradas: si anuncias, no sabes qué anuncio trae clientes.', 'There is a Google Ads tag but no conversion tracking: if you advertise, you cannot tell which ad brings customers.')) : t('No hay etiqueta de Google Ads en la web.', 'No Google Ads tag on the site.') })
    fnd.push({ ok: null, text: tags.meta ? (tags.meta_events ? t('Píxel de Meta con eventos (Lead/Contacto).', 'Meta Pixel with events (Lead/Contact).') : t('Píxel de Meta instalado, sin eventos de contacto: las campañas de Facebook/Instagram no pueden optimizar.', 'Meta Pixel installed without contact events: Facebook/Instagram campaigns cannot optimise.')) : t('No hay píxel de Meta (Facebook/Instagram).', 'No Meta (Facebook/Instagram) Pixel.') })
    if (tags.bing || tags.other || tags.call_tracking) fnd.push({ ok: true, text: t('Otras etiquetas: ', 'Other tags: ') + [tags.bing && 'Bing Ads', tags.other && 'TikTok/LinkedIn', tags.call_tracking && t('seguimiento de llamadas', 'call tracking')].filter(Boolean).join(', ') })
    if (ads === 'google' || ads === 'both') fnd.push({ ok: tags.google_ads_conversion, text: tags.google_ads_conversion ? t('Dices que anuncias en Google y la medición está en su sitio.', 'You say you advertise on Google and the measurement is in place.') : t('Dices que anuncias en Google, pero la web no mide conversiones: estás pagando a ciegas.', 'You say you advertise on Google, but the site does not measure conversions: you are paying blind.') })
    if (ads === 'meta' || ads === 'both') fnd.push({ ok: tags.meta_events, text: tags.meta_events ? t('Dices que anuncias en Meta y los eventos están configurados.', 'You say you advertise on Meta and the events are set up.') : t('Dices que anuncias en Meta, pero no hay eventos de contacto: el algoritmo no aprende quién te escribe.', 'You say you advertise on Meta, but there are no contact events: the algorithm cannot learn who contacts you.') })
    const advertising = ads === 'google' || ads === 'meta' || ads === 'both' || tags.google_ads || tags.meta
    let score = (tags.ga4 || tags.gtm ? 40 : 0) + (a.has_gsc_verification ? 10 : 0)
    if (advertising) score += (tags.google_ads ? (tags.google_ads_conversion ? 25 : 10) : 0) + (tags.meta ? (tags.meta_events ? 25 : 10) : 0)
    else score += 50
    score = clamp(score)
    cards.push({ key: 'tracking', title: t('Medición y marketing', 'Tracking and marketing'), score, findings: fnd,
      summary: !(tags.ga4 || tags.gtm) ? t('Sin datos no hay decisiones: la web no mide nada.', 'Without data there are no decisions: the site measures nothing.') : advertising && !(tags.google_ads_conversion || tags.meta_events) ? t('Anuncias (o lo parece) sin medir resultados.', 'You advertise (or seem to) without measuring results.') : t('La medición básica está en su sitio.', 'Basic measurement is in place.'),
      action: !(tags.ga4 || tags.gtm) ? t('Instala Google Analytics 4 y Tag Manager y mide llamadas, WhatsApp y formularios como conversiones.', 'Install Google Analytics 4 and Tag Manager and track calls, WhatsApp and forms as conversions.') : t('Configura conversiones (llamada, WhatsApp, formulario) y conéctalas a Google Ads y Meta.', 'Set up conversions (call, WhatsApp, form) and connect them to Google Ads and Meta.') })
  }
  // 6. Modernity
  {
    const fnd: Finding[] = []
    const jq = a.jquery_ver ? parseFloat(a.jquery_ver) : null; const bs = a.bootstrap_ver ? parseInt(a.bootstrap_ver) : null
    let old = 0
    if (a.copyright_year && a.copyright_year < YEAR - 1) { old += 20; fnd.push({ ok: false, text: t(`El pie de página dice © ${a.copyright_year}: parece abandonada.`, `The footer says © ${a.copyright_year}: it looks abandoned.`) }) }
    else if (a.copyright_year) fnd.push({ ok: true, text: t(`Pie de página actualizado (© ${a.copyright_year}).`, `Footer is current (© ${a.copyright_year}).`) })
    if (wbFirst) { fnd.push({ ok: null, text: t(`El dominio lleva online desde ${wbFirst} (unos ${YEAR - wbFirst} años).`, `The domain has been online since ${wbFirst} (about ${YEAR - wbFirst} years).`) }); if (YEAR - wbFirst >= 7 && (!a.copyright_year || a.copyright_year < YEAR)) old += 10 }
    if (jq != null && jq < 3) { old += 15; fnd.push({ ok: false, text: t(`Usa jQuery ${a.jquery_ver}, una versión antigua con fallos de seguridad conocidos.`, `Uses jQuery ${a.jquery_ver}, an old version with known security issues.`) }) }
    if (bs != null && bs < 4) { old += 15; fnd.push({ ok: false, text: t(`Usa Bootstrap ${a.bootstrap_ver}: diseño de hace una década.`, `Uses Bootstrap ${a.bootstrap_ver}: a decade-old design base.`) }) }
    if (a.legacy_markup) { old += 25; fnd.push({ ok: false, text: t('El código usa técnicas obsoletas (tablas, Flash o etiquetas antiguas).', 'The code uses obsolete techniques (tables, Flash or legacy tags).') }) }
    if (!a.has_viewport) { old += 30; fnd.push({ ok: false, text: t('No está adaptada a móvil.', 'Not adapted for mobile.') }) }
    if (a.platform) fnd.push({ ok: null, text: t(`Plataforma: ${a.platform}.`, `Platform: ${a.platform}.`) + (a.platform === 'Wix' || a.platform === 'Squarespace' ? t(' Cuota mensual de por vida y menos control sobre velocidad y SEO.', ' Monthly fee for life and less control over speed and SEO.') : a.platform === 'WordPress' ? t(' Necesita actualizaciones y mantenimiento regulares.', ' Needs regular updates and maintenance.') : '') })
    if (!fnd.some(x => x.ok === false)) fnd.push({ ok: true, text: t('No vemos señales técnicas de web anticuada.', 'We see no technical signs of an outdated site.') })
    const score = clamp(100 - old)
    cards.push({ key: 'modern', title: t('¿Está anticuada?', 'Is it outdated?'), score, findings: fnd,
      summary: score >= 75 ? t('Técnicamente está al día.', 'Technically up to date.') : score >= 50 ? t('Muestra signos de edad que un cliente nota.', 'Shows signs of age that a customer notices.') : t('Transmite abandono: un cliente duda de si el negocio sigue activo.', 'It looks abandoned: a customer doubts the business is still active.'),
      action: score >= 75 ? t('Revisa el diseño una vez al año y actualiza la plataforma.', 'Review the design yearly and keep the platform updated.') : t('Una web nueva de una página, rápida y pensada para móvil, suele ser más barata que parchear la actual.', 'A new one-page site, fast and built for mobile, is often cheaper than patching the current one.') })
  }
  const scored = cards.filter(c => c.score != null) as (Card & { score: number })[]
  const weights: Record<string, number> = { impression: 0.22, cta: 0.2, speed: 0.15, seo: 0.18, tracking: 0.13, modern: 0.12 }
  const overall = scored.length ? clamp(scored.reduce((s, c) => s + c.score * weights[c.key], 0) / scored.reduce((s, c) => s + weights[c.key], 0)) : null
  return { ok: true, result: {
    overall, cards, tags, pages, ai, psi, limits, generated_at: new Date().toISOString(),
    facts: { platform: a.platform || null, first_year: wbFirst, copyright_year: a.copyright_year, pages_checked: okPages.length, load_ms: f.ms, https, final_url: f.finalUrl, title: a.title, word_count: a.word_count },
  } }
}
