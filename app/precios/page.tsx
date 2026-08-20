import type { Metadata } from 'next'
import { PreciosContent } from './precios-content'

export const metadata: Metadata = {
  title: 'Precios | Diseño Web y Marketing Digital',
  description: 'Precios orientativos para diseño web, SEO, PPC, paid social y redes sociales. Propuesta a medida tras una llamada de descubrimiento gratuita.',
  alternates: {
    canonical: '/precios',
    languages: {
      'es-ES': 'https://impulsomedia.es/precios',
      'en-GB': 'https://impulsomedia.es/en/pricing',
      'x-default': 'https://impulsomedia.es/precios',
    },
  },
  openGraph: {
    title: 'Precios | ImpulsoMedia',
    description: 'Precios orientativos para diseño web, SEO, PPC, paid social y redes sociales. Propuesta a medida tras una llamada de descubrimiento gratuita.',
    url: 'https://impulsomedia.es/precios',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Precios", "item": "https://impulsomedia.es/precios" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PreciosContent lang="es" />
    </>
  )
}
