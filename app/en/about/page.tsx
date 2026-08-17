import type { Metadata } from 'next'
import { NosotrosContent } from '../../nosotros/nosotros-content'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Digital agency based in Sotogrande. We build websites from scratch, no templates, with a direct relationship and fast communication over WhatsApp.',
  alternates: {
    canonical: '/en/about',
    languages: {
      'es-ES': 'https://impulsomedia.es/nosotros',
      'en-GB': 'https://impulsomedia.es/en/about',
      'x-default': 'https://impulsomedia.es/nosotros',
    },
  },
  openGraph: {
    title: 'About Us | ImpulsoMedia',
    description: 'Digital agency based in Sotogrande. We build websites from scratch, no templates, direct relationship.',
    url: 'https://impulsomedia.es/en/about',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://impulsomedia.es/en/about" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NosotrosContent lang="en" />
    </>
  )
}
