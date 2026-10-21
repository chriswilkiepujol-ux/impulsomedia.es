"use client"

import { useLanguage } from '@/lib/language-context'
import { areasFor, type AreaLink } from '@/lib/areas'
import { ArrowRight } from 'lucide-react'

/**
 * Compact "where we work" strip with links to the city × service landings.
 * Used on service pages and under blog posts so the landings get internal
 * links from pages that already have authority, not only from the footer.
 */
export function AreasStrip({ services, exclude }: { services?: AreaLink['service'][]; exclude?: string }) {
  const { language, t } = useLanguage()
  const links = areasFor(language, services).filter((a) => a.href !== exclude)
  if (!links.length) return null

  return (
    <section className="py-8 md:py-12 px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#262C37] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label mb-4 block">{t('Dónde trabajamos', 'Where we work')}</span>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {links.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[rgba(255,255,255,0.13)] text-[0.78rem] md:text-[0.85rem] text-[rgba(242,237,230,0.75)] no-underline hover:border-[#d4a853] hover:text-[#d4a853] transition-colors"
            >
              {language === 'es' ? a.labelEs : a.labelEn}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
