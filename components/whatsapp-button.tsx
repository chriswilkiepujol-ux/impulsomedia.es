"use client"

import { useLanguage } from "@/lib/language-context"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const { language } = useLanguage()

  const content = {
    en: {
      label: "Chat on WhatsApp"
    },
    es: {
      label: "Chatea por WhatsApp"
    }
  }

  const t = content[language]

  return (
    <a
      href="https://wa.me/34680863229"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.label}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25d366] rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
    >
      {/* Pulse animation rings */}
      <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-25" />
      <span className="absolute inset-0 rounded-full bg-[#25d366] animate-pulse opacity-40" />
      
      {/* Icon */}
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10 fill-white" />
    </a>
  )
}
