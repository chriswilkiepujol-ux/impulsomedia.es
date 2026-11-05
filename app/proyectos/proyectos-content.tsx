"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { Work } from '@/components/work'
import { Reviews } from '@/components/reviews'
import { CtaBand } from '@/components/cta-band'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function ProyectosContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <Work primary />
          <Reviews />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
