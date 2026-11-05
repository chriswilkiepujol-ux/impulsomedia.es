"use client"

import { useLanguage } from "@/lib/language-context"
import { Zap, Users, Globe2, MessageSquare, Hammer } from "lucide-react"
import { Reveal } from "@/components/v2/shared"

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
    <section id="why" className="section dark">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">{t.tag}</div>
          <h2 style={{ fontSize: 'clamp(32px, 4.6vw, 58px)', marginTop: 18, maxWidth: '18ch' }}>{t.headline}</h2>
          <p className="lead">{t.description}</p>
        </Reveal>
        <div className="reasons">
          <ul>
            {t.reasons.map((r) => (
              <Reveal key={r.title} as="li">
                <span className="ic"><r.icon strokeWidth={1.6} /></span>
                <div><b>{r.title}</b><span>{r.description}</span></div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="quote">
            <div className="q-mark">“</div>
            <p>{t.quote}</p>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>— {t.quoteAuthor}</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
