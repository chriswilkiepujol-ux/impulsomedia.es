"use client"

import { useLanguage } from '@/lib/language-context'
import { MessageCircle, CreditCard, Repeat, Briefcase, Package, Sparkles as SparklesIcon } from 'lucide-react'
import { websitePackages, retainerServices } from '@/lib/pricing-data'

function TypeTag({ icon: Icon, label }: { icon: typeof CreditCard; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.13)] mb-5">
      <Icon className="w-3.5 h-3.5 text-[#d4a853]" strokeWidth={1.75} />
      <span className="text-[0.68rem] font-medium tracking-[0.14em] uppercase text-[rgba(242,237,230,0.60)]">
        {label}
      </span>
    </div>
  )
}

const jumpLinks = [
  { id: 'pricing-websites', es: 'Webs', en: 'Websites' },
  { id: 'pricing-recurring', es: 'Mensual', en: 'Monthly' },
  { id: 'pricing-consultancy', es: 'Consultoría', en: 'Consultancy' },
]

export function Pricing() {
  const { t, language } = useLanguage()

  return (
    <section className="py-[clamp(4rem,10vw,9rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#232830]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-10 md:mb-14 max-w-[62ch]">
          <span className="section-label mb-4 md:mb-5 block">
            {t('Precios', 'Pricing')}
          </span>
          <h2 className="font-display font-extrabold text-[clamp(2rem,5vw,4.2rem)] leading-none tracking-[-0.02em] mb-5 md:mb-6">
            {t('Precios orientativos. ', 'Starting prices. ')}
            <em className="text-[#d4a853] not-italic">
              {t('Propuesta a medida.', 'Custom proposal.')}
            </em>
          </h2>
          <p className="text-[rgba(242,237,230,0.82)] text-base font-light leading-[1.7]">
            {t(
              'Cada proyecto es diferente, por eso no aplicamos tarifas fijas para todos. Estos precios son orientativos: un punto de partida. En la llamada de descubrimiento hablamos de tu negocio, tus objetivos y lo que realmente necesitas, y a partir de ahí te preparamos una propuesta a medida.',
              "Every project is different, so we don't apply the same fixed rate to everyone. These prices are starting points, not final quotes. On the discovery call we talk through your business, your goals and what you actually need, then we build a package around that."
            )}
          </p>
          <a
            href="https://wa.me/34680863229"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 md:mt-8 px-5 py-3 bg-[#d4a853] text-[#1B1F26] font-semibold text-sm tracking-wide rounded-full hover:bg-[#e5bb66] transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            {t('Reserva tu llamada de descubrimiento', 'Book your discovery call')}
          </a>
        </div>

        {/* Sticky jump nav */}
        <nav
          aria-label={t('Ir a sección', 'Jump to section')}
          className="sticky top-[68px] z-30 -mx-6 md:-mx-[clamp(1.5rem,5vw,4rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] py-3 mb-10 md:mb-14 flex gap-6 overflow-x-auto bg-[#232830]/95 backdrop-blur-md border-y border-[rgba(255,255,255,0.06)]"
        >
          {jumpLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-[0.78rem] font-medium tracking-[0.05em] uppercase text-[rgba(242,237,230,0.55)] whitespace-nowrap no-underline transition-colors duration-200 hover:text-[#d4a853]"
            >
              {language === 'es' ? link.es : link.en}
            </a>
          ))}
        </nav>

        {/* One-time: Website Builds */}
        <div id="pricing-websites" className="mb-10 md:mb-14 scroll-mt-[130px]">
          <TypeTag icon={CreditCard} label={t('Pago único', 'One time')} />
          <div className="flex items-baseline justify-between gap-4 mb-3 md:mb-4">
            <h3 className="font-display font-bold text-[clamp(1.3rem,2.5vw,1.8rem)]">
              {t('Webs', 'Websites')}
            </h3>
            <p className="text-[0.8rem] text-[rgba(242,237,230,0.42)] hidden sm:block">
              {t('Sin cuota de setup, 12 meses de hosting incluidos', 'No setup fee, 12 months hosting included')}
            </p>
          </div>

          {/* Cuál elijo helper */}
          <div className="flex items-start gap-2.5 mb-6 md:mb-8 p-4 rounded-lg bg-[rgba(212,168,83,0.06)] border border-[rgba(212,168,83,0.15)]">
            <SparklesIcon className="w-4 h-4 text-[#d4a853] shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-[0.82rem] text-[rgba(242,237,230,0.70)] leading-[1.6]">
              <span className="font-semibold text-[#f2ede6]">{t('¿Cuál elijo? ', 'Which one? ')}</span>
              {t(
                'Si es tu primera web, empieza con Essential. Si ya sabes que vas a necesitar blog, contenido y SEO desde el día uno, Growth te ahorra tener que ampliar más adelante.',
                'If this is your first website, start with Essential. If you already know you\u2019ll need a blog, content and SEO from day one, Growth saves you upgrading later.'
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-[1.5px] bg-[rgba(255,255,255,0.06)]">
            {websitePackages.map((pkg, index) => {
              const Icon = pkg.icon
              const isFeatured = pkg.id === 'growth'
              return (
                <div
                  key={pkg.id}
                  className={
                    isFeatured
                      ? 'group bg-gradient-to-br from-[#d4a853] to-[#b8923f] p-6 md:p-[clamp(2rem,4vw,2.5rem)] relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4a853]/20'
                      : 'group bg-[#232830] p-6 md:p-[clamp(2rem,4vw,2.5rem)] relative overflow-hidden transition-colors duration-300 hover:bg-[#2B313B]'
                  }
                >
                  {!isFeatured && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4a853] to-transparent scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />
                  )}

                  <div className="flex items-center justify-between mb-5 md:mb-6">
                    <span className={`font-display text-[0.65rem] font-bold tracking-[0.2em] ${isFeatured ? 'text-[#1B1F26]/60' : 'text-[#d4a853]'}`}>
                      {isFeatured ? t('MÁS ELEGIDO', 'MOST CHOSEN') : `0${index + 1}`}
                    </span>
                    <Icon className={`w-5 h-5 ${isFeatured ? 'text-[#1B1F26]' : 'text-[#d4a853]'}`} strokeWidth={1.5} />
                  </div>

                  <h4 className={`font-display font-extrabold text-[clamp(1.1rem,2.5vw,1.4rem)] tracking-[-0.01em] mb-4 leading-[1.1] ${isFeatured ? 'text-[#1B1F26]' : ''}`}>
                    {language === 'es' ? pkg.nameEs : pkg.nameEn}
                  </h4>

                  <div className={`mb-5 pb-5 border-b ${isFeatured ? 'border-[#1B1F26]/15' : 'border-[rgba(255,255,255,0.08)]'}`}>
                    {pkg.priceFrom ? (
                      <>
                        <span className={`text-[0.68rem] font-medium tracking-[0.1em] uppercase block mb-1 ${isFeatured ? 'text-[#1B1F26]/60' : 'text-[rgba(242,237,230,0.42)]'}`}>
                          {t('Desde', 'From')}
                        </span>
                        <div className={`font-display text-[clamp(1.7rem,3.5vw,2.2rem)] font-extrabold leading-none ${isFeatured ? 'text-[#1B1F26]' : ''}`}>
                          €{pkg.priceFrom}
                        </div>
                      </>
                    ) : (
                      <div className="font-display text-[clamp(1.2rem,3vw,1.5rem)] font-extrabold leading-none text-[#d4a853]">
                        {t('Bajo consulta', 'By enquiry')}
                      </div>
                    )}
                  </div>

                  <p className={`text-[0.85rem] leading-[1.7] ${isFeatured ? 'text-[#1B1F26]/70' : 'text-[rgba(242,237,230,0.60)]'}`}>
                    {language === 'es' ? pkg.scopeEs : pkg.scopeEn}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider between one-time and recurring */}
        <div className="flex items-center gap-4 my-14 md:my-20" aria-hidden="true">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          <Repeat className="w-4 h-4 text-[#d4a853]" strokeWidth={1.75} />
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
        </div>

        {/* Recurring: Retainers */}
        <div id="pricing-recurring" className="mb-14 md:mb-20 scroll-mt-[130px]">
          <TypeTag icon={Repeat} label={t('Recurrente', 'Recurring')} />
          <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8">
            <h3 className="font-display font-bold text-[clamp(1.3rem,2.5vw,1.8rem)]">
              {t('Servicios mensuales', 'Monthly services')}
            </h3>
            <p className="text-[0.8rem] text-[rgba(242,237,230,0.42)] hidden sm:block">
              {t('Nivel de entrada, alcance final en la llamada', 'Entry tier, final scope on the call')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {retainerServices.map((svc) => {
              const Icon = svc.icon
              return (
                <div
                  key={svc.id}
                  className="bg-[#1B1F26] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 md:p-6 transition-colors duration-300 hover:border-[#d4a853]/30"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[rgba(212,168,83,0.1)] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#d4a853]" strokeWidth={1.75} />
                      </div>
                      <h4 className="font-display font-bold text-[0.95rem] md:text-base">
                        {language === 'es' ? svc.nameEs : svc.nameEn}
                      </h4>
                    </div>
                    <span className="font-display font-bold text-[0.78rem] text-[#d4a853] whitespace-nowrap text-right shrink-0 pt-1.5">
                      {language === 'es' ? svc.priceShortEs : svc.priceShortEn}
                    </span>
                  </div>
                  <p className="text-[0.82rem] text-[rgba(242,237,230,0.55)] leading-[1.65]">
                    {language === 'es' ? svc.scopeEs : svc.scopeEn}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Consultancy + Full Stack Bundle */}
        <div id="pricing-consultancy" className="grid md:grid-cols-2 gap-4 md:gap-5 scroll-mt-[130px]">
          <div className="bg-[#1B1F26] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 md:p-[clamp(2rem,4vw,2.5rem)]">
            <div className="flex items-center gap-2.5 mb-3">
              <Briefcase className="w-[18px] h-[18px] text-[#d4a853]" strokeWidth={1.75} />
              <h3 className="font-display font-extrabold text-[clamp(1.1rem,2.5vw,1.4rem)]">
                {t('Consultoría', 'Consultancy')}
              </h3>
            </div>
            <p className="text-[0.88rem] text-[rgba(242,237,230,0.60)] leading-[1.7] mb-4">
              {t(
                'Sin precios públicos. Tarifa diaria, honorarios por proyecto o asesoría mensual, estructurados según el SOW tras una llamada de scoping.',
                'No public pricing. Day rate, project fee, or advisory retainer, structured per SOW after a scoping call.'
              )}
            </p>
            <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[#d4a853]">
              {t('Bajo consulta', 'By enquiry')}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#d4a853] to-[#b8923f] rounded-xl p-6 md:p-[clamp(2rem,4vw,2.5rem)]">
            <div className="flex items-center gap-2.5 mb-3">
              <Package className="w-[18px] h-[18px] text-[#1B1F26]" strokeWidth={1.75} />
              <h3 className="font-display font-extrabold text-[clamp(1.1rem,2.5vw,1.4rem)] text-[#1B1F26]">
                {t('Pack Full Stack', 'Full Stack Bundle')}
              </h3>
            </div>
            <p className="text-[0.88rem] text-[#1B1F26]/70 leading-[1.7]">
              {t(
                'Web (Essential o Growth) más un servicio recurrente, con permanencia mínima de 6 meses: 10% de descuento en el recurrente.',
                'Website build (Essential or Growth) plus one retainer, 6 month minimum commitment: 10% off the retainer.'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
