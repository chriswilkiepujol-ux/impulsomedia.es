// Auditor: mide hechos observables en el HTML público y clasifica el encaje por servicio.
// Los "pixels" indican que anuncian o han anunciado; NO prueban que haya campañas activas hoy.
import { refreshOpportunity } from './opportunity'
export type Reason = { label: string; points: number };
export type Fit = { web: number; seo: number; ppc: number; social: number };
export const PITCH_LABEL: Record<string, string> = { verificar: 'Check website',  onepager: 'One-page website (€400–500)', web: 'New website', seo: 'Monthly SEO', ppc: 'Monthly Google Ads', social: 'Monthly Meta/Social Ads' };
const YEAR = new Date().getFullYear();

async function get(url: string, ms = 15000) {
  const t0 = Date.now(); const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImpulsoMediaAudit/1.0; +https://impulsomedia.es)' } });
    const html = await res.text();
    return { ok: res.ok, status: res.status, finalUrl: res.url, ms: Date.now() - t0, html: html.slice(0, 2_000_000), bytes: html.length, error: res.ok ? null : `HTTP ${res.status}`, lastModified: res.headers.get('last-modified') };
  } catch (e: any) {
    return { ok: false, status: 0, finalUrl: url, ms: Date.now() - t0, html: '', bytes: 0, error: e?.name === 'AbortError' ? 'Timeout' : String(e?.message || e), lastModified: null as string | null };
  } finally { clearTimeout(timer); }
}
export const fetchSite = (url: string) => get(url, 15000);

export function analyse(h: string) {
  const pick = (re: RegExp) => (h.match(re)?.[1] || '').replace(/\s+/g, ' ').trim();
  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const meta = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const years = [...h.matchAll(/(?:©|&copy;|copyright)[^0-9<]{0,30}((?:19|20)\d{2})(?:\s*[-–]\s*((?:19|20)\d{2}))?/gi)].map(m => Number(m[2] || m[1]));
  const emails = [...new Set([...h.matchAll(/mailto:([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi)].map(m => m[1].toLowerCase()))];
  const tels = [...new Set([...h.matchAll(/href=["']tel:([+\d\s().-]{7,20})["']/gi)].map(m => m[1].trim()))];
  const socials = [...new Set([...h.matchAll(/href=["'](https?:\/\/(?:www\.)?(?:instagram\.com|facebook\.com|linkedin\.com\/(?:company|in)|tiktok\.com|x\.com|twitter\.com|youtube\.com)\/[^"'\s?#]+)/gi)].map(m => m[1]))];
  const gen = pick(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']*)["']/i);
  const platform = /wp-content|wp-includes/i.test(h) ? 'WordPress' : /wixstatic|wix\.com|X-Wix/i.test(h) ? 'Wix' : /squarespace/i.test(h) ? 'Squarespace' : /cdn\.shopify|shopify/i.test(h) ? 'Shopify' : /webflow/i.test(h) ? 'Webflow' : /_next\/static/i.test(h) ? 'Next.js' : /joomla/i.test(h) ? 'Joomla' : /prestashop/i.test(h) ? 'PrestaShop' : gen || '';
  const text = h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  return {
    title, meta_description: meta,
    has_viewport: /<meta[^>]+name=["']viewport["']/i.test(h),
    has_whatsapp: /wa\.me\/|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp:\/\//i.test(h),
    has_contact_form: /<form[\s>]/i.test(h),
    has_tel_link: tels.length > 0,
    has_schema: /application\/ld\+json/i.test(h),
    has_analytics: /googletagmanager\.com|google-analytics\.com|gtag\(|plausible\.io|matomo/i.test(h),
    has_hreflang: /hreflang=/i.test(h),
    html_lang: pick(/<html[^>]+lang=["']([^"']+)["']/i),
    copyright_year: years.length ? Math.max(...years) : null,
    generator: gen, platform,
    has_google_ads_tag: /googleadservices\.com|AW-\d{6,}|doubleclick\.net|conversion\.js/i.test(h),
    has_meta_pixel: /connect\.facebook\.net|fbq\(/i.test(h),
    has_other_pixel: /analytics\.tiktok\.com|snap\.licdn\.com|ttq\.load|_linkedin_partner_id/i.test(h),
    has_gtm: /googletagmanager\.com\/gtm/i.test(h),
    has_canonical: /<link[^>]+rel=["']canonical["']/i.test(h),
    has_h1: /<h1[\s>]/i.test(h),
    word_count: text.split(' ').filter(Boolean).length,
    has_gsc_verification: /google-site-verification/i.test(h),
    has_blog: /href=["'][^"']*(\/blog|\/noticias|\/news|\/articulos|\/articles)[\/"']/i.test(h),
    has_social_links: socials.length > 0,
    emails, tels, socials,
    has_aw_id: /AW-\d{6,}/i.test(h),
    gads_conversion: /AW-\d{6,}\/[\w-]{6,}|gtag\(\s*['"]event['"]\s*,\s*['"]conversion['"]/i.test(h),
    meta_events: /fbq\(\s*['"]track['"]\s*,\s*['"](Lead|Contact|Purchase|Schedule|CompleteRegistration|InitiateCheckout|SubmitApplication|AddToCart)/i.test(h),
    utm_links: /utm_(?:source|medium)=(?:cpc|paid|ppc|facebook|fb|ig|google)/i.test(h),
    call_tracking: /callrail|calltrackingmetrics|whatconverts|calltracking|ctm\.js|dynamicnumber/i.test(h),
    jquery_ver: (h.match(/jquery[^"'\s>]*?[-\/.](\d+\.\d+(?:\.\d+)?)(?:\.min)?\.js/i) || h.match(/jquery(?:\.min)?\.js\?ver=(\d+\.\d+(?:\.\d+)?)/i))?.[1] || null,
    bootstrap_ver: h.match(/bootstrap[^"'\s>]*?[-\/@.v](\d+\.\d+(?:\.\d+)?)/i)?.[1] || null,
    internal_links: new Set([...h.matchAll(/<a[^>]+href=["']((?:\/(?!\/)|(?![a-z]+:|#|\/\/))[^"'#?]*)/gi)].map(m => m[1])).size,
    is_complex: /woocommerce|add[-_]to[-_]cart|carrito|shopping[-_]cart|\/checkout|motor de reservas|reservar online|cloudbeds|simplebooking|resengo|fresha\.|doctoralia\.|booking-engine|\/reservas?[\/"']/i.test(h),
    gtm_ids: [...new Set([...h.matchAll(/GTM-[A-Z0-9]{4,9}/g)].map(m => m[0]))].slice(0, 2),
    via_gtm: false as boolean, gtm_conv: 0, has_bing: false as boolean, gtm_scanned: false as boolean,
    legacy_markup: /<font[\s>]|<center[\s>]|<frameset|swfobject|\.swf["']/i.test(h) || (h.match(/<table[\s>]/gi) || []).length > 8,
  };
}

type A = ReturnType<typeof analyse>;
type F = { ok: boolean; status?: number; ms: number; bytes: number; finalUrl: string; error: string | null; sitemap: boolean };
type L = { category?: string | null; google_reviews?: number | null };

export function classify(a: A | null, f: F, lead: L) {
  const reasons: Record<keyof Fit, Reason[]> = { web: [], seo: [], ppc: [], social: [] };
  const add = (k: keyof Fit, label: string, points: number) => reasons[k].push({ label, points });
  const cat = (lead.category || '').toLowerCase();
  const highIntent = /inmobiliaria|dental|cl[ií]nica|abogad|gestor|reformas|veterin|est[eé]tica|hotel|alquiler/.test(cat);
  const consumer = /restaurante|dental|cl[ií]nica|est[eé]tica|hotel|bar|tienda|gimnasio/.test(cat);
  const established = (lead.google_reviews || 0) >= 50;

  if (!f.ok || !a) {
    if (f.status === 0) add('web', `Server could not reach the site (${f.error}): check the domain by hand, it may be down or listed wrongly`, 0);
    else add('web', `Website error (${f.error})`, 60);
  } else {
    // WEB NUEVA (pago único; puerta de entrada a retainer)
    if (!f.finalUrl.startsWith('https://')) add('web', 'No HTTPS', 20);
    if (!a.has_viewport) add('web', 'Not mobile-friendly (no viewport)', 35);
    if (a.copyright_year && a.copyright_year <= YEAR - 3) add('web', `Looks abandoned: copyright ${a.copyright_year}`, 20);
    if (/Drupal 7|Joomla! ?(1|2|3)\./i.test(a.platform)) add('web', `Platform without security support (${a.platform})`, 35);
    if (f.ms > 3000) add('web', `Slow response (${(f.ms / 1000).toFixed(1)} s)`, 15);
    if (!a.has_whatsapp && !a.has_contact_form) add('web', 'No direct contact option (no form or WhatsApp)', 15);
    // SEO MENSUAL
    if (a.title.length < 15) add('seo', 'SEO title missing or too short', 12);
    if (!a.meta_description) add('seo', 'No meta description', 12);
    if (!a.has_h1) add('seo', 'No H1', 8);
    if (!a.has_schema) add('seo', 'No structured data (schema)', 15);
    if (!a.has_canonical) add('seo', 'No canonical tag', 6);
    if (!f.sitemap) add('seo', 'No sitemap.xml', 15);
    if (a.word_count >= 50 && a.word_count < 300) add('seo', `Thin homepage content (${a.word_count} words)`, 12);
    if (a.word_count < 50) add('seo', `Homepage has almost no text in the HTML (${a.word_count} words): may load with JavaScript, check by hand`, 0);
    if (!a.has_blog) add('seo', 'No blog/news', 6);
    if (!a.has_hreflang && highIntent) add('seo', 'No language versions in an area with international clients', 10);
    if (!a.has_gsc_verification) add('seo', 'No visible Search Console verification', 5);
    if (highIntent) add('seo', 'Sector where people search on Google', 10);
    if (established) add('seo', 'Established business (50+ reviews)', 10);
    // GOOGLE ADS MENSUAL
    if (highIntent) add('ppc', 'Search sector with buying intent', 30);
    if (a.has_google_ads_tag) add('ppc', 'Already uses Google Ads tags: educated market, enter with an audit/optimisation', 25);
    else add('ppc', 'No Google Ads tags: opportunity to start campaigns', 20);
    if (a.has_viewport && (a.has_contact_form || a.has_whatsapp)) add('ppc', 'The site can already convert traffic (mobile + contact)', 15);
    else add('ppc', 'Would need to improve the site before investing in ads', 0);
    if (!a.has_analytics) add('ppc', 'No analytics/conversion tracking', 10);
    if (established) add('ppc', 'Established business: likely able to invest', 15);
    // META / SOCIAL ADS MENSUAL
    if (consumer) add('social', 'Consumer-facing business: fits Meta Ads', 25);
    if (a.has_meta_pixel) add('social', 'Meta Pixel already installed', 15);
    else add('social', 'No Meta Pixel: no remarketing', 25);
    if (a.has_social_links) add('social', 'Active social profiles linked', 15);
    if (established) add('social', 'Established business: likely able to invest', 15);
  }
  const fit = {} as Fit; (Object.keys(reasons) as (keyof Fit)[]).forEach(k => { fit[k] = Math.min(100, reasons[k].reduce((s, r) => s + r.points, 0)); });
  // Ads sobre una web rota o no móvil rinden mal: se limita y primero se vende la web
  if (!f.ok || (a && !a.has_viewport)) { fit.ppc = Math.min(fit.ppc, 40); fit.social = Math.min(fit.social, 40); }
  if (!f.ok || !a) { fit.seo = 0; }
  const unreachable = !f.ok && f.status === 0;
  const recurring = Math.max(fit.seo, fit.ppc, fit.social);
  const total = Math.max(recurring, Math.round(fit.web * 0.7));
  // Web rota/obsoleta: primero la web (puerta de entrada) y luego el retainer
  const primary = unreachable ? 'verificar' : fit.web >= 55 ? 'web' : (Object.entries({ seo: fit.seo, ppc: fit.ppc, social: fit.social }).sort((x, y) => y[1] - x[1])[0][0]);
  return { fit, reasons, recurring, total, primary };
}


// ---- Scoring v2: obsolescencia, web sencilla, probabilidad de anuncios, presupuesto y preparación ----
export type Ev = { p: 'google' | 'meta' | 'ambos'; t: string; w: number; strong?: boolean };
export type Ext = { pageCount: number | null; sitemapLastmod: string | null; lastModified: string | null; wbFirst: number | null; wbChanges: number | null; wbLast: string | null };
const HIGH_AD = /funerari|inmobiliaria|dental|cl[ií]nica|abogad|reformas|piscina|cerrajer|veterin|est[eé]tica|hotel|alquiler|golf|seguros/;
const yearsAgo = (d: string | null) => d ? (Date.now() - new Date(d).getTime()) / 31557600000 : null;

export function scoreV2(a: A | null, f: F, lead: L & { phone?: string | null; email?: string | null }, x: Ext) {
  const cat = (lead.category || '').toLowerCase(); const rev = lead.google_reviews || 0;
  const highIntent = /inmobiliaria|dental|cl[ií]nica|abogad|gestor|reformas|veterin|est[eé]tica|hotel|alquiler/.test(cat);
  const consumer = /restaurante|dental|cl[ií]nica|est[eé]tica|hotel|bar|tienda|gimnasio|funerari/.test(cat);
  const out: any = { staleness: null, staleness_why: [] as string[], site_age_years: x.wbFirst ? YEAR - x.wbFirst : null, simple_site: null, ad_google: 0, ad_meta: 0, ad_prob: 0, ad_confidence: 'baja', ad_evidence: { google: { p: 0, ev: [] }, meta: { p: 0, ev: [] } }, budget_score: 0, knowledge_score: 0 };
  // ---------- Presupuesto (capacidad de pago) ----------
  const why: string[] = []; let b = 0;
  if (rev >= 200) { b += 30; why.push(`${rev} Google reviews (very active business)`); } else if (rev >= 50) { b += 20; why.push(`${rev} Google reviews`); } else if (rev >= 10) b += 8;
  if (HIGH_AD.test(cat)) { b += 20; why.push('High-ticket sector with clients who search on Google'); } else b += 8;
  if (x.wbFirst && YEAR - x.wbFirst >= 5) { b += 8; why.push(`Domain with history (${YEAR - x.wbFirst}+ years online)`); }
  if (a) {
    if (a.has_hreflang) { b += 8; why.push('Multilingual site: targets international clients'); }
    if (a.has_gtm || a.has_analytics) b += 8;
    if (a.has_google_ads_tag || a.has_meta_pixel) { b += 15; why.push('Already pays for advertising (tags installed)'); }
    if (a.has_social_links) b += 4;
    if (a.has_schema) b += 5;
    if (a.is_complex) b += 5;
  }
  out.budget_score = Math.min(100, b); out.budget_why = why;
  if (!f.ok || !a) {
    out.staleness = f.status === 0 ? null : 80;
    return out;
  }
  // ---------- Obsolescencia ----------
  let st = 0; const sw: string[] = []; const S = (n: number, t: string) => { st += n; sw.push(t); };
  if (!a.has_viewport) S(30, 'Not mobile-friendly');
  if (!f.finalUrl.startsWith('https://')) S(10, 'No HTTPS');
  if (a.copyright_year) { if (a.copyright_year <= YEAR - 5) S(25, `Copyright ${a.copyright_year}`); else if (a.copyright_year <= YEAR - 3) S(18, `Copyright ${a.copyright_year}`); }
  const jq = a.jquery_ver ? Number(a.jquery_ver.split('.')[0]) : null;
  if (jq != null && jq < 3) S(jq < 2 ? 18 : 12, `jQuery ${a.jquery_ver} (old version)`);
  const bs = a.bootstrap_ver ? Number(a.bootstrap_ver.split('.')[0]) : null;
  if (bs != null && bs <= 3) S(10, `Bootstrap ${a.bootstrap_ver} (template from years ago)`);
  if (/Drupal 7|Joomla! ?(1|2|3)\./i.test(a.platform)) S(20, `Unsupported platform (${a.platform})`);
  const wpv = /WordPress\s+(\d+)/i.exec(a.generator || '')?.[1]; if (wpv && Number(wpv) < 5) S(15, `WordPress ${wpv}.x out of date`);
  if (a.legacy_markup) S(15, 'Old-style layout (tables/flash/font)');
  const stale = [x.lastModified, x.sitemapLastmod].filter(Boolean).map(d => yearsAgo(d as string)).filter((v): v is number => v != null);
  if (stale.length) { const y = Math.min(...stale); if (y > 2) S(20, `Last modification detected ${y.toFixed(1)} years ago`); else if (y > 1) S(10, `Last modification detected ${y.toFixed(1)} years ago`); }
  if (x.wbFirst && x.wbChanges != null && x.wbChanges <= 1 && YEAR - x.wbFirst >= 3) S(15, 'No homepage changes in the last 2 years (Wayback)');
  if (f.ms > 3000) S(5, `Slow (${(f.ms / 1000).toFixed(1)} s)`);
  if (a.word_count >= 50 && a.word_count < 250) S(5, 'Very little content');
  out.staleness = Math.min(100, st); out.staleness_why = sw;
  // ---------- Web sencilla ----------
  const pages = x.pageCount;
  out.simple_site = !a.is_complex && a.internal_links <= 30 && (pages == null || pages <= 25);
  // ---------- Probabilidad de anuncios (con evidencia) ----------
  const ev: Ev[] = []; const E = (p: Ev['p'], t: string, w: number, strong = false) => ev.push({ p, t, w, strong });
  const vg = a.via_gtm ? ' (inside Tag Manager)' : '';
  if (a.gads_conversion) E('google', `Google Ads conversion tag${a.gtm_conv > 1 ? ` (${a.gtm_conv} conversions configured)` : ''}${vg}`, a.gtm_conv >= 3 ? 55 : 45, true);
  else if (a.has_aw_id) E('google', `Google Ads ID (AW-…) installed${vg}`, 30);
  else if (a.has_google_ads_tag) E('google', 'Google Ads/DoubleClick code present', 15);
  if (a.meta_events) E('meta', `Meta Pixel with conversion events (Lead/Contact/Purchase…)${vg}`, 38, true);
  else if (a.has_meta_pixel) E('meta', `Meta Pixel installed (no conversion events detected)${vg}`, 18);
  if (a.utm_links) E('ambos', 'Links with paid UTM parameters (cpc/paid/fb)', 12);
  if (a.call_tracking) E('google', 'Call tracking (typical of campaigns)', 12);
  if ((a.has_aw_id || a.has_meta_pixel) && a.has_gtm) E('ambos', 'Tag Manager managing marketing tags', 6);
  if (a.has_bing) E('google', 'Microsoft Ads (Bing UET) installed: invests in paid search', 10);
  if (a.gtm_ids.length && !a.gtm_scanned) E('ambos', 'Uses Tag Manager but the container could not be read: hidden tags possible', 5);
  if (a.has_other_pixel) E('ambos', 'Other ad pixels (TikTok/LinkedIn)', 6);
  const tagged = ev.length > 0;
  const prior = (plat: 'google' | 'meta') => { let n = 0; if (plat === 'google' && HIGH_AD.test(cat)) n += 10; if (plat === 'meta' && consumer) n += 8; if (rev >= 200) n += 10; else if (rev >= 50) n += 6; return n; };
  const sum = (plat: 'google' | 'meta') => ev.filter(e => e.p === plat || e.p === 'ambos').reduce((s, e) => s + e.w, 0);
  let g = sum('google') + prior('google'); let m = sum('meta') + prior('meta');
  if (!tagged) { g = Math.min(g, 28); m = Math.min(m, 28); }
  g = Math.min(100, g); m = Math.min(100, m);
  out.ad_google = g; out.ad_meta = m; out.ad_prob = Math.min(100, Math.max(g, m) + Math.round(Math.min(g, m) * 0.3));
  out.ad_evidence = { google: { p: g, ev: ev.filter(e => e.p !== 'meta').map(e => e.t) }, meta: { p: m, ev: ev.filter(e => e.p !== 'google').map(e => e.t) }, prior_only: !tagged };
  out.ad_confidence = ev.some(e => e.strong) || ev.length >= 3 ? 'alta' : tagged ? 'media' : 'baja';
  // ---------- Preparación (conocimiento de marketing) ----------
  let k = 0; if (a.has_analytics) k += 20; if (a.has_gtm) k += 15; if (a.has_meta_pixel) k += 15; if (a.has_google_ads_tag) k += 20; if (a.has_gsc_verification) k += 10; if (a.has_schema) k += 10; if (a.has_blog) k += 5; if (a.has_hreflang) k += 5;
  out.knowledge_score = Math.min(100, k);
  void highIntent; return out;
}

// Prioridad = dónde puedes aportar valor inmediato con una propuesta difícil de rechazar
export function prioritise(pitch: string, fit: Fit, s: any, lead: any) {
  const opp = pitch === 'onepager' ? Math.max(s.staleness ?? 0, fit.web) : pitch === 'web' ? fit.web : pitch === 'verificar' ? 0 : (fit as any)[pitch] ?? 0;
  const reach = (lead.phone || lead.email) ? 100 : 40;
  const quick = pitch === 'onepager' ? (s.simple_site || s.simple_site == null ? 100 : 40) : s.ad_prob >= 60 ? 90 : 50;
  let pr = Math.round(0.40 * opp + 0.25 * s.budget_score + 0.20 * reach + 0.15 * quick);
  if (lead.lead_type === 'warm') pr = Math.min(100, pr + 10);
  if (pitch === 'verificar') pr = Math.min(pr, 30);
  const why: string[] = [];
  if (pitch === 'onepager') { why.push(s.simple_site === false ? 'Old but complex site: consider a broader redesign' : 'Simple site: a modern one-pager (≈€450), shown already built'); }
  if (s.staleness != null && s.staleness >= 40) why.push(`Outdated website (${s.staleness}/100): ${(s.staleness_why || []).slice(0, 3).join(', ')}`);
  if (s.site_age_years != null) why.push(`Domain about ${s.site_age_years} years old`);
  if (s.ad_prob >= 40) why.push(`Likely spends on ads (${s.ad_prob}%, confidence ${({ alta: 'high', media: 'medium', baja: 'low' } as any)[s.ad_confidence] || s.ad_confidence})`);
  why.push(...(s.budget_why || []));
  if (reach === 100) why.push('Has a phone/email to contact');
  return { priority: Math.max(0, Math.min(100, pr)), why: why.slice(0, 6) };
}

export function pitchAngle(pitch: string, s: any, lead: any) {
  const p = s.ad_prob ?? 0; const hi = (s.budget_score ?? 0) >= 45;
  if (pitch === 'verificar') return 'Check by hand that the website exists before offering anything';
  if (pitch === 'onepager') return 'Build a simple working page, send it already built, and offer maintenance/SEO afterwards';
  if (p >= 60) return 'Already invests in ads: offer a free campaign audit (spend, conversions, landing page) and monthly optimisation';
  if (p >= 30) return 'Signs they try ads: audit what is installed and improve conversion';
  if (pitch === 'web') return 'Outdated website: renew it (one-off fee), then an SEO/ads retainer';
  if (hi && (lead.google_reviews || 0) >= 20) return 'Business with capacity and no ad signals: propose starting Google Ads with a landing page';
  return 'Local SEO audit with quick wins as the hook';
}

async function pageSpeed(url: string) {
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 28000);
    const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=${encodeURIComponent(url)}${process.env.PAGESPEED_API_KEY ? '&key=' + process.env.PAGESPEED_API_KEY : ''}`, { signal: ctl.signal });
    clearTimeout(t); if (!r.ok) return null;
    const j: any = await r.json(); const lh = j.lighthouseResult;
    const sc = lh?.categories?.performance?.score; if (sc == null) return null;
    return { score: Math.round(sc * 100), lcp: Math.round(lh.audits?.['largest-contentful-paint']?.numericValue || 0) || null };
  } catch { return null; }
}

function diffAudits(prev: any, cur: any) {
  const out: string[] = [];
  if (!prev) return out;
  if (prev.http_status && prev.http_status < 400 && cur.http_status >= 400) out.push('the website no longer responds');
  if (prev.platform !== cur.platform && (prev.platform || cur.platform)) out.push(`platform: ${prev.platform || '—'} → ${cur.platform || '—'}`);
  if (prev.has_google_ads_tag === false && cur.has_google_ads_tag === true) out.push('new Google Ads tag');
  if (prev.has_meta_pixel === false && cur.has_meta_pixel === true) out.push('new Meta Pixel');
  if (prev.copyright_year && cur.copyright_year && cur.copyright_year > prev.copyright_year) out.push(`copyright ${prev.copyright_year} → ${cur.copyright_year} (site updated)`);
  if (prev.title && cur.title && prev.title !== cur.title) out.push('homepage title changed');
  if (prev.has_viewport === false && cur.has_viewport === true) out.push('now mobile-friendly');
  if (prev.has_whatsapp === false && cur.has_whatsapp === true) out.push('WhatsApp added');
  return out;
}



// Los contenedores de Tag Manager son públicos (gtm.js): ahí viven la mayoría de etiquetas de Ads/Meta.
async function gtmScan(a: A) {
  for (const id of a.gtm_ids) {
    try {
      const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000);
      const r = await fetch(`https://www.googletagmanager.com/gtm.js?id=${id}`, { signal: c.signal }); clearTimeout(t);
      if (!r.ok) continue; const j = (await r.text()).slice(0, 1_500_000); a.gtm_scanned = true;
      const aw = j.match(/AW-\d{6,}/g) || []; const conv = (j.match(/AW-\d{6,}\/[\w-]{6,}/g) || []).length + (j.match(/__awct/g) || []).length;
      if (aw.length || /__awct|__sp\b|__gclidw|googleadservices/.test(j)) { a.has_google_ads_tag = true; a.via_gtm = true; }
      if (aw.length) a.has_aw_id = true;
      if (conv > 0) { a.gads_conversion = true; a.gtm_conv += conv; }
      if (/fbq\(|connect\.facebook\.net|__fbq/.test(j)) { a.has_meta_pixel = true; a.via_gtm = true; }
      if (/fbq\(\s*['"]track['"]\s*,\s*['"](Lead|Contact|Purchase|Schedule|CompleteRegistration|InitiateCheckout|SubmitApplication|AddToCart)/.test(j)) a.meta_events = true;
      if (/bat\.bing\.com|__bing/.test(j)) a.has_bing = true;
      if (/analytics\.tiktok\.com|ttq\.load|snap\.licdn\.com|_linkedin_partner_id/.test(j)) a.has_other_pixel = true;
    } catch {}
  }
}

async function waybackInfo(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const j = async (q: string) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000); try { const r = await fetch(`https://web.archive.org/cdx/search/cdx?output=json&filter=statuscode:200&url=${host}&${q}`, { signal: c.signal }); return r.ok ? await r.json() : null; } catch { return null; } finally { clearTimeout(t); } };
    const [first, recent] = await Promise.all([j('fl=timestamp&limit=1'), j(`fl=timestamp,digest&collapse=digest&from=${YEAR - 2}0101&limit=40`)]);
    const fy = Array.isArray(first) && first.length > 1 ? Number(String(first[1][0]).slice(0, 4)) : null;
    const rows = Array.isArray(recent) ? recent.length - 1 : null;
    const last = Array.isArray(recent) && recent.length > 1 ? String(recent[recent.length - 1][0]) : null;
    return { wbFirst: fy, wbChanges: rows != null && rows >= 0 ? rows : null, wbLast: last ? `${last.slice(0, 4)}-${last.slice(4, 6)}-${last.slice(6, 8)}` : null };
  } catch { return { wbFirst: null, wbChanges: null, wbLast: null }; }
}

async function sitemapInfo(origin: string) {
  const s = await get(origin + '/sitemap.xml', 6000);
  if (!(s.ok && /<urlset|<sitemapindex/i.test(s.html))) return { ok: false, pageCount: null as number | null, lastmod: null as string | null };
  const locs = (s.html.match(/<loc>/gi) || []).length; const isIndex = /<sitemapindex/i.test(s.html);
  const dates = [...s.html.matchAll(/<lastmod>\s*(\d{4}-\d{2}-\d{2})/gi)].map(m => m[1]).sort();
  return { ok: true, pageCount: isIndex ? null : locs, lastmod: dates.length ? dates[dates.length - 1] : null };
}


// ---- Buscador de web: muchos negocios no tienen la web en su ficha de Google. Se prueban dominios derivados del nombre
// (con DNS previo) y solo se acepta si la página coincide por teléfono o por nombre. ----
const strip = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const LEGAL = new Set(['sl', 'slu', 'sa', 'ltd', 'the', 'de', 'del', 'la', 'el', 'los', 'las', 'y', 'and', 'e', 'en']);
const GENERIC = new Set(['real', 'estate', 'estates', 'agency', 'agent', 'agents', 'clinica', 'clinic', 'veterinaria', 'veterinario', 'abogados', 'abogado', 'lawyers', 'solicitors', 'asesoria', 'fiscal', 'laboral', 'beauty', 'salon', 'inmobiliaria', 'properties', 'property', 'dental', 'centro', 'estetica', 'peluqueria', 'urgencias', 'consultorio', 'group', 'grupo', 'spain', 'espana', 'costa', 'sol', 'puerto']);
const AREAS = new Set(['sotogrande', 'estepona', 'manilva', 'sanroque', 'roque', 'san', 'algeciras', 'gibraltar', 'marbella', 'palmones', 'torreguadiaro']);
export function domainCandidates(name: string) {
  const first = strip(name).replace(/\(.*?\)/g, ' ').split(/\s[|–-]\s|\|/)[0];
  const toks = first.replace(/['’`´]/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(t => t && !LEGAL.has(t));
  if (!toks.length) return { cands: [] as string[], distinct: [] as string[] };
  const noArea = toks.filter(t => !AREAS.has(t)); const distinct = noArea.filter(t => !GENERIC.has(t));
  const bases = new Set<string>();
  const add = (a: string[], sep = '') => { const b = a.join(sep); if (b.length >= 4) bases.add(b); };
  add(toks); add(toks, '-'); add(noArea); add(noArea, '-'); add(distinct); add(distinct, '-');
  if (distinct.length) { add([...distinct, 'sotogrande']); add([...distinct, 'estepona']); add([...distinct, 'es']); }
  if (toks.length > 2) add(toks.slice(0, 2));
  // si el primer token es una sola letra (L' essenza) ya queda unido: lessenza...
  const raw = first.replace(/['’`´]\s*/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(t => t && !LEGAL.has(t)); add(raw);
  const cands: string[] = []; for (const b of bases) for (const t of ['com', 'es', 'net', 'eu']) cands.push(`${b}.${t}`);
  return { cands: cands.slice(0, 40), distinct };
}
async function resolves(d: string) {
  const dns = await import('node:dns/promises');
  for (const h of [d, 'www.' + d]) { try { const r = await Promise.race([dns.resolve4(h), new Promise<never>((_, j) => setTimeout(() => j(new Error('t')), 2500))]); if (r.length) return true; } catch {} }
  return false;
}
export async function findWebsite(lead: { name: string; phone?: string | null; area?: string | null; address?: string | null }) {
  const places = [strip(lead.address?.match(/\d{5}\s+([^,]+)/)?.[1] || ''), strip((lead.area || '').split(/[ ,y]/)[0] || '')].filter(x => x.length >= 4);
  const { cands, distinct } = domainCandidates(lead.name); if (!cands.length) return null;
  const ok: string[] = []; for (let i = 0; i < cands.length; i += 10) { const chunk = cands.slice(i, i + 10); const r = await Promise.all(chunk.map(async d => (await resolves(d)) ? d : null)); ok.push(...(r.filter(Boolean) as string[])); if (ok.length >= 8) break; }
  const tel = (lead.phone || '').replace(/\D/g, '').slice(-9);
  const checks = await Promise.all(ok.slice(0, 8).map(async d => {
    let r = await get('https://' + d, 7000); if (!r.ok) r = await get('https://www.' + d, 7000); if (!r.ok || r.html.length < 500) return null;
    const text = strip(r.html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
    const phoneHit = tel.length === 9 && (text.replace(/\D/g, '').includes(tel) || strip(r.html).replace(/\D/g, '').includes(tel));
    const head = strip((r.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '') + ' ' + (r.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, ' ') + ' ' + (r.html.match(/og:site_name"[^>]*content="([^"]*)"/i)?.[1] || ''));
    const hits = distinct.filter(t => head.includes(t)).length;
    const here = places.length === 0 || places.some(p => text.includes(p));
    const nameHit = here && (distinct.length >= 2 ? hits >= 2 : distinct.length === 1 ? hits === 1 : false);
    const parked = /domain (is )?for sale|dominio en venta|buy this domain|this domain may be for sale|godaddy|sedoparking/.test(text.slice(0, 3000)) && text.length < 4000;
    return !parked && (phoneHit || nameHit) ? { url: r.finalUrl, phoneHit } : null;
  }));
  const best = checks.filter(Boolean).sort((a: any, b: any) => Number(b.phoneHit) - Number(a.phoneHit))[0] as any;
  return best ? { url: best.url as string, phone: !!best.phoneHit } : null;
}

export async function auditLead(sb: any, lead: any, opts: { psi?: boolean } = { psi: true }) {
  if (!lead.website && lead.name && (!lead.relationship || lead.relationship === 'lead')) {
    const w = await findWebsite(lead);
    if (w) { lead.website = w.url; await sb.from('crm_leads').update({ website: w.url }).eq('id', lead.id); await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Website found automatically: ${w.url} (${w.phone ? 'phone number matches' : 'name and location match: verify it is them'})` }); }
  }
  if (!lead.website) {
    // Sin web registrada: candidato a página sencilla (verificar antes que de verdad no tiene)
    const s0 = scoreV2(null, { ok: false, ms: 0, bytes: 0, finalUrl: '', error: 'sin web', sitemap: false, status: -1 } as any, lead, { pageCount: null, sitemapLastmod: null, lastModified: null, wbFirst: null, wbChanges: null, wbLast: null });
    s0.staleness = 100; s0.simple_site = true; s0.ad_prob = 5; s0.ad_confidence = 'baja';
    const fit0 = { web: 0, seo: 0, ppc: 0, social: 0 } as Fit; const pr0 = prioritise('onepager', { ...fit0, web: 100 }, s0, lead);
    if ((lead.relationship && lead.relationship !== 'lead') || !['nuevo', 'revisado'].includes(lead.status || 'nuevo')) return { skipped: true };
    await sb.from('crm_leads').update({ primary_pitch: 'onepager', staleness: 100, simple_site: true, ad_prob: 5, ad_confidence: 'baja', ad_evidence: s0.ad_evidence, budget_score: s0.budget_score, knowledge_score: 0, priority: Math.min(pr0.priority, 62), priority_why: ['No website found (unconfirmed): check on Google; if they really have none, a simple page (≈€450), already built', ...pr0.why.slice(1)], pitch_angle: 'No website found: verify and, if none, show them a ready-made page', staleness_why: ['No website registered'], last_audit_at: new Date().toISOString() }).eq('id', lead.id);
    await refreshOpportunity(sb, { ...lead, website: null }, null, { ads: false });
    return { skipped: true };
  }
  const f = await fetchSite(lead.website);
  const a = f.ok ? analyse(f.html) : null;
  if (a && a.gtm_ids.length) await gtmScan(a);
  let sitemap = false; let ext: Ext = { pageCount: null, sitemapLastmod: null, lastModified: f.lastModified ? new Date(f.lastModified).toISOString().slice(0, 10) : null, wbFirst: null, wbChanges: null, wbLast: null };
  if (f.ok) { try { const o = new URL(f.finalUrl).origin; const [sm, wb] = await Promise.all([sitemapInfo(o), waybackInfo(f.finalUrl)]); sitemap = sm.ok; ext = { ...ext, pageCount: sm.pageCount, sitemapLastmod: sm.lastmod, ...wb }; } catch {} }
  if (ext.lastModified && Number.isNaN(Date.parse(ext.lastModified))) ext.lastModified = null;
  const c = classify(a, { ...f, sitemap }, lead);
  const s2 = scoreV2(a, { ...f, sitemap } as any, lead, ext);
  // Web sencilla y envejecida (o sin contenido útil): oferta de página única por mucho menos
  const unreachable = !f.ok && f.status === 0;
  let primary = c.primary;
  if (!unreachable && s2.simple_site && (s2.staleness ?? 0) >= 35 && (primary === 'web' || primary === 'seo')) primary = 'onepager';
  else if (!unreachable && !f.ok && f.status >= 400) primary = 'web';
  const pr = prioritise(primary, c.fit, s2, lead);
  const angle = pitchAngle(primary, s2, lead);
  const psi = f.ok && opts.psi !== false ? await pageSpeed(f.finalUrl) : null;
  const { data: prevRows } = await sb.from('crm_audits').select('*').eq('lead_id', lead.id).order('audited_at', { ascending: false }).limit(1);
  const row = {
    lead_id: lead.id, final_url: f.finalUrl, http_status: f.status, https: f.finalUrl.startsWith('https://'), load_ms: f.ms, html_kb: Math.round(f.bytes / 1024),
    title: a?.title || null, meta_description: a?.meta_description || null, has_viewport: a?.has_viewport ?? null, has_whatsapp: a?.has_whatsapp ?? null,
    has_contact_form: a?.has_contact_form ?? null, has_tel_link: a?.has_tel_link ?? null, has_schema: a?.has_schema ?? null, has_analytics: a?.has_analytics ?? null,
    has_hreflang: a?.has_hreflang ?? null, html_lang: a?.html_lang || null, copyright_year: a?.copyright_year ?? null, generator: a?.generator || null, error: f.error,
    has_google_ads_tag: a?.has_google_ads_tag ?? null, has_meta_pixel: a?.has_meta_pixel ?? null, has_other_pixel: a?.has_other_pixel ?? null, has_gtm: a?.has_gtm ?? null,
    has_sitemap: f.ok ? sitemap : null, has_canonical: a?.has_canonical ?? null, has_h1: a?.has_h1 ?? null, word_count: a?.word_count ?? null,
    has_gsc_verification: a?.has_gsc_verification ?? null, has_blog: a?.has_blog ?? null, platform: a?.platform || null, has_social_links: a?.has_social_links ?? null,
    pagespeed_mobile: psi?.score ?? null, lcp_ms: psi?.lcp ?? null,
    jquery_ver: a?.jquery_ver ?? null, bootstrap_ver: a?.bootstrap_ver ?? null, internal_links: a?.internal_links ?? null, page_count: ext.pageCount,
    sitemap_lastmod: ext.sitemapLastmod, last_modified: ext.lastModified, is_complex: a?.is_complex ?? null, gads_conversion: a?.gads_conversion ?? null,
    meta_events: a?.meta_events ?? null, utm_links: a?.utm_links ?? null, wb_first_year: ext.wbFirst, wb_changes_2y: ext.wbChanges, wb_last_capture: ext.wbLast,
  };
  await sb.from('crm_audits').insert(row);
  const changes = diffAudits(prevRows?.[0], row);
  const patch: any = { score: c.total, recurring_score: c.recurring, service_fit: c.fit, fit_reasons: c.reasons, primary_pitch: primary, staleness: s2.staleness, staleness_why: s2.staleness_why, site_age_years: s2.site_age_years, simple_site: s2.simple_site, ad_prob: s2.ad_prob, ad_confidence: s2.ad_confidence, ad_evidence: s2.ad_evidence, budget_score: s2.budget_score, knowledge_score: s2.knowledge_score, priority: pr.priority, priority_why: pr.why, pitch_angle: angle, last_audit_at: new Date().toISOString() };
  if (lead.status === 'nuevo') patch.status = 'revisado';
  if (changes.length) { patch.changed_at = new Date().toISOString(); patch.change_note = changes.join(' · '); }
  await sb.from('crm_leads').update(patch).eq('id', lead.id);
  await refreshOpportunity(sb, { ...lead, ...patch }, row);
  if (a) {
    const rows = [...a.emails.map(v => ({ kind: 'email', value: v })), ...a.tels.map(v => ({ kind: 'phone', value: v })), ...a.socials.map(v => ({ kind: 'social', value: v }))]
      .map(r => ({ ...r, lead_id: lead.id, source_url: f.finalUrl }));
    if (rows.length) await sb.from('crm_contacts').upsert(rows, { onConflict: 'lead_id,kind,value', ignoreDuplicates: true });
  }
  await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Audit: ${PITCH_LABEL[primary]} · priority ${pr.priority} · ads ${s2.ad_prob}% (${s2.ad_confidence}) · obsolescence ${s2.staleness ?? '—'}` });
  if (changes.length) await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Change detected: ${changes.join(' · ')}` });
  return { ...c, primary, priority: pr.priority };
}
