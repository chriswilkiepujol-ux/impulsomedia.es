"use client"

import { useLanguage } from '@/lib/language-context'
import { Package, MessageCircle } from 'lucide-react'
import { services } from '@/lib/services-data'


export function Services() {
  const { t, language } = useLanguage()

  return (
    <section id="services" className="py-[clamp(4rem,10vw,9rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#232830]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-[clamp(3rem,6vw,5rem)] gap-6 md:gap-8">
          <div>
            <span className="section-label mb-4 md:mb-5 block">
              {t('Lo que hacemos', 'What we do')}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,4.2rem)] leading-none tracking-[-0.02em]">
              {t('Servicios que ', 'Services that ')}
              <em className="text-[#d4a853] not-italic">{t('funcionan', 'work')}</em>
            </h2>
          </div>
          <p className="max-w-[36ch] text-[rgba(242, 237, 230, 0.82)] text-base font-light leading-[1.7]">
            {t(
              'Soluciones digitales completas para hacer crecer tu negocio.',
              'Complete digital solutions to grow your business.'
            )}
          </p>
        </div>

        {/* Services Grid - 5 cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-[rgba(255,255,255,0.06)] mb-6">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <div
                key={service.num}
                className="group bg-[#232830] p-6 md:p-[clamp(2rem,4vw,3rem)] relative overflow-hidden transition-colors duration-300 hover:bg-[#2B313B]"
              >
                {/* Gold top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4a853] to-transparent scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />

                {/* Number */}
                <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#d4a853] mb-4 md:mb-6 block">
                  {service.num}
                </span>

                {/* Icon */}
                <div className="mb-4 md:mb-5">
                  <IconComponent className="w-8 h-8 text-[#d4a853]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-display font-extrabold text-[clamp(1.2rem,2.5vw,1.8rem)] tracking-[-0.01em] mb-3 leading-[1.1]">
                  {language === 'es' ? service.titleEs : service.titleEn}
                </h3>

                {/* Description */}
                <p className="text-[0.9rem] text-[rgba(242, 237, 230, 0.60)] leading-[1.7] mb-5 md:mb-6">
                  {language === 'es' ? service.descEs : service.descEn}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {(language === 'es' ? service.tagsEs : service.tagsEn).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[0.68rem] font-medium tracking-[0.08em] uppercase px-3 py-1 border border-[rgba(255,255,255,0.13)] rounded-full text-[rgba(242, 237, 230, 0.60)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
          
          {/* Highlighted Package Card */}
          <div className="group bg-gradient-to-br from-[#d4a853] to-[#b8923f] p-6 md:p-[clamp(2rem,4vw,3rem)] relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4a853]/20">
            {/* Number */}
            <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#1B1F26]/60 mb-4 md:mb-6 block">
              PACK
            </span>

            {/* Icon */}
            <div className="mb-4 md:mb-5">
              <Package className="w-8 h-8 text-[#1B1F26]" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="font-display font-extrabold text-[clamp(1.2rem,2.5vw,1.8rem)] tracking-[-0.01em] mb-3 leading-[1.1] text-[#1B1F26]">
              {language === 'es' ? 'Paquete Digital Completo' : 'Full Digital Package'}
            </h3>

            {/* Description */}
            <p className="text-[0.9rem] text-[#1B1F26]/70 leading-[1.7] mb-5 md:mb-6">
              {language === 'es' 
                ? 'Todo incluido: web, branding, redes sociales y mantenimiento. La solución completa para lanzar o renovar tu presencia digital.' 
                : 'All-inclusive: web, branding, social media and maintenance. The complete solution to launch or renew your digital presence.'}
            </p>

            {/* CTA Button */}
            <a
              href="https://wa.me/34680863229"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1B1F26] text-[#f2ede6] font-semibold text-sm tracking-wide rounded-full hover:bg-[#2B313B] transition-colors duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              {language === 'es' ? 'Solicitar info' : 'Request info'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
