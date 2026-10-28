import type { Metadata } from 'next'
import { OpinionesContent } from '../../opiniones/opiniones-content'

export const metadata: Metadata = {
  title: 'Client Reviews',
  description: 'What our clients say about working with ImpulsoMedia. Real reviews from Sotovet, Ágora Sotogrande, Racket Breaks, OnlineGames.cat and more.',
  alternates: {
    canonical: '/en/reviews',
    languages: {
      'es-ES': 'https://impulsomedia.es/opiniones',
      'en-GB': 'https://impulsomedia.es/en/reviews',
      'x-default': 'https://impulsomedia.es/opiniones',
    },
  },
  openGraph: {
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }],
    title: 'Client Reviews | ImpulsoMedia',
    description: 'What our clients say about working with ImpulsoMedia.',
    url: 'https://impulsomedia.es/en/reviews',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Reviews", "item": "https://impulsomedia.es/en/reviews" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <OpinionesContent lang="en" />
    </>
  )
}
