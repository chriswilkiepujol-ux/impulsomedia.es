import type { Metadata } from 'next'
import { FreeAudit } from '@/components/free-audit'

export const metadata: Metadata = {
  title: 'Auditoría web gratis en 1 minuto',
  description: 'Pon tu web y en un minuto sabrás cómo la ve un cliente nuevo, si Google la entiende, si carga rápido en móvil y si mides resultados. Gratis.',
  alternates: { canonical: '/auditoria-web-gratis', languages: { 'es-ES': 'https://impulsomedia.es/auditoria-web-gratis', 'en-GB': 'https://impulsomedia.es/en/free-website-audit', 'x-default': 'https://impulsomedia.es/auditoria-web-gratis' } },
  openGraph: { images: [{ url: '/images/og-image-v2.jpg', width: 1200, height: 630, alt: 'ImpulsoMedia' }], title: 'Auditoría web gratis en 1 minuto | ImpulsoMedia', description: '¿Tu web te trae clientes o los espanta? Revisión gratis y automática: primera impresión, contacto, velocidad, SEO técnico y medición.', url: 'https://impulsomedia.es/auditoria-web-gratis' },
}
export default function Page() { return <FreeAudit lang="es" /> }
