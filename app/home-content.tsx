"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 } from '@/components/v2/header'
import { HeroV2, StripV2 } from '@/components/v2/hero'
import { FounderV2, ServicesV2, WorkV2, ProcessV2, ReviewsV2, CtaV2, FooterV2 } from '@/components/v2/sections'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './v2.css'

export function HomeContent({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="v2 min-h-screen">
        <HeaderV2 />
        <main>
          <HeroV2 />
          <StripV2 />
          <FounderV2 />
          <ServicesV2 />
          <WorkV2 />
          <ProcessV2 />
          <ReviewsV2 />
          <CtaV2 />
        </main>
        <FooterV2 />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
