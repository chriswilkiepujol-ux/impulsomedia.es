"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { PricingGuide } from '@/components/pricing-guide'
import { Process } from '@/components/process'
import { CtaBand } from '@/components/cta-band'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function PreciosContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#262C37]">
        <Header />
        <main className="pt-[68px]">
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
