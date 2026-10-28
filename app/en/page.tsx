import type { Metadata } from 'next'
import { HomeContent } from '../home-content'

export const metadata: Metadata = {
  title: 'Digital Agency in Sotogrande & Gibraltar',
  description: 'Bilingual digital agency in Sotogrande, 15 minutes from Gibraltar: custom web design, SEO, Google Ads and AI automation for businesses across the region.',
  alternates: {
    canonical: '/en',
    languages: {
      'es-ES': 'https://impulsomedia.es/',
      'en-GB': 'https://impulsomedia.es/en',
      'x-default': 'https://impulsomedia.es/',
    },
  },
  openGraph: {
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }],
    title: 'Digital Agency in Sotogrande & Gibraltar | ImpulsoMedia',
    description: 'Custom web design, SEO and ads for businesses in Sotogrande, Gibraltar and Campo de Gibraltar. No templates, no middlemen.',
    url: 'https://impulsomedia.es/en',
    locale: 'en_GB',
  },
}

export default function Page() {
  return <HomeContent lang="en" />
}
