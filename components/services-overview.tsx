"use client"

import { useLanguage } from '@/lib/language-context'
import { services } from '@/lib/services-data'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import Link from 'next/link'

export function ServicesOverview() {
  const { t, language } = useLanguage()

  return (
    <section id="services" className="py-[clamp(2.5rem,6vw,4.5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#2E3542]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <Reveal>
            <span className="section-label mb-3 block">
              {t('Lo que hacemos', 'What we do')}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.2] tracking-[-0.015em]">
              {t('El rango completo de ', 'The full range of ')}
              <em className="text-[#d4a853] not-italic">{t('servicios', 'services')}</em>
            </h2>
          </Reveal>
          <Link
            href={language === 'en' ? '/en/services' : '/servicios'}
            className="inline-flex items-center gap-2 text-[#d4a853] font-semibold text-sm hover:gap-3 transition-all duration-200 whitespace-nowrap"
          >
            {t('Ver todos los servicios', 'See all services')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Reveal delay={120} className="grid grid-cols-2 md:grid-cols-4 gap-[1.5px] bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.09)]">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.num}
                className="bg-[#2E3542] p-4 md:p-5 flex flex-col items-start gap-2.5 hover:bg-[#36404E] transition-colors duration-200 hover:-translate-y-0.5"
              >
                <Icon className="w-5 h-5 text-[#d4a853]" strokeWidth={1.5} />
                <span className="font-display font-bold text-[0.85rem] leading-tight">
                  {language === 'es' ? service.titleEs : service.titleEn}
                </span>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
