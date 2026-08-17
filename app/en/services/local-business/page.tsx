import type { Metadata } from 'next'
import { NegocioLocalContent } from '../../../servicios/negocio-local/negocio-local-content'

export const metadata: Metadata = {
  title: 'Web Design and Local SEO for Businesses',
  description: 'Custom web design, local SEO, Google Business and social media for businesses in Sotogrande, San Roque, Gibraltar and Campo de Gibraltar. Direct contact over WhatsApp.',
  alternates: {
    canonical: '/en/services/local-business',
    languages: {
      'es-ES': 'https://impulsomedia.es/servicios/negocio-local',
      'en-GB': 'https://impulsomedia.es/en/services/local-business',
      'x-default': 'https://impulsomedia.es/servicios/negocio-local',
    },
  },
  openGraph: {
    title: 'Web Design and Local SEO for Businesses | ImpulsoMedia',
    description: 'Custom web design, local SEO and social media for businesses in Sotogrande and Campo de Gibraltar.',
    url: 'https://impulsomedia.es/en/services/local-business',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://impulsomedia.es/en/services" },
    { "@type": "ListItem", "position": 3, "name": "Local Business", "item": "https://impulsomedia.es/en/services/local-business" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NegocioLocalContent lang="en" />
    </>
  )
}
