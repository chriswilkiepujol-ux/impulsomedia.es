"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { Services } from '@/components/services'
import { CtaBand } from '@/components/cta-band'
import { FooterV2 as Footer, ProcessV2 } from '@/components/v2/sections'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function ServiciosContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <Services primary />
          <ProcessV2 />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
