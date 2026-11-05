"use client"

import { useLanguage } from "@/lib/language-context"
import { Store, TrendingUp, MessageCircle, Calendar } from "lucide-react"
import { esToEn } from "@/lib/route-map"
import { Reveal } from "@/components/reveal"

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
          style: "whatsapp" as const,
        },
        {
          icon: TrendingUp,
          title: "I want to scale campaigns",
          description: "I manage larger budgets and need a team with real performance experience.",
          items: ["PPC and programmatic", "Affiliate and in-app", "ASO and paid social", "Tailored consultancy"],
          cta: "See performance services",
          href: "/servicios/performance",
          style: "formal" as const,
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
          style: "whatsapp" as const,
        },
        {
          icon: TrendingUp,
          title: "Quiero escalar campañas",
          description: "Gestiono presupuestos mayores y necesito un equipo con experiencia real en resultados.",
          items: ["PPC y programática", "Afiliación e in-app", "ASO y paid social", "Consultoría a medida"],
          cta: "Ver servicios de performance",
          href: "/servicios/performance",
          style: "formal" as const,
        },
      ],
    },
  }

  const t = content[language]

  return (
    <section id="paths" className="relative py-10 md:py-14 bg-[#ffffff]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <Reveal className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="inline-block text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#a67c2e] mb-4">
            {t.tag}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.8vw,2.6rem)] leading-[1.22] text-[#111418]">
            {t.headline}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-[1.5px] bg-[rgba(17,20,24,0.13)]">
          {t.paths.map((path, index) => (
            <div key={index} className="bg-[#f6f4ef] p-4 md:p-10 flex flex-col">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-[#c9a04a] flex items-center justify-center mb-4 md:mb-6">
                <path.icon className="w-5 h-5 text-[#a67c2e]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-bold text-base md:text-2xl text-[#111418] mb-2 md:mb-3">
                {path.title}
              </h3>
              <p className="text-[#111418]/[0.82] text-xs md:text-base leading-relaxed mb-4 md:mb-6">
                {path.description}
              </p>
              <ul className="mb-5 md:mb-8">
                {path.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#111418]/[0.82] py-2 md:py-3 border-t border-[rgba(17,20,24,0.13)] first:border-t-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a04a] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {path.style === "whatsapp" ? (
                  <a
                    href={language === 'en' ? esToEn[path.href] : path.href}
                    className="inline-flex w-full md:w-auto justify-center items-center gap-2 bg-[#25d366] text-white px-3 py-2.5 md:px-5 md:py-3 rounded-full font-sans font-semibold text-[0.68rem] md:text-[0.78rem] no-underline transition-all duration-200 hover:-translate-y-[1px]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {path.cta}
                  </a>
                ) : (
                  <a
                    href={language === 'en' ? esToEn[path.href] : path.href}
                    className="inline-flex w-full md:w-auto justify-center items-center gap-2 border border-[#c9a04a] text-[#a67c2e] px-3 py-2.5 md:px-5 md:py-3 rounded-full font-sans font-semibold text-[0.68rem] md:text-[0.78rem] no-underline transition-all duration-200 hover:bg-[#c9a04a] hover:text-[#1a1408]"
                  >
                    <Calendar className="w-4 h-4" />
                    {path.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
