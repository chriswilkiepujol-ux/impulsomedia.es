"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { ServicesByAudience } from '@/components/services-by-audience'
import { Reviews } from '@/components/reviews'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { AreasStrip } from '@/components/areas-strip'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function NegocioLocalContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <ServicesByAudience category="local" />
          <AreasStrip services={['web', 'seo', 'marketing']} />
          <Reviews />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
