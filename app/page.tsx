"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Marquee } from '@/components/marquee'
import { Work } from '@/components/work'
import { Paths } from '@/components/paths'
import { Services } from '@/components/services'
import { Reviews } from '@/components/reviews'
import { Why } from '@/components/why'
import { CtaBand } from '@/components/cta-band'
import { About } from '@/components/about'
import { Process } from '@/components/process'
import { FAQ } from '@/components/faq'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Work />
          <Paths />
          <Services />
          <Reviews />
          <Why />
          <CtaBand />
          <About />
          <Process />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
