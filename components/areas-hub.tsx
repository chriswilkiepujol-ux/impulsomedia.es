"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { areasFor, servicePillars, type AreaLink } from '@/lib/areas'
import { ArrowUpRight } from 'lucide-react'

/**
 * Areas hub (/zonas, /en/areas): the only place where the main site points to
 * the city landings. Each language lists only its own landings.
 */
const ZONES: { id: AreaLink['zone']; es: string; en: string }[] = [
  { id: 'campo', es: 'Campo de Gibraltar', en: 'Campo de Gibraltar' },
  { id: 'costa', es: 'Costa del Sol', en: 'Costa del Sol' },
  { id: 'sotogrande', es: 'Sotogrande', en: 'Sotogrande' },
  { id: 'gibraltar', es: 'Gibraltar', en: 'Gibraltar' },
  { id: 'sector', es: 'Sectores', en: 'Sectors' },
]

export function AreasHub({ lang }: { lang: 'es' | 'en' }) {
  const isEn = lang === 'en'
  const links = areasFor(lang)
  const groups = ZONES.map((z) => ({ ...z, links: links.filter((l) => l.zone === z.id) })).filter((g) => g.links.length)

  return (
    <LanguageProvider initialLanguage={lang}>
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          <section className="pt-[clamp(7rem,12vw,9rem)] pb-[clamp(2rem,4vw,3rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)]">
            <div className="max-w-[1200px] mx-auto">
              <span className="section-label mb-4 block">{isEn ? 'Areas we cover' : 'Zonas'}</span>
              <h1 className="font-display font-extrabold text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08] tracking-[-0.02em] mb-6 max-w-[22ch]">
                {isEn ? 'Where we work: Sotogrande, Gibraltar and the coast' : 'Dónde trabajamos: Campo de Gibraltar y Costa del Sol'}
              </h1>
              <p className="text-[1rem] md:text-[1.1rem] text-[rgba(17,20,24,0.75)] leading-[1.7] max-w-[62ch]">
                {isEn
                  ? 'We are based in Sotogrande and meet clients in person across Sotogrande, Gibraltar and the Costa del Sol. In Gibraltar we work both with international companies that operate from the Rock and with local businesses. Remote projects anywhere. These pages explain how we work in each area.'
                  : 'Estamos en Sotogrande y nos vemos en persona con negocios de todo el Campo de Gibraltar y la Costa del Sol. Para el resto de España trabajamos en remoto. En estas páginas contamos cómo trabajamos en cada zona.'}
              </p>
            </div>
          </section>

          {groups.map((g) => (
            <section key={g.id} className="py-[clamp(1.5rem,3vw,2.5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)]">
              <div className="max-w-[1200px] mx-auto">
                <h2 className="font-display font-extrabold text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.2] tracking-[-0.015em] mb-5">
                  {isEn ? g.en : g.es}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                  {g.links.map((l) => (
                    <a key={l.href} href={l.href} className="group block rounded-2xl border border-[#ece8e0] hover:border-[#c9a04a]/60 transition-colors no-underline p-4 md:p-6">
                      <h3 className="font-display font-extrabold text-[1rem] md:text-[1.1rem] leading-[1.25] text-[#111418] mb-2 flex items-start gap-1.5">
                        {isEn ? l.labelEn : l.labelEs}
                        <ArrowUpRight className="w-4 h-4 text-[#a67c2e] opacity-60 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[0.85rem] text-[rgba(17,20,24,0.7)] leading-[1.6]">{isEn ? l.descEn : l.descEs}</p>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ))}

          <section className="py-[clamp(2rem,4vw,3rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#f6f4ef] mt-8">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.3rem,2.6vw,1.8rem)] leading-[1.2] tracking-[-0.015em] mb-5">
                {isEn ? 'Our services' : 'Nuestros servicios'}
              </h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {servicePillars.map((p) => (
                  <a key={p.es} href={isEn ? p.en : p.es} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#c9a04a]/40 text-[0.85rem] text-[#111418] no-underline hover:border-[#c9a04a] hover:text-[#a67c2e] transition-colors">
                    {isEn ? p.labelEn : p.labelEs}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
