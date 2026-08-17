import type { Metadata } from 'next'
import { PerformanceContent } from '../../../servicios/performance/performance-content'

export const metadata: Metadata = {
  title: 'Campaign Management and Media Buying at Scale',
  description: 'PPC, programmatic, affiliate, in-app, ASO and consultancy for brands and operators that need to manage digital marketing campaigns at a larger scale.',
  alternates: {
    canonical: '/en/services/performance',
    languages: {
      'es-ES': 'https://impulsomedia.es/servicios/performance',
      'en-GB': 'https://impulsomedia.es/en/services/performance',
      'x-default': 'https://impulsomedia.es/servicios/performance',
    },
  },
  openGraph: {
    title: 'Campaign Management and Media Buying at Scale | ImpulsoMedia',
    description: 'PPC, programmatic, affiliate, in-app, ASO and consultancy for brands and operators with larger budgets.',
    url: 'https://impulsomedia.es/en/services/performance',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://impulsomedia.es/en/services" },
    { "@type": "ListItem", "position": 3, "name": "Performance", "item": "https://impulsomedia.es/en/services/performance" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PerformanceContent lang="en" />
    </>
  )
}
