import type { Metadata } from 'next'
import { HomeContent } from '../home-content'

export const metadata: Metadata = {
  title: 'Digital Agency in Sotogrande & Gibraltar | Web Design, SEO and PPC',
  description: 'Bilingual digital agency based in Sotogrande, 15 minutes from Gibraltar. Custom web design, local SEO, Google Ads and paid social for businesses in Sotogrande, Gibraltar, Campo de Gibraltar and the Costa del Sol.',
  alternates: {
    canonical: '/en',
    languages: {
      'es-ES': 'https://impulsomedia.es/',
      'en-GB': 'https://impulsomedia.es/en',
      'x-default': 'https://impulsomedia.es/',
    },
  },
  openGraph: {
    title: 'Digital Agency in Sotogrande & Gibraltar | ImpulsoMedia',
    description: 'Custom web design, SEO and ads for businesses in Sotogrande, Gibraltar and Campo de Gibraltar. No templates, no middlemen.',
    url: 'https://impulsomedia.es/en',
    locale: 'en_GB',
  },
}

export default function Page() {
  return <HomeContent lang="en" />
}
