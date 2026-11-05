"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { About } from '@/components/about'
import { Why } from '@/components/why'
import { CtaBand } from '@/components/cta-band'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function NosotrosContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <About primary />
          <Why />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
