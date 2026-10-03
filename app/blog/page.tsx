import type { Metadata } from 'next'
import { BlogListingContent } from './blog-listing-content'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notas sobre SEO local, campañas de marketing y proyectos reales en Sotogrande, San Roque, Gibraltar y el Campo de Gibraltar.',
  alternates: {
    canonical: '/blog',
    languages: {
      'es-ES': 'https://impulsomedia.es/blog',
      'en-GB': 'https://impulsomedia.es/en/blog',
      'x-default': 'https://impulsomedia.es/blog',
    },
  },
  openGraph: {
    title: 'Blog | ImpulsoMedia',
    description: 'Notas sobre SEO local, campañas de marketing y proyectos reales.',
    url: 'https://impulsomedia.es/blog',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://impulsomedia.es" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://impulsomedia.es/blog" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogListingContent lang="es" />
    </>
  )
}
