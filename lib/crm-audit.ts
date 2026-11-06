// Auditor: mide hechos observables en el HTML público y clasifica el encaje por servicio.
// Los "pixels" indican que anuncian o han anunciado; NO prueban que haya campañas activas hoy.
export type Reason = { label: string; points: number };
export type Fit = { web: number; seo: number; ppc: number; social: number };
export const PITCH_LABEL: Record<string, string> = { verificar: 'Verificar web',  web: 'Web nueva', seo: 'SEO mensual', ppc: 'Google Ads mensual', social: 'Meta/Social Ads mensual' };
const YEAR = new Date().getFullYear();

async function get(url: string, ms = 15000) {
  const t0 = Date.now(); const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImpulsoMediaAudit/1.0; +https://impulsomedia.es)' } });
    const html = await res.text();
    return { ok: res.ok, status: res.status, finalUrl: res.url, ms: Date.now() - t0, html: html.slice(0, 2_000_000), bytes: html.length, error: res.ok ? null : `HTTP ${res.status}` };
  } catch (e: any) {
    return { ok: false, status: 0, finalUrl: url, ms: Date.now() - t0, html: '', bytes: 0, error: e?.name === 'AbortError' ? 'Timeout' : String(e?.message || e) };
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
  };
}

type A = ReturnType<typeof analyse>;
type F = { ok: boolean; ms: number; bytes: number; finalUrl: string; error: string | null; sitemap: boolean };
type L = { category?: string | null; google_reviews?: number | null };

export function classify(a: A | null, f: F, lead: L) {
  const reasons: Record<keyof Fit, Reason[]> = { web: [], seo: [], ppc: [], social: [] };
  const add = (k: keyof Fit, label: string, points: number) => reasons[k].push({ label, points });
  const cat = (lead.category || '').toLowerCase();
  const highIntent = /inmobiliaria|dental|cl[ií]nica|abogad|gestor|reformas|veterin|est[eé]tica|hotel|alquiler/.test(cat);
  const consumer = /restaurante|dental|cl[ií]nica|est[eé]tica|hotel|bar|tienda|gimnasio/.test(cat);
  const established = (lead.google_reviews || 0) >= 50;

  if (!f.ok || !a) {
    if (f.status === 0) add('web', `No responde desde el servidor (${f.error}): verificar el dominio a mano, puede estar caído o mal listado`, 0);
    else add('web', `Web con error (${f.error})`, 60);
  } else {
    // WEB NUEVA (pago único; puerta de entrada a retainer)
    if (!f.finalUrl.startsWith('https://')) add('web', 'Sin HTTPS', 20);
    if (!a.has_viewport) add('web', 'No adaptada a móvil (sin viewport)', 35);
    if (a.copyright_year && a.copyright_year <= YEAR - 3) add('web', `Aspecto abandonado: copyright ${a.copyright_year}`, 20);
    if (/Drupal 7|Joomla! ?(1|2|3)\./i.test(a.platform)) add('web', `Plataforma sin soporte de seguridad (${a.platform})`, 35);
    if (f.ms > 3000) add('web', `Respuesta lenta (${(f.ms / 1000).toFixed(1)} s)`, 15);
    if (!a.has_whatsapp && !a.has_contact_form) add('web', 'Sin forma de contacto directa (ni formulario ni WhatsApp)', 15);
    // SEO MENSUAL
    if (a.title.length < 15) add('seo', 'Título SEO ausente o muy corto', 12);
    if (!a.meta_description) add('seo', 'Sin meta descripción', 12);
    if (!a.has_h1) add('seo', 'Sin H1', 8);
    if (!a.has_schema) add('seo', 'Sin datos estructurados (schema)', 15);
    if (!a.has_canonical) add('seo', 'Sin etiqueta canonical', 6);
    if (!f.sitemap) add('seo', 'Sin sitemap.xml', 15);
    if (a.word_count >= 50 && a.word_count < 300) add('seo', `Poco contenido en portada (${a.word_count} palabras)`, 12);
    if (a.word_count < 50) add('seo', `Portada casi sin texto en el HTML (${a.word_count} palabras): puede cargar con JavaScript, revisar a mano`, 0);
    if (!a.has_blog) add('seo', 'Sin blog/noticias', 6);
    if (!a.has_hreflang && highIntent) add('seo', 'Sin versiones de idioma en zona con clientela internacional', 10);
    if (!a.has_gsc_verification) add('seo', 'Sin verificación de Search Console visible', 5);
    if (highIntent) add('seo', 'Sector donde la gente busca en Google', 10);
    if (established) add('seo', 'Negocio consolidado (50+ reseñas)', 10);
    // GOOGLE ADS MENSUAL
    if (highIntent) add('ppc', 'Sector de búsqueda con intención de compra', 30);
    if (a.has_google_ads_tag) add('ppc', 'Ya usa etiquetas de Google Ads: mercado ya educado, entrar con auditoría/optimización', 25);
    else add('ppc', 'Sin etiquetas de Google Ads: oportunidad de arrancar campañas', 20);
    if (a.has_viewport && (a.has_contact_form || a.has_whatsapp)) add('ppc', 'La web ya puede convertir tráfico (móvil + contacto)', 15);
    else add('ppc', 'Necesitaría mejorar la web antes de invertir en anuncios', 0);
    if (!a.has_analytics) add('ppc', 'Sin analítica/conversiones medidas', 10);
    if (established) add('ppc', 'Negocio consolidado: probable capacidad de inversión', 15);
    // META / SOCIAL ADS MENSUAL
    if (consumer) add('social', 'Negocio de cliente final: encaja con Meta Ads', 25);
    if (a.has_meta_pixel) add('social', 'Ya tiene Meta Pixel instalado', 15);
    else add('social', 'Sin Meta Pixel: sin remarketing', 25);
    if (a.has_social_links) add('social', 'Perfiles sociales activos enlazados', 15);
    if (established) add('social', 'Negocio consolidado: probable capacidad de inversión', 15);
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
  if (prev.http_status && prev.http_status < 400 && cur.http_status >= 400) out.push('la web ya no responde');
  if (prev.platform !== cur.platform && (prev.platform || cur.platform)) out.push(`plataforma: ${prev.platform || '—'} → ${cur.platform || '—'}`);
  if (prev.has_google_ads_tag === false && cur.has_google_ads_tag === true) out.push('nueva etiqueta de Google Ads');
  if (prev.has_meta_pixel === false && cur.has_meta_pixel === true) out.push('nuevo Meta Pixel');
  if (prev.copyright_year && cur.copyright_year && cur.copyright_year > prev.copyright_year) out.push(`copyright ${prev.copyright_year} → ${cur.copyright_year} (web actualizada)`);
  if (prev.title && cur.title && prev.title !== cur.title) out.push('cambió el título de la portada');
  if (prev.has_viewport === false && cur.has_viewport === true) out.push('ahora adaptada a móvil');
  if (prev.has_whatsapp === false && cur.has_whatsapp === true) out.push('añadido WhatsApp');
  return out;
}

export async function auditLead(sb: any, lead: any, opts: { psi?: boolean } = { psi: true }) {
  if (!lead.website) return { skipped: true };
  const f = await fetchSite(lead.website);
  const a = f.ok ? analyse(f.html) : null;
  let sitemap = false;
  if (f.ok) { try { const o = new URL(f.finalUrl).origin; const s = await get(o + '/sitemap.xml', 6000); sitemap = s.ok && /<urlset|<sitemapindex/i.test(s.html); } catch {} }
  const c = classify(a, { ...f, sitemap }, lead);
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
  };
  await sb.from('crm_audits').insert(row);
  const changes = diffAudits(prevRows?.[0], row);
  const patch: any = { score: c.total, recurring_score: c.recurring, service_fit: c.fit, fit_reasons: c.reasons, primary_pitch: c.primary, last_audit_at: new Date().toISOString() };
  if (lead.status === 'nuevo') patch.status = 'revisado';
  if (changes.length) { patch.changed_at = new Date().toISOString(); patch.change_note = changes.join(' · '); }
  await sb.from('crm_leads').update(patch).eq('id', lead.id);
  if (a) {
    const rows = [...a.emails.map(v => ({ kind: 'email', value: v })), ...a.tels.map(v => ({ kind: 'phone', value: v })), ...a.socials.map(v => ({ kind: 'social', value: v }))]
      .map(r => ({ ...r, lead_id: lead.id, source_url: f.finalUrl }));
    if (rows.length) await sb.from('crm_contacts').upsert(rows, { onConflict: 'lead_id,kind,value', ignoreDuplicates: true });
  }
  await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Auditoría: ${PITCH_LABEL[c.primary]}${c.primary === 'verificar' ? '' : ` (${c.fit[c.primary as keyof Fit]}/100)`} · recurrente ${c.recurring}` });
  if (changes.length) await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Cambio detectado: ${changes.join(' · ')}` });
  return c;
}
