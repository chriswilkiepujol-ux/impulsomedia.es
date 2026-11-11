"use client"

import { useLanguage } from '@/lib/language-context'
import { areasFor, areasHubPath, servicePillars, type AreaLink } from '@/lib/areas'
import { ArrowRight } from 'lucide-react'

/**
 * Compact strip shown ONLY on the city × service landings: links to the
 * service pillars and to the other landings in the same language, plus the
 * areas hub. Main-menu pages and blog posts must not render it (Chris, 10 nov 2026).
 */
export function AreasStrip({ services, exclude }: { services?: AreaLink['service'][]; exclude?: string }) {
  const { language, t } = useLanguage()
  const links = areasFor(language, services).filter((a) => a.href !== exclude)
  if (!links.length) return null

  return (
    <section className="py-8 md:py-12 px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#ffffff] border-t border-[rgba(17,20,24,0.1)]">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label mb-4 block">{t('Servicios', 'Services')}</span>
        <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
          {servicePillars.filter((p) => p.es !== exclude && p.en !== exclude).map((p) => (
            <a
              key={p.es}
              href={language === 'es' ? p.es : p.en}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#c9a04a]/40 text-[0.78rem] md:text-[0.85rem] text-[#111418] no-underline hover:border-[#c9a04a] hover:text-[#a67c2e] transition-colors"
            >
              {language === 'es' ? p.labelEs : p.labelEn}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
        <span className="section-label mb-4 block">{t('Dónde trabajamos', 'Where we work')}</span>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {links.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[rgba(17,20,24,0.17)] text-[0.78rem] md:text-[0.85rem] text-[rgba(17,20,24,0.84)] no-underline hover:border-[#c9a04a] hover:text-[#a67c2e] transition-colors"
            >
              {language === 'es' ? a.labelEs : a.labelEn}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ))}
          <a
            href={areasHubPath(language)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-[0.78rem] md:text-[0.85rem] text-[#a67c2e] no-underline hover:underline"
          >
            {t('Todas las zonas', 'All areas')}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
