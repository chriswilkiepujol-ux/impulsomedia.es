import type { Metadata } from 'next'
import { ServiciosContent } from '../../servicios/servicios-content'

export const metadata: Metadata = {
  title: 'Web Design and Digital Marketing Services',
  description: 'Custom web design, SEO, PPC, paid social, programmatic, affiliate, ASO and consultancy. Full digital marketing services in Sotogrande and Campo de Gibraltar.',
  alternates: {
    canonical: '/en/servicios',
    languages: {
      'es-ES': 'https://impulsomedia.es/servicios',
      'en-GB': 'https://impulsomedia.es/en/servicios',
      'x-default': 'https://impulsomedia.es/servicios',
    },
  },
  openGraph: {
    title: 'Web Design and Digital Marketing Services | ImpulsoMedia',
    description: 'Custom web design, SEO, PPC, paid social, programmatic, affiliate, ASO and consultancy, for local businesses and larger brands.',
    url: 'https://impulsomedia.es/en/servicios',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://impulsomedia.es/en/servicios" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServiciosContent lang="en" />
    </>
  )
}
