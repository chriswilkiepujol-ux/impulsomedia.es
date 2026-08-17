"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { Contact } from '@/components/contact'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function ContactoContent() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#1B1F26]">
        <Header />
        <main className="pt-[68px]">
          <Contact />
          <FAQ />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
