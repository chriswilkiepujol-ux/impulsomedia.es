import type { Metadata } from 'next'
import { ProyectosContent } from './proyectos-content'

export const metadata: Metadata = {
  title: 'Proyectos y Clientes',
  description: 'Sitios web construidos desde cero para clientes reales en Sotogrande, Gibraltar y más allá. Sotovet, Ágora Sotogrande, Pujol Wilkie, Racket Breaks, Nathan & Josh y OnlineGames.cat.',
  alternates: {
    canonical: '/proyectos',
  },
  openGraph: {
    title: 'Proyectos y Clientes | ImpulsoMedia',
    description: 'Sitios web construidos desde cero para clientes reales en Sotogrande, Gibraltar y más allá.',
    url: 'https://impulsomedia.es/proyectos',
  },
}


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Proyectos", "item": "https://impulsomedia.es/proyectos" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProyectosContent />
    </>
  )
}
