import type { Metadata } from 'next'
import { NegocioLocalContent } from './negocio-local-content'

export const metadata: Metadata = {
  title: 'Diseño Web y SEO Local para Negocios',
  description: 'Diseño web a medida, SEO local, Google Business y redes sociales para negocios en Sotogrande, San Roque, Gibraltar y Campo de Gibraltar. Trato directo por WhatsApp.',
  alternates: {
    canonical: '/servicios/negocio-local',
  },
  openGraph: {
    title: 'Diseño Web y SEO Local para Negocios | ImpulsoMedia',
    description: 'Diseño web a medida, SEO local y redes sociales para negocios en Sotogrande y Campo de Gibraltar.',
    url: 'https://impulsomedia.es/servicios/negocio-local',
  },
}


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://impulsomedia.es/servicios" },
    { "@type": "ListItem", "position": 3, "name": "Negocio Local", "item": "https://impulsomedia.es/servicios/negocio-local" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NegocioLocalContent />
    </>
  )
}
