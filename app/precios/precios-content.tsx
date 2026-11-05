"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { PricingGuide } from '@/components/pricing-guide'
import { Process } from '@/components/process'
import { CtaBand } from '@/components/cta-band'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function PreciosContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <PricingGuide />
          <Process />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
