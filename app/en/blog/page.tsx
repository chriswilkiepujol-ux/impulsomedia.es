import type { Metadata } from 'next'
import { BlogListingContent } from '../../blog/blog-listing-content'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on local SEO, marketing campaigns and real projects in Sotogrande, San Roque, Gibraltar and Campo de Gibraltar.',
  alternates: {
    canonical: '/en/blog',
    languages: {
      'es-ES': 'https://impulsomedia.es/blog',
      'en-GB': 'https://impulsomedia.es/en/blog',
      'x-default': 'https://impulsomedia.es/blog',
    },
  },
  openGraph: {
    title: 'Blog | ImpulsoMedia',
    description: 'Notes on local SEO, marketing campaigns and real projects.',
    url: 'https://impulsomedia.es/en/blog',
    locale: 'en_GB',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://impulsomedia.es/en" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://impulsomedia.es/en/blog" }
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogListingContent lang="en" />
    </>
  )
}
