import type { Metadata } from 'next'
import { AreasHub } from '@/components/areas-hub'
import { areasFor } from '@/lib/areas'

const SITE = 'https://impulsomedia.es'
const url = `${SITE}/zonas`

export const metadata: Metadata = {
  title: 'Zonas: Campo de Gibraltar y Costa del Sol',
  description: 'Dónde trabajamos: Sotogrande, San Roque, Algeciras, La Línea y Estepona. Diseño web, SEO y marketing digital con trato en persona en la zona.',
  alternates: {
    canonical: '/zonas',
    languages: { 'es-ES': `${SITE}/zonas`, 'en-GB': `${SITE}/en/areas`, 'x-default': `${SITE}/zonas` },
  },
  openGraph: {
    title: 'Zonas: Campo de Gibraltar y Costa del Sol | ImpulsoMedia',
    description: 'Dónde trabajamos: Sotogrande, San Roque, Algeciras, La Línea y Estepona. Diseño web, SEO y marketing digital con trato en persona en la zona.',
    url,
    locale: 'es_ES',
    siteName: 'ImpulsoMedia',
    type: 'website',
    images: [{ url: '/images/og-image-v2.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }],
  },
  twitter: { card: 'summary_large_image', title: 'Zonas: Campo de Gibraltar y Costa del Sol | ImpulsoMedia', description: 'Dónde trabajamos: Sotogrande, San Roque, Algeciras, La Línea y Estepona. Diseño web, SEO y marketing digital con trato en persona en la zona.', images: ['/images/og-image-v2.jpg'] },
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}` },
        { '@type': 'ListItem', position: 2, name: 'Zonas donde trabajamos', item: url },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Zonas donde trabajamos',
      itemListElement: areasFor('es').map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.labelEs, url: `${SITE}${a.href}` })),
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AreasHub lang="es" />
    </>
  )
}
