"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { ServicesByAudience } from '@/components/services-by-audience'
import { Reviews } from '@/components/reviews'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function NegocioLocalContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main className="pt-[68px]">
          <ServicesByAudience category="local" />
          <Reviews />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
