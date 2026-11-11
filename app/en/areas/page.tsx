import type { Metadata } from 'next'
import { AreasHub } from '@/components/areas-hub'
import { areasFor } from '@/lib/areas'

const SITE = 'https://impulsomedia.es'
const url = `${SITE}/en/areas`

export const metadata: Metadata = {
  title: 'Areas we cover: Sotogrande and Gibraltar',
  description: 'Where we work: Sotogrande, Gibraltar and the Costa del Sol. Web design, SEO and digital marketing, with in-person meetings across the area.',
  alternates: {
    canonical: '/en/areas',
    languages: { 'es-ES': `${SITE}/zonas`, 'en-GB': `${SITE}/en/areas`, 'x-default': `${SITE}/zonas` },
  },
  openGraph: {
    title: 'Areas we cover: Sotogrande and Gibraltar | ImpulsoMedia',
    description: 'Where we work: Sotogrande, Gibraltar and the Costa del Sol. Web design, SEO and digital marketing, with in-person meetings across the area.',
    url,
    locale: 'en_GB',
    siteName: 'ImpulsoMedia',
    type: 'website',
    images: [{ url: '/images/og-image-v2.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }],
  },
  twitter: { card: 'summary_large_image', title: 'Areas we cover: Sotogrande and Gibraltar | ImpulsoMedia', description: 'Where we work: Sotogrande, Gibraltar and the Costa del Sol. Web design, SEO and digital marketing, with in-person meetings across the area.', images: ['/images/og-image-v2.jpg'] },
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/en` },
        { '@type': 'ListItem', position: 2, name: 'Areas we cover', item: url },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'Areas we cover',
      itemListElement: areasFor('en').map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.labelEn, url: `${SITE}${a.href}` })),
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AreasHub lang="en" />
    </>
  )
}
