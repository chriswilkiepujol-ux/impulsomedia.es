import type { Metadata } from 'next'
import { HomeContent } from '../home-content'

export const metadata: Metadata = {
  title: 'ImpulsoMedia | Web Design and Digital Marketing in Spain',
  description: 'Digital agency specialised in web design, SEO, PPC, paid social, programmatic, affiliate and consultancy. We build websites from scratch for local businesses and larger brands.',
  alternates: {
    canonical: '/en',
    languages: {
      'es-ES': 'https://impulsomedia.es/',
      'en-GB': 'https://impulsomedia.es/en',
      'x-default': 'https://impulsomedia.es/',
    },
  },
  openGraph: {
    title: 'ImpulsoMedia | Web Design and Digital Marketing in Spain',
    description: 'We build websites from scratch for local businesses and larger brands. No templates, no middlemen.',
    url: 'https://impulsomedia.es/en',
    locale: 'en_GB',
  },
}

export default function Page() {
  return <HomeContent lang="en" />
}
