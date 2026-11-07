import type { Metadata } from 'next'
import { Privacy } from '@/components/privacy'
export const metadata: Metadata = { title: 'Privacy policy', description: 'What data ImpulsoMedia collects, what it is used for and how to exercise your rights.', robots: { index: false, follow: true }, alternates: { canonical: '/en/privacy', languages: { 'es-ES': 'https://impulsomedia.es/privacidad', 'en-GB': 'https://impulsomedia.es/en/privacy' } } }
export default function Page() { return <Privacy lang="en" /> }
