"use client"

import { useLanguage } from '@/lib/language-context'

export function Marquee() {
  const { t } = useLanguage()
  
  const items = [
    t('Diseño Web', 'Web Design'),
    t('Redes Sociales', 'Social Media'),
    t('Identidad Visual', 'Visual Identity'),
    t('SEO', 'SEO'),
    t('Desarrollo', 'Development'),
    t('Estrategia Digital', 'Digital Strategy'),
    t('Conversión', 'Conversion'),
    t('Branding', 'Branding'),
  ]

  return (
    <div className="bg-[#d4a853] overflow-hidden py-[0.9rem]">
      <div className="flex w-max animate-marquee">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div 
            key={index}
            className="flex items-center gap-[1.2rem] font-display font-bold text-[0.7rem] tracking-[0.18em] uppercase text-[#0a0808] px-8 shrink-0"
          >
            <span className="w-1 h-1 rounded-full bg-[rgba(10,8,8,0.35)]" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
