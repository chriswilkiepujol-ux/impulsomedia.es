"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { Work } from '@/components/work'
import { Reviews } from '@/components/reviews'
import { CtaBand } from '@/components/cta-band'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function ProyectosContent() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main className="pt-[68px]">
          <Work />
          <Reviews />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
