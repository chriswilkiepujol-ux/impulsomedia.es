"use client"

import { useLanguage } from '@/lib/language-context'
import { services } from '@/lib/services-data'
import { MessageCircle, Calendar } from 'lucide-react'

interface Props {
  category: 'local' | 'performance'
}

export function ServicesByAudience({ category }: Props) {
  const { t, language } = useLanguage()
  const filtered = services.filter((s) => s.category === category)

  const isLocal = category === 'local'

  return (
    <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#f6f4ef]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="section-label mb-4 block">
            {isLocal ? t('Para Negocios Locales', 'For Local Businesses') : t('Performance A Escala', 'Performance At Scale')}
          </span>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.2] tracking-[-0.015em] mb-5">
            {isLocal
              ? t('Web, SEO y presencia local que atrae clientes', 'Web, SEO and local presence that brings in clients')
              : t('Gestión de campañas para marcas y operadores', 'Campaign management for brands and operators')}
          </h1>
          <p className="text-[rgba(17,20,24,0.84)] text-base leading-[1.7]">
            {isLocal
              ? t(
                  'Diseño web, SEO local, redes sociales y mantenimiento continuo. Trato directo, sin intermediarios, con comunicación rápida por WhatsApp.',
                  'Web design, local SEO, social media and ongoing maintenance. Direct relationship, no middlemen, fast communication over WhatsApp.'
                )
              : t(
                  'PPC, programática, afiliación, in-app, ASO y consultoría a medida. Gestión de campañas con presupuestos mayores y experiencia en sectores regulados.',
                  'PPC, programmatic, affiliate, in-app, ASO and tailored consultancy. Campaign management for larger budgets, with experience across regulated sectors.'
                )}
          </p>
        </div>

        <div className="mobile-dense grid grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-[rgba(17,20,24,0.13)] mb-8 md:mb-14">
          {filtered.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.num} className="bg-[#f6f4ef] p-6 md:p-7">
                <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#a67c2e] mb-4 block">
                  {service.num}
                </span>
                <Icon className="w-7 h-7 text-[#a67c2e] mb-4" strokeWidth={1.5} />
                <h3 className="font-display font-extrabold text-lg mb-2">
                  {language === 'es' ? service.titleEs : service.titleEn}
                </h3>
                <p className="text-[0.85rem] text-[rgba(17,20,24,0.7)] leading-[1.6]">
                  {language === 'es' ? service.descEs : service.descEn}
                </p>
              </div>
            )
          })}
        </div>

        {isLocal ? (
          <a
            href="https://wa.me/34680863229?text=Hi%2C%20I'd%20like%20to%20start%20a%20project%20with%20ImpulsoMedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25d366] text-white px-8 py-4 rounded-full font-sans font-semibold text-[0.92rem] no-underline transition-all duration-200 hover:-translate-y-[2px]"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            {t('Hablemos por WhatsApp', "Let's Talk on WhatsApp")}
          </a>
        ) : (
          <a
            href={language === 'en' ? '/en/contact' : '/contacto'}
            className="inline-flex items-center gap-3 bg-[#111418] text-[#111418] px-8 py-4 rounded-full font-sans font-semibold text-[0.92rem] no-underline transition-all duration-200 hover:-translate-y-[2px]"
          >
            <Calendar className="w-[18px] h-[18px]" />
            {t('Solicitar Una Llamada', 'Book A Call')}
          </a>
        )}
      </div>
    </section>
  )
}
