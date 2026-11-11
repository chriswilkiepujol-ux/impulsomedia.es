/**
 * City × service landings (SEO satellite pages). Rule (Chris, 10 nov 2026):
 * main-menu pages never link to them; they are reached from the areas hub
 * (/zonas, /en/areas, one discreet footer link) and from each other, always
 * within the same language. Keep in sync with lib/landing-data*.ts.
 */
export interface AreaLink {
  href: string
  labelEs: string
  labelEn: string
  lang: 'es' | 'en'
  service: 'web' | 'seo' | 'marketing' | 'performance'
  zone: 'campo' | 'costa' | 'sotogrande' | 'gibraltar' | 'sector'
  descEs: string
  descEn: string
}

export const areaLinks: AreaLink[] = [
  { href: '/diseno-web-san-roque', labelEs: 'Diseño web San Roque y Sotogrande', labelEn: 'Web design San Roque & Sotogrande (ES)', lang: 'es', service: 'web', zone: 'campo', descEs: 'Webs para negocios de San Roque, Sotogrande, Pueblo Nuevo y Guadiaro.', descEn: 'Websites for businesses in San Roque and Sotogrande.' },
  { href: '/diseno-web-algeciras', labelEs: 'Diseño web Algeciras', labelEn: 'Web design Algeciras (ES)', lang: 'es', service: 'web', zone: 'campo', descEs: 'Webs corporativas, tiendas online y webs a medida para empresas de Algeciras.', descEn: 'Websites for businesses in Algeciras.' },
  { href: '/diseno-web-la-linea', labelEs: 'Diseño web La Línea', labelEn: 'Web design La Línea (ES)', lang: 'es', service: 'web', zone: 'campo', descEs: 'Webs para comercios y empresas de La Línea de la Concepción.', descEn: 'Websites for businesses in La Línea.' },
  { href: '/diseno-web-estepona', labelEs: 'Diseño web Estepona', labelEn: 'Web design Estepona (ES)', lang: 'es', service: 'web', zone: 'costa', descEs: 'Webs para negocios de Estepona, Manilva y Casares.', descEn: 'Websites for businesses in Estepona and Manilva.' },
  { href: '/en/web-design-sotogrande', labelEs: 'Diseño web Sotogrande (EN)', labelEn: 'Web design Sotogrande', lang: 'en', service: 'web', zone: 'sotogrande', descEs: 'Bilingual websites for businesses and services in Sotogrande.', descEn: 'Bilingual websites for businesses and services in Sotogrande.' },
  { href: '/en/web-design-gibraltar', labelEs: 'Diseño web Gibraltar (EN)', labelEn: 'Web design Gibraltar', lang: 'en', service: 'web', zone: 'gibraltar', descEs: 'Webs para empresas de Gibraltar.', descEn: 'Websites for international companies operating from Gibraltar and for local businesses.' },
  { href: '/seo-algeciras', labelEs: 'SEO Algeciras', labelEn: 'SEO Algeciras (ES)', lang: 'es', service: 'seo', zone: 'campo', descEs: 'Posicionamiento en Google para empresas de Algeciras y la comarca.', descEn: 'SEO for businesses in Algeciras.' },
  { href: '/en/seo-gibraltar', labelEs: 'SEO Gibraltar (EN)', labelEn: 'SEO Gibraltar', lang: 'en', service: 'seo', zone: 'gibraltar', descEs: 'SEO para empresas de Gibraltar.', descEn: 'SEO for Gibraltar companies, whether their customers are local or abroad.' },
  { href: '/agencia-marketing-digital-algeciras', labelEs: 'Marketing digital Algeciras', labelEn: 'Digital marketing Algeciras (ES)', lang: 'es', service: 'marketing', zone: 'campo', descEs: 'Google Ads, redes y marketing que se mide en clientes, en Algeciras.', descEn: 'Digital marketing in Algeciras.' },
  { href: '/en/digital-marketing-gibraltar', labelEs: 'Marketing digital Gibraltar (EN)', labelEn: 'Digital marketing Gibraltar', lang: 'en', service: 'marketing', zone: 'gibraltar', descEs: 'Marketing digital para empresas de Gibraltar.', descEn: 'Paid media, social and campaigns for Gibraltar companies.' },
  { href: '/en/igaming-marketing', labelEs: 'Marketing iGaming (EN)', labelEn: 'iGaming marketing', lang: 'en', service: 'performance', zone: 'sector', descEs: 'Marketing para iGaming.', descEn: 'Performance marketing for operators and affiliates.' },
]

/** Service pillar pages, for cross-linking between them and from city pages. */
export const servicePillars: { es: string; en: string; labelEs: string; labelEn: string }[] = [
  { es: '/servicios/diseno-web', en: '/en/services/web-design', labelEs: 'Diseño web', labelEn: 'Web design' },
  { es: '/servicios/seo', en: '/en/services/seo', labelEs: 'SEO', labelEn: 'SEO' },
  { es: '/servicios/publicidad', en: '/en/services/paid-media', labelEs: 'Google Ads y redes', labelEn: 'Google Ads & paid social' },
  { es: '/servicios/branding', en: '/en/services/branding', labelEs: 'Branding', labelEn: 'Branding' },
  { es: '/servicios/automatizacion-ia', en: '/en/services/ai-automation', labelEs: 'Automatización e IA', labelEn: 'AI automation' },
  { es: '/servicios/performance', en: '/en/services/performance', labelEs: 'Performance a escala', labelEn: 'Performance at scale' },
]

/** Same-language landings only: Spanish pages never link to English ones and vice versa. */
export function areasFor(lang: 'es' | 'en', services?: AreaLink['service'][]): AreaLink[] {
  const list = services ? areaLinks.filter((a) => services.includes(a.service)) : areaLinks
  return list.filter((a) => a.lang === lang)
}

export const areasHubPath = (lang: 'es' | 'en') => (lang === 'en' ? '/en/areas' : '/zonas')

export const isAreaPage = (path: string) => areaLinks.some((a) => a.href === path)
