/**
 * City × service landings, grouped for internal linking (footer "Zonas",
 * service pages, blog posts). Keep in sync with lib/landing-data*.ts.
 */
export interface AreaLink {
  href: string
  labelEs: string
  labelEn: string
  lang: 'es' | 'en'
  service: 'web' | 'seo' | 'marketing' | 'performance'
}

export const areaLinks: AreaLink[] = [
  { href: '/diseno-web-san-roque', labelEs: 'Diseño web San Roque y Sotogrande', labelEn: 'Web design San Roque & Sotogrande (ES)', lang: 'es', service: 'web' },
  { href: '/diseno-web-algeciras', labelEs: 'Diseño web Algeciras', labelEn: 'Web design Algeciras (ES)', lang: 'es', service: 'web' },
  { href: '/diseno-web-la-linea', labelEs: 'Diseño web La Línea', labelEn: 'Web design La Línea (ES)', lang: 'es', service: 'web' },
  { href: '/diseno-web-estepona', labelEs: 'Diseño web Estepona', labelEn: 'Web design Estepona (ES)', lang: 'es', service: 'web' },
  { href: '/en/web-design-sotogrande', labelEs: 'Diseño web Sotogrande (EN)', labelEn: 'Web design Sotogrande', lang: 'en', service: 'web' },
  { href: '/en/web-design-gibraltar', labelEs: 'Diseño web Gibraltar (EN)', labelEn: 'Web design Gibraltar', lang: 'en', service: 'web' },
  { href: '/seo-algeciras', labelEs: 'SEO Algeciras', labelEn: 'SEO Algeciras (ES)', lang: 'es', service: 'seo' },
  { href: '/en/seo-gibraltar', labelEs: 'SEO Gibraltar (EN)', labelEn: 'SEO Gibraltar', lang: 'en', service: 'seo' },
  { href: '/agencia-marketing-digital-algeciras', labelEs: 'Marketing digital Algeciras', labelEn: 'Digital marketing Algeciras (ES)', lang: 'es', service: 'marketing' },
  { href: '/en/digital-marketing-gibraltar', labelEs: 'Marketing digital Gibraltar (EN)', labelEn: 'Digital marketing Gibraltar', lang: 'en', service: 'marketing' },
  { href: '/en/igaming-marketing', labelEs: 'Marketing iGaming (EN)', labelEn: 'iGaming marketing', lang: 'en', service: 'performance' },
]

/** Service pillar pages, for cross-linking between them and from city pages. */
export const servicePillars: { es: string; en: string; labelEs: string; labelEn: string }[] = [
  { es: '/servicios/diseno-web', en: '/en/services/web-design', labelEs: 'Diseño web', labelEn: 'Web design' },
  { es: '/servicios/seo', en: '/en/services/seo', labelEs: 'SEO', labelEn: 'SEO' },
  { es: '/servicios/publicidad', en: '/en/services/paid-media', labelEs: 'Google Ads y redes', labelEn: 'Google Ads & paid social' },
  { es: '/servicios/automatizacion-ia', en: '/en/services/ai-automation', labelEs: 'Automatización e IA', labelEn: 'AI automation' },
  { es: '/servicios/performance', en: '/en/services/performance', labelEs: 'Performance a escala', labelEn: 'Performance at scale' },
]

/** Same-language links first, then the rest. */
export function areasFor(lang: 'es' | 'en', services?: AreaLink['service'][]): AreaLink[] {
  const list = services ? areaLinks.filter((a) => services.includes(a.service)) : areaLinks
  return [...list.filter((a) => a.lang === lang), ...list.filter((a) => a.lang !== lang)]
}
