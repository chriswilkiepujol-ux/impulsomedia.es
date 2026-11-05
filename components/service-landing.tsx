"use client"

import { LanguageProvider } from '@/lib/language-context'
import { HeaderV2 as Header } from '@/components/v2/header'
import { FooterV2 as Footer } from '@/components/v2/sections'
import { CtaCard } from '@/components/v2/cta-card'
import { PageHero } from '@/components/v2/page'
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
      <div className="min-h-screen bg-[#ffffff]">
        <Header />
        <main>
          {/* Hero */}
          <PageHero
            eyebrow={page.label}
            title={page.h1}
            sub={page.lead}
            actions={<>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn">
                {page.cta.heroLabel ?? (isEn ? 'Free SEO check on WhatsApp' : 'Revisión gratis por WhatsApp')} <span className="arr">→</span>
              </a>
              <a href={contactHref} className="btn ghost">{isEn ? 'Book a call' : 'Reservar una llamada'}</a>
            </>}
            aside={
              <div style={{ position: 'relative' }}>
                <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden border border-[rgba(17,20,24,0.12)] shadow-[0_40px_80px_rgba(17,20,24,0.22)]">
                  <Image src={page.heroImage} alt={page.heroAlt} fill className="object-cover" sizes="(min-width: 1024px) 520px, 100vw" priority />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {page.stats.map((s) => (
                    <div key={s.label} className="widget" style={{ position: 'static', minWidth: 0, animation: 'none' }}>
                      <div className="v" style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', marginTop: 0, overflowWrap: 'anywhere' }}>{s.value}</div>
                      <div className="k" style={{ marginTop: 6, textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--body)', fontSize: 12.5, lineHeight: 1.35 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Problem / context */}
          <section className="py-[clamp(2.5rem,4.8vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#f6f4ef]">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_2fr] gap-5 md:gap-16">
              <Reveal>
                <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em]">
                  {page.problemTitle}
                </h2>
              </Reveal>
              <div className="flex flex-col gap-3 md:gap-5">
                {page.problem.map((p, i) => (
                  <Reveal key={i} delay={i * 80}>
                    <p className="text-[rgba(17,20,24,0.84)] text-[0.92rem] md:text-base leading-[1.65] md:leading-[1.75]">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="py-[clamp(2.5rem,4.8vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#ffffff]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.servicesTitle}
              </h2>
              <div className="mobile-dense grid grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-[rgba(17,20,24,0.13)]">
                {page.services.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={s.title} className="bg-[#ffffff] p-6 md:p-7">
                      <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#a67c2e] mb-4 block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Icon className="w-7 h-7 text-[#a67c2e] mb-4" strokeWidth={1.5} />
                      <h3 className="font-display font-extrabold text-lg mb-2">{s.title}</h3>
                      <p className="text-[0.85rem] text-[rgba(17,20,24,0.7)] leading-[1.6]">{s.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-[clamp(2.5rem,4.8vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#f6f4ef]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.processTitle}
              </h2>
              <ol className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 list-none p-0 m-0">
                {page.steps.map((st, i) => (
                  <Reveal key={st.num} delay={i * 80}>
                    <li className="border-t border-[#c9a04a]/40 pt-5">
                      <span className="font-display text-[0.7rem] font-bold tracking-[0.2em] text-[#a67c2e] mb-3 block">{st.num}</span>
                      <h3 className="font-display font-extrabold text-lg mb-2">{st.title}</h3>
                      <p className="text-[0.78rem] md:text-[0.88rem] text-[rgba(17,20,24,0.7)] leading-[1.55] md:leading-[1.65]">{st.desc}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          {/* Cases */}
          <section className="py-[clamp(2.5rem,4.8vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#ffffff]">
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
                    className="group block rounded-2xl border border-[#ece8e0] hover:border-[#c9a04a]/50 transition-colors no-underline overflow-hidden"
                  >
                    <div className="relative w-full aspect-[16/10] bg-[#f6f4ef] overflow-hidden">
                      <Image src={c.image} alt={`${c.name} website`} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" sizes="(min-width: 768px) 380px, 100vw" />
                    </div>
                    <div className="p-4 md:p-6">
                    <span className="text-[0.72rem] tracking-[0.15em] uppercase text-[#a67c2e] mb-2 md:mb-3 block">{c.sector}</span>
                    <h3 className="font-display font-extrabold text-xl text-[#111418] mb-2 flex items-center gap-2">
                      {c.name}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-[0.88rem] text-[rgba(17,20,24,0.7)] leading-[1.65]">{c.summary}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-[clamp(2.5rem,4.8vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#f6f4ef]">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-10">
                {page.faqTitle}
              </h2>
              <div className="max-w-[820px]">
                <FaqAccordion items={page.faqs} />
              </div>
            </div>
          </section>

          {page.related && (
            <section className="py-[clamp(2.5rem,4.8vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#ffffff] border-t border-[rgba(17,20,24,0.1)]">
              <div className="max-w-[1200px] mx-auto">
                <h2 className="font-display font-extrabold text-[clamp(1.4rem,2.8vw,2rem)] leading-[1.2] tracking-[-0.015em] mb-8">
                  {page.related.title}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
                  {page.related.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="group block rounded-2xl border border-[#ece8e0] hover:border-[#c9a04a]/60 transition-colors no-underline p-3.5 md:p-6"
                    >
                      <h3 className="font-display font-extrabold text-[0.9rem] md:text-[1.05rem] leading-[1.25] text-[#111418] mb-2 flex items-start gap-1.5">
                        {l.label}
                        <ArrowUpRight className="w-4 h-4 text-[#a67c2e] opacity-60 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-[0.76rem] md:text-[0.85rem] text-[rgba(17,20,24,0.7)] leading-[1.5] md:leading-[1.6]">{l.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          <AreasStrip exclude={page.path} />

          {/* CTA */}
          <CtaCard
            eyebrow={isEn ? 'Free review' : 'Revisión gratuita'}
            headline={page.cta.headline}
            sub={page.cta.sub}
            primaryHref={waHref}
            primaryLabel={isEn ? 'Send my URL on WhatsApp' : 'Enviar mi web por WhatsApp'}
            secondaryHref={isEn ? '/en/contact' : '/contacto'}
            secondaryLabel={isEn ? 'Book a 30-min call' : 'Reserva una llamada de 30 min'}
          />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  )
}
