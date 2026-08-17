"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Marquee } from '@/components/marquee'
import { ServicesOverview } from '@/components/services-overview'
import { WorkCarousel } from '@/components/work-carousel'
import { Paths } from '@/components/paths'
import { Reviews } from '@/components/reviews'
import { CtaBand } from '@/components/cta-band'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function HomeContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <ServicesOverview />
          <WorkCarousel />
          <Paths />
          <Reviews />
          <CtaBand />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
