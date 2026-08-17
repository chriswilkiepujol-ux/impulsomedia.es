"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { About } from '@/components/about'
import { Why } from '@/components/why'
import { CtaBand } from '@/components/cta-band'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function NosotrosContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main className="pt-[68px]">
          <About />
          <Why />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
