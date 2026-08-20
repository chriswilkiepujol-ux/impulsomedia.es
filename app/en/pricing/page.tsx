import type { Metadata } from 'next'
import { PreciosContent } from '../../precios/precios-content'

export const metadata: Metadata = {
  title: 'Pricing | Web Design and Digital Marketing',
  description: 'Starting prices for web design, SEO, PPC, paid social and social media. Custom proposal after a free discovery call.',
  alternates: {
    canonical: '/en/pricing',
    languages: {
      'es-ES': 'https://impulsomedia.es/precios',
      'en-GB': 'https://impulsomedia.es/en/pricing',
      'x-default': 'https://impulsomedia.es/precios',
    },
  },
  openGraph: {
    title: 'Pricing | ImpulsoMedia',
    description: 'Starting prices for web design, SEO, PPC, paid social and social media. Custom proposal after a free discovery call.',
    url: 'https://impulsomedia.es/en/pricing',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://impulsomedia.es/en/pricing" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PreciosContent lang="en" />
    </>
  )
}
