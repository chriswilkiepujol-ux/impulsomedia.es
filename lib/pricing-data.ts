export interface WebsitePackage {
  id: string
  nameEs: string
  nameEn: string
  priceFrom: string
  scopeEs: string
  scopeEn: string
}

export interface RetainerService {
  id: string
  nameEs: string
  nameEn: string
  priceEs: string
  priceEn: string
  scopeEs: string
  scopeEn: string
}

export const websitePackages: WebsitePackage[] = [
  {
    id: 'essential',
    nameEs: 'Essential',
    nameEn: 'Essential',
    priceFrom: '950',
    scopeEs: 'Hasta 5 páginas. Bilingüe ES/EN. Mobile first. Next.js a medida, sin plantilla. SEO on page básico. Configuración de Google My Business. 1 ronda de revisiones.',
    scopeEn: 'Up to 5 pages. Bilingual ES/EN. Mobile first. Custom Next.js build, no template. Basic on page SEO. Google My Business setup. 1 round of revisions.',
  },
  {
    id: 'growth',
    nameEs: 'Growth',
    nameEn: 'Growth',
    priceFrom: '1.800',
    scopeEs: 'Hasta 10 páginas. Estructura de blog. Casos de éxito y portfolio. SEO técnico completo: schema, sitemap, hreflang. 2 rondas de revisiones.',
    scopeEn: 'Up to 10 pages. Blog ready structure. Case studies and portfolio. Full technical SEO: schema, sitemap, hreflang. 2 rounds of revisions.',
  },
  {
    id: 'custom',
    nameEs: 'Custom / Enterprise',
    nameEn: 'Custom / Enterprise',
    priceFrom: '',
    scopeEs: 'E commerce. Sistemas de reserva. Funcionalidad a medida.',
    scopeEn: 'E commerce. Booking systems. Bespoke functionality.',
  },
]

// Order matters: Paid Social, SEO, PPC, Organic Social
export const retainerServices: RetainerService[] = [
  {
    id: 'paid-social',
    nameEs: 'Social Ads',
    nameEn: 'Paid Social',
    priceEs: '€400/mes fijo, o un porcentaje de la inversión publicitaria para cuentas de mayor volumen',
    priceEn: '€400/mo flat, or a percentage of ad spend for larger accounts',
    scopeEs: 'Anuncios en redes: Meta, TikTok, Snapchat. 1 a 2 plataformas, hasta 8 creatividades al mes, gestión de presupuesto, informe mensual.',
    scopeEn: 'Ads on social channels: Meta, TikTok, Snapchat. 1 to 2 platforms, up to 8 creatives per month, budget management, monthly report.',
  },
  {
    id: 'seo',
    nameEs: 'SEO',
    nameEn: 'SEO',
    priceEs: '€350/mes',
    priceEn: '€350/mo',
    scopeEs: 'Optimización de GMB, hasta 15 citas locales, 2 artículos de blog al mes, SEO on page, 1 informe mensual.',
    scopeEn: 'GMB optimization, up to 15 local citations, 2 blog posts per month, on page SEO, 1 monthly report.',
  },
  {
    id: 'ppc',
    nameEs: 'PPC',
    nameEn: 'PPC',
    priceEs: '€400/mes fijo, o un porcentaje de la inversión publicitaria para cuentas de mayor volumen',
    priceEn: '€400/mo flat, or a percentage of ad spend for larger accounts',
    scopeEs: 'Google Ads y búsqueda. 1 campaña activa, hasta 20 palabras clave gestionadas, informe mensual.',
    scopeEn: 'Google Ads and search. 1 active campaign, up to 20 managed keywords, monthly report.',
  },
  {
    id: 'organic-social',
    nameEs: 'Social Orgánico',
    nameEn: 'Organic Social',
    priceEs: '€225/mes',
    priceEn: '€225/mo',
    scopeEs: 'Contenido orgánico: 8 publicaciones al mes, hasta 2 plataformas, informe mensual. Sin inversión publicitaria incluida.',
    scopeEn: 'Organic content: 8 posts per month, up to 2 platforms, monthly report. No ad spend included.',
  },
]
