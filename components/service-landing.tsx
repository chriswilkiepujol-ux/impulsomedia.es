"use client"

import { LanguageProvider } from '@/lib/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Reveal } from '@/components/reveal'
import Image from 'next/image'
import { FaqAccordion } from '@/components/faq-accordion'
import { AreasStrip } from '@/components/areas-strip'
import { MessageCircle, Calendar, ArrowUpRight } from 'lucide-react'
import { getLandingByPath } from '@/lib/landing-data'

const WA = 'https://wa.me/34680863229'

/**
 * Template for the city × service landing pages (/en/seo-gibraltar,
 * /diseno-web-algeciras, …). All copy comes from lib/landing-data.ts so each
 * page stays unique; this file only owns the layout.
 */
export function ServiceLanding({ path }: { path: string }) {
  // Looked up here (client side) rather than passed as a prop: the entries
  // hold icon components, and functions can't cross the server→client boundary.
  const page = getLandingByPath(path)
  if (!page) return null
  const isEn = page.lang === 'en'
  const contactHref = isEn ? '/en/contact' : '/contacto'
  const waHref = `${WA}?text=${encodeURIComponent(page.cta.whatsappText)}`

  return (
    <LanguageProvider initialLanguage={page.lang}>
      <div className="min-h-screen bg-[#262C37]">
        <Header />
        <main className="pt-[68px]">
          {/* Hero */}
          <section className="py-[clamp(3.5rem,8vw,6.5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#262C37]">
            <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center">
              <div className="max-w-3xl">
                <span className="section-label mb-4 block">{page.label}</span>
                <h1 className="font-display font-extrabold text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.12] tracking-[-0.02em] mb-6">
                  {page.h1}
                </h1>
                <p className="text-[rgba(242,237,230,0.82)] text-[0.95rem] md:text-lg leading-[1.65] md:leading-[1.7] mb-6 md:mb-8">
                  {page.lead}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25d366] text-white px-7 py-4 rounded-[3px] font-display font-bold text-[0.82rem] tracking-[0.07em] uppercase no-underline transition-all duration-200 hover:-translate-y-[2px]"
                  >
                    <MessageCircle className="w-[18px] h-[18px]" />
                    {isEn ? 'Free SEO check on WhatsApp' : 'Revisión gratis por WhatsApp'}
                  </a>
                  <a
                    href={contactHref}
                    className="inline-flex items-center gap-3 border border-[rgba(242,237,230,0.25)] text-[#f2ede6] px-7 py-4 rounded-[3px] font-display font-bold text-[0.82rem] tracking-[0.07em] uppercase no-underline transition-all duration-200 hover:border-[#d4a853] hover:text-[#d4a853]"
                  >
                    <Calendar className="w-[18px] h-[18px]" />
                    {isEn ? 'Book a call' : 'Reservar una llamada'}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-5 md:gap-6">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <Image src={page.heroImage} alt={page.heroAlt} fill className="object-cover" sizes="(min-width: 1024px) 560px, 100vw" priority />
                </div>
                <div className="grid grid-cols-3 gap-[1.5px] bg-[rgba(255,255,255,0.09)]">
                  {page.stats.map((s) => (
                    <div key={s.label} className="bg-[#262C37] p-3 md:p-5">
                      <div className="font-display font-extrabold text-[clamp(1.2rem,2.6vw,1.7rem)] text-[#d4a853] leading-none mb-2">{s.value}</div>
                      <div className="text-[0.7rem] md:text-[0.78rem] text-[rgba(242,237,230,0.6)] leading-[1.4]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Problem / context */}
          <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#2E3542]">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_2fr] gap-5 md:gap-16">
              <Reveal>
                <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em]">
                  {page.problemTitle}
                </h2>
              </Reveal>
              <div className="flex flex-col gap-3 md:gap-5">
                {page.problem.map((p, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <p className="text-[rgba(242,237,230,0.82)] text-[0.92rem] md:text-base leading-[1.65] md:leading-[1.75]">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#262C37]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.servicesTitle}
              </h2>
              <div className="mobile-dense grid grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-[rgba(255,255,255,0.09)]">
                {page.services.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={s.title} className="bg-[#262C37] p-6 md:p-7">
                      <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#d4a853] mb-4 block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon className="w-7 h-7 text-[#d4a853] mb-4" strokeWidth={1.5} />
                      <h3 className="font-display font-extrabold text-lg mb-2">{s.title}</h3>
                      <p className="text-[0.85rem] text-[rgba(242,237,230,0.60)] leading-[1.6]">{s.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#2E3542]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.processTitle}
              </h2>
              <ol className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 list-none p-0 m-0">
                {page.steps.map((st, i) => (
                  <Reveal key={st.num} delay={i * 80}>
                    <li className="border-t border-[#d4a853]/40 pt-5">
                      <span className="font-display text-[0.7rem] font-bold tracking-[0.2em] text-[#d4a853] mb-3 block">{st.num}</span>
                      <h3 className="font-display font-extrabold text-lg mb-2">{st.title}</h3>
                      <p className="text-[0.78rem] md:text-[0.88rem] text-[rgba(242,237,230,0.65)] leading-[1.55] md:leading-[1.65]">{st.desc}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          {/* Cases */}
          <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#262C37]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.casesTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                {page.cases.map((c) => (
                  <a
                    key={c.name}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-[3px] border border-[#36404E] hover:border-[#d4a853]/50 transition-colors no-underline overflow-hidden"
                  >
                    <div className="relative w-full aspect-[16/10] bg-[#1D212A] overflow-hidden">
                      <Image src={c.image} alt={`${c.name} website`} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" sizes="(min-width: 768px) 380px, 100vw" />
                    </div>
                    <div className="p-4 md:p-6">
                    <span className="text-[0.72rem] tracking-[0.15em] uppercase text-[#d4a853] mb-2 md:mb-3 block">{c.sector}</span>
                    <h3 className="font-display font-extrabold text-xl text-[#f2ede6] mb-2 flex items-center gap-2">
                      {c.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-[0.88rem] text-[rgba(242,237,230,0.65)] leading-[1.65]">{c.summary}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#2E3542]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.faqTitle}
              </h2>
              <div className="max-w-[820px]">
                <FaqAccordion items={page.faqs} />
              </div>
            </div>
          </section>

          <AreasStrip exclude={page.path} />

          {/* CTA */}
          <section className="py-14 md:py-20 px-6 bg-[#d4a853]">
            <div className="max-w-[900px] mx-auto text-center">
              <h2 className="font-display font-extrabold text-[clamp(1.8rem,3.8vw,2.6rem)] leading-[1.22] text-[#262C37] mb-4">
                {page.cta.headline}
              </h2>
              <p className="text-[#262C37]/80 text-lg max-w-2xl mx-auto mb-8">{page.cta.sub}</p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#262C37] text-[#f2ede6] font-semibold text-sm md:text-base tracking-wide rounded-full hover:bg-[#36404E] transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                {isEn ? 'Send my URL on WhatsApp' : 'Enviar mi web por WhatsApp'}
              </a>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
