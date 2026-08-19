"use client"

import { useLanguage } from '@/lib/language-context'
import { MessageCircle } from 'lucide-react'
import { websitePackages, retainerServices } from '@/lib/pricing-data'

export function Pricing() {
  const { t, language } = useLanguage()

  return (
    <section id="pricing" className="py-[clamp(4rem,10vw,9rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#232830]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-[clamp(3rem,6vw,5rem)] max-w-[62ch]">
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

        {/* Website Builds */}
        <div className="mb-14 md:mb-20">
          <h3 className="font-display font-bold text-[clamp(1.3rem,2.5vw,1.8rem)] mb-2">
            {t('Webs', 'Websites')}
          </h3>
          <p className="text-[0.85rem] text-[rgba(242,237,230,0.60)] mb-6 md:mb-8">
            {t('Pago único. Sin cuota de setup. 12 meses de hosting incluidos.', 'One time payment. No setup fee. 12 months hosting included.')}
          </p>
          <div className="grid md:grid-cols-3 gap-[1.5px] bg-[rgba(255,255,255,0.06)]">
            {websitePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#232830] p-6 md:p-[clamp(2rem,4vw,2.5rem)]"
              >
                <h4 className="font-display font-extrabold text-[clamp(1.1rem,2.5vw,1.5rem)] tracking-[-0.01em] mb-2 leading-[1.1]">
                  {language === 'es' ? pkg.nameEs : pkg.nameEn}
                </h4>
                <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[#d4a853] mb-4">
                  {pkg.priceFrom
                    ? `${t('Desde', 'From')} €${pkg.priceFrom}`
                    : t('Bajo consulta', 'By enquiry')}
                </p>
                <p className="text-[0.88rem] text-[rgba(242,237,230,0.60)] leading-[1.7]">
                  {language === 'es' ? pkg.scopeEs : pkg.scopeEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Retainers */}
        <div className="mb-14 md:mb-20">
          <h3 className="font-display font-bold text-[clamp(1.3rem,2.5vw,1.8rem)] mb-2">
            {t('Servicios recurrentes', 'Ongoing services')}
          </h3>
          <p className="text-[0.85rem] text-[rgba(242,237,230,0.60)] mb-6 md:mb-8">
            {t(
              'Las cantidades mostradas son el nivel de entrada. El alcance final se confirma en la llamada.',
              'The quantities shown are the entry tier. Final scope is confirmed on the call.'
            )}
          </p>
          <div className="flex flex-col gap-[1.5px] bg-[rgba(255,255,255,0.06)]">
            {retainerServices.map((svc) => (
              <div
                key={svc.id}
                className="bg-[#232830] p-6 md:p-[clamp(2rem,4vw,2.5rem)] grid md:grid-cols-[1fr,1.3fr,2fr] gap-2 md:gap-8 items-start"
              >
                <h4 className="font-display font-extrabold text-[clamp(1.05rem,2.5vw,1.3rem)] tracking-[-0.01em]">
                  {language === 'es' ? svc.nameEs : svc.nameEn}
                </h4>
                <p className="text-[0.78rem] font-medium tracking-[0.05em] text-[#d4a853]">
                  {language === 'es' ? svc.priceEs : svc.priceEn}
                </p>
                <p className="text-[0.88rem] text-[rgba(242,237,230,0.60)] leading-[1.7]">
                  {language === 'es' ? svc.scopeEs : svc.scopeEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Consultancy + Full Stack Bundle */}
        <div className="grid md:grid-cols-2 gap-[1.5px] bg-[rgba(255,255,255,0.06)]">
          <div className="bg-[#232830] p-6 md:p-[clamp(2rem,4vw,2.5rem)]">
            <h3 className="font-display font-extrabold text-[clamp(1.2rem,2.5vw,1.6rem)] mb-3">
              {t('Consultoría', 'Consultancy')}
            </h3>
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
          <div className="bg-gradient-to-br from-[#d4a853] to-[#b8923f] p-6 md:p-[clamp(2rem,4vw,2.5rem)]">
            <h3 className="font-display font-extrabold text-[clamp(1.2rem,2.5vw,1.6rem)] mb-3 text-[#1B1F26]">
              {t('Pack Full Stack', 'Full Stack Bundle')}
            </h3>
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
