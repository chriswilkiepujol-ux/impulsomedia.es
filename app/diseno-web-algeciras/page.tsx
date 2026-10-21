import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceLanding } from '@/components/service-landing'
import { getLandingByPath } from '@/lib/landing-data'
import { landingMetadata, landingSchema } from '@/lib/landing-seo'

const page = getLandingByPath('/diseno-web-algeciras')

export const metadata: Metadata = page ? landingMetadata(page) : {}

export default function Page() {
  if (!page) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingSchema(page)) }} />
      <ServiceLanding page={page} />
    </>
  )
}
