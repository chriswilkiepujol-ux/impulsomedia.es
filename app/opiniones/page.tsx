import type { Metadata } from 'next'
import { OpinionesContent } from './opiniones-content'

export const metadata: Metadata = {
  title: 'Opiniones de Clientes',
  description: 'Lo que dicen nuestros clientes sobre trabajar con ImpulsoMedia. Reseñas reales de Sotovet, Ágora Sotogrande, Pujol Wilkie, Racket Breaks, Nathan & Josh y OnlineGames.cat.',
  alternates: {
    canonical: '/opiniones',
    languages: {
      'es-ES': 'https://impulsomedia.es/opiniones',
      'en-GB': 'https://impulsomedia.es/en/reviews',
      'x-default': 'https://impulsomedia.es/opiniones',
    },
  },
  openGraph: {
    title: 'Opiniones de Clientes | ImpulsoMedia',
    description: 'Lo que dicen nuestros clientes sobre trabajar con ImpulsoMedia.',
    url: 'https://impulsomedia.es/opiniones',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Opiniones", "item": "https://impulsomedia.es/opiniones" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <OpinionesContent lang="es" />
    </>
  )
}
