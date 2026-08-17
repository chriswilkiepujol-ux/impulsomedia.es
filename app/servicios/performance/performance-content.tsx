"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { ServicesByAudience } from '@/components/services-by-audience'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function PerformanceContent() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main className="pt-[68px]">
          <ServicesByAudience category="performance" />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
