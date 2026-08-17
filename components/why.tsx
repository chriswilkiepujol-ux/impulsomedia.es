"use client"

import { useLanguage } from "@/lib/language-context"
import { Check, Zap, Users, Globe2, MessageSquare, Hammer } from "lucide-react"

export function Why() {
  const { language } = useLanguage()

  const content = {
    en: {
      tag: "Why Work With Us",
      headline: "We do things differently",
      description: "ImpulsoMedia isn't a typical agency. We're selective, hands-on, and focused on building websites that actually work — not just look good.",
      reasons: [
        {
          icon: Hammer,
          title: "Built from scratch only",
          description: "We don't work on existing websites or inherited code. Every project starts from zero."
        },
        {
          icon: Users,
          title: "One point of contact",
          description: "You talk directly to the person building your site. No account managers, no middlemen."
        },
        {
          icon: Zap,
          title: "Performance-first",
          description: "Speed, SEO, and conversions are baked in from day one — not patched on later."
        },
        {
          icon: MessageSquare,
          title: "Fast communication",
          description: "WhatsApp-first workflow. Questions answered in hours, not days."
        },
        {
          icon: Globe2,
          title: "Bilingual by default",
          description: "Every site we build works seamlessly in both English and Spanish."
        }
      ],
      quote: "We build websites the way they should be built — from the ground up, with intention.",
      quoteAuthor: "ImpulsoMedia"
    },
    es: {
      tag: "Por Qué Trabajar Con Nosotros",
      headline: "Hacemos las cosas diferente",
      description: "ImpulsoMedia no es una agencia típica. Somos selectivos, prácticos y enfocados en construir sitios web que realmente funcionan — no solo que se vean bien.",
      reasons: [
        {
          icon: Hammer,
          title: "Construido desde cero",
          description: "No trabajamos en sitios web existentes o código heredado. Cada proyecto empieza desde cero."
        },
        {
          icon: Users,
          title: "Un solo punto de contacto",
          description: "Hablas directamente con quien construye tu sitio. Sin gestores de cuentas, sin intermediarios."
        },
        {
          icon: Zap,
          title: "Rendimiento primero",
          description: "Velocidad, SEO y conversiones están integrados desde el día uno — no parcheados después."
        },
        {
          icon: MessageSquare,
          title: "Comunicación rápida",
          description: "Flujo de trabajo por WhatsApp. Preguntas respondidas en horas, no días."
        },
        {
          icon: Globe2,
          title: "Bilingüe por defecto",
          description: "Cada sitio que construimos funciona perfectamente en inglés y español."
        }
      ],
      quote: "Construimos sitios web como deberían construirse — desde cero, con intención.",
      quoteAuthor: "ImpulsoMedia"
    }
  }

  const t = content[language]

  return (
    <section id="why" className="relative py-24 md:py-32 bg-[#232830]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="inline-block text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#d4a853] mb-4">
            {t.tag}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[#f2ede6] mb-6">
            {t.headline}
          </h2>
          <p className="text-[#f2ede6]/60 text-lg md:text-xl leading-relaxed font-sans">
            {t.description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          {/* Reasons List - 2 columns on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-6">
            {t.reasons.map((reason, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-6 p-4 md:p-6 rounded-xl bg-[#2B313B] border border-[#2B313B] hover:border-[#d4a853]/30 transition-colors duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#d4a853]/10 flex items-center justify-center">
                  <reason.icon className="w-4 h-4 md:w-5 md:h-5 text-[#d4a853]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm md:text-lg text-[#f2ede6] mb-1 md:mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-[#f2ede6]/60 text-xs md:text-base leading-relaxed font-sans">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote Card */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/30">
              {/* Quote mark */}
              <svg 
                className="absolute top-6 left-6 w-10 h-10 text-[#d4a853]/30"
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              
              <blockquote className="relative z-10 pt-8">
                <p className="font-display font-semibold text-xl md:text-2xl text-[#f2ede6] leading-snug mb-6">
                  {t.quote}
                </p>
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d4a853] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1B1F26]" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                  <span className="text-[#d4a853] font-semibold text-sm tracking-wide">
                    {t.quoteAuthor}
                  </span>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
