import type { Metadata } from 'next'
import { PerformanceContent } from './performance-content'

export const metadata: Metadata = {
  title: 'Gestión de Campañas y Media Buying a Escala',
  description: 'PPC, programática, afiliación, in-app, ASO y consultoría para marcas y operadores que necesitan gestionar campañas de marketing digital a mayor escala.',
  alternates: {
    canonical: '/servicios/performance',
  },
  openGraph: {
    title: 'Gestión de Campañas y Media Buying a Escala | ImpulsoMedia',
    description: 'PPC, programática, afiliación, in-app, ASO y consultoría para marcas y operadores con presupuestos mayores.',
    url: 'https://impulsomedia.es/servicios/performance',
  },
}


const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://impulsomedia.es/servicios" },
    { "@type": "ListItem", "position": 3, "name": "Performance", "item": "https://impulsomedia.es/servicios/performance" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PerformanceContent />
    </>
  )
}
