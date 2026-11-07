import type { Metadata } from 'next'
import { Privacy } from '@/components/privacy'
export const metadata: Metadata = { title: 'Política de privacidad', description: 'Qué datos recoge ImpulsoMedia, para qué los usa y cómo ejercer tus derechos.', robots: { index: false, follow: true }, alternates: { canonical: '/privacidad', languages: { 'es-ES': 'https://impulsomedia.es/privacidad', 'en-GB': 'https://impulsomedia.es/en/privacy' } } }
export default function Page() { return <Privacy lang="es" /> }
