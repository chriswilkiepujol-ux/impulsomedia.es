import type { Metadata } from 'next'
import { FreeAudit } from '@/components/free-audit'

export const metadata: Metadata = {
  title: 'Free website audit in 1 minute',
  description: 'Enter your website and in a minute see how a new customer views it, whether Google understands it, if it loads fast on mobile and if you track results. Free.',
  alternates: { canonical: '/en/free-website-audit', languages: { 'es-ES': 'https://impulsomedia.es/auditoria-web-gratis', 'en-GB': 'https://impulsomedia.es/en/free-website-audit', 'x-default': 'https://impulsomedia.es/auditoria-web-gratis' } },
  openGraph: { images: [{ url: '/images/og-image-v2.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }], title: 'Free website audit in 1 minute | ImpulsoMedia', description: 'Does your website win customers or lose them? Free automated review: first impression, contact, speed, technical SEO and tracking.', url: 'https://impulsomedia.es/en/free-website-audit' },
}
export default function Page() { return <FreeAudit lang="en" /> }
