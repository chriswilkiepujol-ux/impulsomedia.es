import type { Metadata } from 'next'
import { ServiciosContent } from './servicios-content'

export const metadata: Metadata = {
  title: 'Servicios de Diseño Web y Marketing Digital',
  description: 'Diseño web a medida, SEO, PPC, paid social, programática, afiliación, ASO y consultoría. Servicios completos de marketing digital en Sotogrande y Campo de Gibraltar.',
  alternates: {
    canonical: '/servicios',
    languages: {
      'es-ES': 'https://impulsomedia.es/servicios',
      'en-GB': 'https://impulsomedia.es/en/servicios',
      'x-default': 'https://impulsomedia.es/servicios',
    },
  },
  openGraph: {
    title: 'Servicios de Diseño Web y Marketing Digital | ImpulsoMedia',
    description: 'Diseño web a medida, SEO, PPC, paid social, programática, afiliación, ASO y consultoría, para negocios locales y marcas a mayor escala.',
    url: 'https://impulsomedia.es/servicios',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://impulsomedia.es/servicios" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServiciosContent lang="es" />
    </>
  )
}
