"use client"

import { useLanguage } from "@/lib/language-context"
import { MessageCircle } from "lucide-react"

export function CtaBand() {
  const { language } = useLanguage()

  const content = {
    en: {
      headline: "Ready to build something real?",
      subheadline: "No templates. No shortcuts. Just a website built from scratch — designed to work.",
      cta: "Let's Talk on WhatsApp"
    },
    es: {
      headline: "¿Listo para construir algo real?",
      subheadline: "Sin plantillas. Sin atajos. Solo un sitio web creado desde cero — diseñado para funcionar.",
      cta: "Hablemos por WhatsApp"
    }
  }

  const t = content[language]

  return (
    <section className="relative py-20 md:py-28 bg-[#d4a853] overflow-hidden">
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[#080808] mb-4 md:mb-6">
          {t.headline}
        </h2>
        
        <p className="text-[#080808]/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 font-sans">
          {t.subheadline}
        </p>
        
        <a
          href="https://wa.me/34680863229"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#080808] text-[#f2ede6] font-semibold text-sm md:text-base tracking-wide rounded-full hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 shadow-xl"
        >
          <MessageCircle className="w-5 h-5" />
          {t.cta}
        </a>
      </div>
    </section>
  )
}
