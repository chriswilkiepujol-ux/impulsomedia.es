import type { Metadata } from 'next'
import { NosotrosContent } from './nosotros-content'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Agencia digital con sede en Sotogrande. Construimos sitios web desde cero, sin plantillas, con trato directo y comunicación rápida por WhatsApp.',
  alternates: {
    canonical: '/nosotros',
  },
  openGraph: {
    title: 'Sobre Nosotros | ImpulsoMedia',
    description: 'Agencia digital con sede en Sotogrande. Construimos sitios web desde cero, sin plantillas, con trato directo.',
    url: 'https://impulsomedia.es/nosotros',
  },
}


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Nosotros", "item": "https://impulsomedia.es/nosotros" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NosotrosContent />
    </>
  )
}
