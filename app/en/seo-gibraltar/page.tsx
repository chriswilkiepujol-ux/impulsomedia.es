import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceLanding } from '@/components/service-landing'
import { getLandingByPath } from '@/lib/landing-data'

const page = getLandingByPath('/en/seo-gibraltar')

export const metadata: Metadata = page
  ? {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: {
        canonical: page.path,
        languages: {
          'en-GB': `https://impulsomedia.es${page.path}`,
          'x-default': `https://impulsomedia.es${page.path}`,
        },
      },
      openGraph: {
        title: `${page.metaTitle} | ImpulsoMedia`,
        description: page.metaDescription,
        url: `https://impulsomedia.es${page.path}`,
        locale: 'en_GB',
      },
    }
  : {}

export default function Page() {
  if (!page) notFound()

  const url = `https://impulsomedia.es${page.path}`
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://impulsomedia.es/en' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://impulsomedia.es/en/services' },
        { '@type': 'ListItem', position: 3, name: page.breadcrumb, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.metaTitle,
      serviceType: page.serviceType,
      description: page.metaDescription,
      url,
      provider: { '@type': 'ProfessionalService', name: 'ImpulsoMedia', url: 'https://impulsomedia.es' },
      areaServed: page.areaServed.map((name) => ({ '@type': 'Place', name })),
      availableLanguage: ['English', 'Spanish'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServiceLanding page={page} />
    </>
  )
}
