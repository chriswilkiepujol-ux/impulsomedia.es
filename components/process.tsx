"use client"

import { useLanguage } from '@/lib/language-context'

const steps = [
  {
    num: '01',
    titleEs: 'Descubrimiento',
    titleEn: 'Discovery',
    descEs: 'Entendemos tu negocio, audiencia y objetivos.',
    descEn: 'We understand your business, audience and goals.',
  },
  {
    num: '02',
    titleEs: 'Diseño',
    titleEn: 'Design',
    descEs: 'Creamos una visión única para tu marca.',
    descEn: 'We create a unique vision for your brand.',
  },
  {
    num: '03',
    titleEs: 'Desarrollo',
    titleEn: 'Development',
    descEs: 'Construimos con código limpio y eficiente.',
    descEn: 'We build with clean, efficient code.',
  },
  {
    num: '04',
    titleEs: 'Lanzamiento',
    titleEn: 'Launch',
    descEs: 'Desplegamos y optimizamos continuamente.',
    descEn: 'We deploy and continuously optimize.',
  },
]

export function Process() {
  const { t, language } = useLanguage()

  return (
    <section id="process" className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,4rem)] bg-[#1B1F26]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-[clamp(3rem,6vw,5rem)]">
          <span className="section-label justify-center mb-5">
            {t('Cómo trabajamos', 'How we work')}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2.4rem,5vw,4.2rem)] leading-none tracking-[-0.02em]">
            {t('Proceso ', 'Process ')}
            <em className="text-[#d4a853] not-italic">{t('simple', 'simple')}</em>
            {t(', resultados ', ', results ')}
            <em className="text-[#d4a853] not-italic">{t('excepcionales', 'exceptional')}</em>
          </h2>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />

          {steps.map((step, index) => (
            <div key={step.num} className="p-4 md:p-[clamp(1.5rem,3vw,2.5rem)] text-center relative z-10">
              {/* Step Number */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[rgba(255,255,255,0.13)] flex items-center justify-center mx-auto mb-3 md:mb-6 font-display font-extrabold text-[0.75rem] md:text-[0.85rem] text-[#d4a853] bg-[#1B1F26]">
                {step.num}
              </div>

              {/* Title */}
              <h4 className="font-display font-bold text-sm md:text-base mb-1 md:mb-2">
                {language === 'es' ? step.titleEs : step.titleEn}
              </h4>

              {/* Description */}
              <p className="text-[0.75rem] md:text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] leading-relaxed">
                {language === 'es' ? step.descEs : step.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
