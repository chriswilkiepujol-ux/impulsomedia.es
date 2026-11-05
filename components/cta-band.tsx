"use client"

import { useLanguage } from "@/lib/language-context"
import { CtaCard } from "@/components/v2/cta-card"

export function CtaBand() {
  const { language } = useLanguage()

  const content = {
    en: {
      headline: "Ready to build something real?",
      subheadline: "No templates. No shortcuts. Just a website built from scratch — designed to work.",
      cta: "Let's Talk on WhatsApp",
      secondaryLabel: "Bigger project or larger budget?",
      secondaryCta: "Book a call instead",
    },
    es: {
      headline: "¿Listo para construir algo real?",
      subheadline: "Sin plantillas. Sin atajos. Solo un sitio web creado desde cero — diseñado para funcionar.",
      cta: "Hablemos por WhatsApp",
      secondaryLabel: "¿Proyecto más grande o mayor presupuesto?",
      secondaryCta: "Reserva una llamada",
    }
  }

  const t = content[language]

  return (
    <CtaCard
      eyebrow={language === "en" ? "We start when you are ready" : "Empezamos cuando quieras"}
      headline={t.headline}
      sub={t.subheadline}
      primaryHref="https://wa.me/34680863229"
      primaryLabel={t.cta}
      secondaryHref={language === "en" ? "/en/contact" : "/contacto"}
      secondaryLabel={t.secondaryCta}
    />
  )
}
