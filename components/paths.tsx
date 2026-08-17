"use client"

import { useLanguage } from "@/lib/language-context"
import { Store, TrendingUp, ArrowRight } from "lucide-react"

export function Paths() {
  const { language } = useLanguage()

  const content = {
    en: {
      tag: "Two Ways To Work Together",
      headline: "Pick the path that fits your business",
      paths: [
        {
          icon: Store,
          title: "I run a local business",
          description: "I want a professional website and to show up when people search in my area.",
          items: ["Custom web design", "Local SEO and Google Business", "Social media and content", "Ongoing maintenance"],
          cta: "See local services",
          href: "/servicios/negocio-local",
        },
        {
          icon: TrendingUp,
          title: "I want to scale campaigns",
          description: "I manage larger budgets and need a team with real performance experience.",
          items: ["PPC and programmatic", "Affiliate and in-app", "ASO and paid social", "Tailored consultancy"],
          cta: "See performance services",
          href: "/servicios/performance",
        },
      ],
    },
    es: {
      tag: "Dos Formas De Trabajar Juntos",
      headline: "Elige el camino que encaja con tu negocio",
      paths: [
        {
          icon: Store,
          title: "Tengo un negocio local",
          description: "Quiero una web profesional y aparecer cuando la gente busca en mi zona.",
          items: ["Diseño web a medida", "SEO local y Google Business", "Redes sociales y contenido", "Mantenimiento continuo"],
          cta: "Ver servicios locales",
          href: "/servicios/negocio-local",
        },
        {
          icon: TrendingUp,
          title: "Quiero escalar campañas",
          description: "Gestiono presupuestos mayores y necesito un equipo con experiencia real en resultados.",
          items: ["PPC y programática", "Afiliación e in-app", "ASO y paid social", "Consultoría a medida"],
          cta: "Ver servicios de performance",
          href: "/servicios/performance",
        },
      ],
    },
  }

  const t = content[language]

  return (
    <section id="paths" className="relative py-24 md:py-32 bg-[#1B1F26]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <span className="inline-block text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#d4a853] mb-4">
            {t.tag}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] text-[#f2ede6]">
            {t.headline}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-[1.5px] bg-[rgba(255,255,255,0.09)]">
          {t.paths.map((path, index) => (
            <div key={index} className="bg-[#232830] p-8 md:p-10">
              <div className="w-12 h-12 rounded-full border border-[#d4a853] flex items-center justify-center mb-6">
                <path.icon className="w-5 h-5 text-[#d4a853]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-[#f2ede6] mb-3">
                {path.title}
              </h3>
              <p className="text-[#f2ede6]/[0.82] text-sm md:text-base leading-relaxed mb-6">
                {path.description}
              </p>
              <ul className="mb-8">
                {path.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-[#f2ede6]/[0.82] py-3 border-t border-[rgba(255,255,255,0.09)] first:border-t-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={path.href}
                className="inline-flex items-center gap-2 text-[#d4a853] font-semibold text-sm hover:gap-3 transition-all duration-200"
              >
                {path.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
