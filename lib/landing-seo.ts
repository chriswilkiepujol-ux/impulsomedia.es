import type { Metadata } from 'next'
import type { LandingPage } from './landing-data'

const SITE = 'https://impulsomedia.es'

export function landingMetadata(page: LandingPage): Metadata {
  const url = `${SITE}${page.path}`
  const languages: Record<string, string> = { 'x-default': url }
  languages[page.lang === 'en' ? 'en-GB' : 'es-ES'] = url
  if (page.alternatePath) {
    languages[page.lang === 'en' ? 'es-ES' : 'en-GB'] = `${SITE}${page.alternatePath}`
  }
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: page.path, languages },
    openGraph: {
      title: `${page.metaTitle} | ImpulsoMedia`,
      description: page.metaDescription,
      url,
      locale: page.lang === 'en' ? 'en_GB' : 'es_ES',
    },
  }
}

export function landingSchema(page: LandingPage) {
  const isEn = page.lang === 'en'
  const url = `${SITE}${page.path}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Inicio', item: isEn ? `${SITE}/en` : SITE },
        { '@type': 'ListItem', position: 2, name: isEn ? 'Services' : 'Servicios', item: isEn ? `${SITE}/en/services` : `${SITE}/servicios` },
        { '@type': 'ListItem', position: 3, name: page.breadcrumb, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.metaTitle,
      serviceType: page.serviceType,
      description: page.metaDescription,
      url,
      provider: { '@type': 'ProfessionalService', '@id': `${SITE}/#business`, name: 'ImpulsoMedia', url: SITE },
      areaServed: page.areaServed.map((name) => ({ '@type': 'Place', name })),
      availableLanguage: ['Spanish', 'English'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
}
