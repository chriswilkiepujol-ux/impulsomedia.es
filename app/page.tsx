import type { Metadata } from 'next'
import { HomeContent } from './home-content'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': 'https://impulsomedia.es/',
      'en-GB': 'https://impulsomedia.es/en',
      'x-default': 'https://impulsomedia.es/',
    },
  },
}

export default function Page() {
  return <HomeContent lang="es" />
}
