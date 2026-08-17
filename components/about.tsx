"use client"

import { useLanguage } from "@/lib/language-context"
import { Hammer, Target, Handshake, Languages } from "lucide-react"

export function About() {
  const { language } = useLanguage()

  const content = {
    en: {
      tag: "About Us",
      headline: "Small team. Big standards.",
      story: [
        "ImpulsoMedia was founded on a simple belief: most websites are built wrong. They're bloated, slow, hard to update, and built on top of shaky foundations.",
        "We do things differently. Every website we build starts from scratch — no templates, no page builders, no inherited problems. Just clean code, clear strategy, and a direct line to the person doing the work.",
        "Based in Sotogrande, we serve clients across Spain, Gibraltar, and beyond. We're bilingual by default, fast by design, and selective about who we work with — because that's how we deliver results."
      ],
      values: [
        {
          icon: Hammer,
          title: "From Scratch Only",
          description: "No templates. No page builders. Every site is hand-coded for performance and flexibility."
        },
        {
          icon: Target,
          title: "Results First",
          description: "We build websites that convert visitors into customers — not just digital brochures."
        },
        {
          icon: Handshake,
          title: "Direct Relationship",
          description: "You work directly with the person building your site. No layers, no delays."
        },
        {
          icon: Languages,
          title: "Bilingual by Default",
          description: "English and Spanish built in from day one. Reach more customers, effortlessly."
        }
      ]
    },
    es: {
      tag: "Sobre Nosotros",
      headline: "Equipo pequeño. Grandes estándares.",
      story: [
        "ImpulsoMedia se fundó con una creencia simple: la mayoría de los sitios web están mal construidos. Son pesados, lentos, difíciles de actualizar y construidos sobre cimientos inestables.",
        "Hacemos las cosas diferente. Cada sitio web que construimos empieza desde cero — sin plantillas, sin constructores de páginas, sin problemas heredados. Solo código limpio, estrategia clara y línea directa con quien hace el trabajo.",
        "Con sede en Sotogrande, servimos a clientes en toda España, Gibraltar y más allá. Somos bilingües por defecto, rápidos por diseño y selectivos con quién trabajamos — porque así es como entregamos resultados."
      ],
      values: [
        {
          icon: Hammer,
          title: "Desde Cero Siempre",
          description: "Sin plantillas. Sin constructores. Cada sitio está codificado a mano para rendimiento y flexibilidad."
        },
        {
          icon: Target,
          title: "Resultados Primero",
          description: "Construimos sitios que convierten visitantes en clientes — no solo folletos digitales."
        },
        {
          icon: Handshake,
          title: "Relación Directa",
          description: "Trabajas directamente con quien construye tu sitio. Sin capas, sin retrasos."
        },
        {
          icon: Languages,
          title: "Bilingüe por Defecto",
          description: "Inglés y español integrados desde el día uno. Alcanza más clientes, sin esfuerzo."
        }
      ]
    }
  }

  const t = content[language]

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#080808]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="inline-block text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#d4a853] mb-4">
            {t.tag}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[#f2ede6] mb-8">
            {t.headline}
          </h2>
          
          {/* Story paragraphs */}
          <div className="space-y-4">
            {t.story.map((paragraph, index) => (
              <p key={index} className="text-[#f2ede6]/60 text-lg leading-relaxed font-sans">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {t.values.map((value, index) => (
            <div 
              key={index}
              className="group relative p-4 md:p-8 rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-[#d4a853]/40 transition-all duration-300"
            >
              {/* Top gold line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#d4a853] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-xl" />
              
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#d4a853]/10 flex items-center justify-center mb-3 md:mb-5">
                <value.icon className="w-4 h-4 md:w-5 md:h-5 text-[#d4a853]" />
              </div>
              
              <h3 className="font-display font-bold text-sm md:text-lg text-[#f2ede6] mb-2 md:mb-3">
                {value.title}
              </h3>
              
              <p className="text-[#f2ede6]/50 text-xs md:text-sm leading-relaxed font-sans">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
