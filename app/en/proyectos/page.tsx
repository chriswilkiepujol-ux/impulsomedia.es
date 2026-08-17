import type { Metadata } from 'next'
import { ProyectosContent } from '../../proyectos/proyectos-content'

export const metadata: Metadata = {
  title: 'Projects and Clients',
  description: 'Websites built from scratch for real clients in Sotogrande, Gibraltar and beyond. Sotovet, Ágora Sotogrande, Pujol Wilkie, Racket Breaks, Nathan & Josh and OnlineGames.cat.',
  alternates: {
    canonical: '/en/proyectos',
    languages: {
      'es-ES': 'https://impulsomedia.es/proyectos',
      'en-GB': 'https://impulsomedia.es/en/proyectos',
      'x-default': 'https://impulsomedia.es/proyectos',
    },
  },
  openGraph: {
    title: 'Projects and Clients | ImpulsoMedia',
    description: 'Websites built from scratch for real clients in Sotogrande, Gibraltar and beyond.',
    url: 'https://impulsomedia.es/en/proyectos',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://impulsomedia.es/en/proyectos" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProyectosContent lang="en" />
    </>
  )
}
