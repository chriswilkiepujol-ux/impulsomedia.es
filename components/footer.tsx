"use client"

import { useLanguage } from '@/lib/language-context'

export function Footer() {
  const { t, language } = useLanguage()
  const isEn = language === 'en'
  const homeHref = isEn ? '/en' : '/'
  const serviciosHref = isEn ? '/en/services' : '/servicios'
  const preciosHref = isEn ? '/en/pricing' : '/precios'
  const proyectosHref = isEn ? '/en/work' : '/proyectos'
  const contactoHref = isEn ? '/en/contact' : '/contacto'
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1B1F26] border-t border-[rgba(255,255,255,0.06)] py-[clamp(3rem,6vw,5rem)] px-[clamp(1.5rem,5vw,4rem)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-[280px]">
            <a 
              href={homeHref} 
              className="flex items-center gap-2 font-display font-extrabold text-[1.1rem] tracking-[0.12em] uppercase text-[#f2ede6] no-underline mb-3"
            >
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="#d4a853" strokeWidth="2" fill="none"/>
                <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              Impulso<em className="text-[#d4a853] not-italic">Media</em>
            </a>
            <p className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] leading-[1.6]">
              {t(
                'Agencia digital integral. Diseño web, SEO, publicidad y conversión — construido desde cero. Siempre.',
                'Full-service digital agency. Web design, SEO, paid social & conversion — built from scratch. Always.'
              )}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            {/* Services */}
            <div>
              <h6 className="font-display font-bold text-[0.72rem] tracking-[0.15em] uppercase text-[#d4a853] mb-4">
                {t('Servicios', 'Services')}
              </h6>
              <ul className="flex flex-col gap-[0.6rem]">
                <li>
                  <a href={serviciosHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Diseño Web & Desarrollo', 'Web Design & Development')}
                  </a>
                </li>
                <li>
                  <a href={serviciosHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('SEO & Posicionamiento', 'SEO & Performance')}
                  </a>
                </li>
                <li>
                  <a href={serviciosHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Publicidad & Social Ads', 'Paid Social & Ads')}
                  </a>
                </li>
                <li>
                  <a href={serviciosHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Conversión & Leads', 'Conversion & Leads')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h6 className="font-display font-bold text-[0.72rem] tracking-[0.15em] uppercase text-[#d4a853] mb-4">
                {t('Empresa', 'Company')}
              </h6>
              <ul className="flex flex-col gap-[0.6rem]">
                <li>
                  <a href={preciosHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Precios', 'Pricing')}
                  </a>
                </li>
                <li>
                  <a href={proyectosHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Trabajo', 'Work')}
                  </a>
                </li>
                <li>
                  <a href={`${serviciosHref}#process`} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Proceso', 'Process')}
                  </a>
                </li>
                <li>
                  <a href={contactoHref} className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    {t('Contacto', 'Contact')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h6 className="font-display font-bold text-[0.72rem] tracking-[0.15em] uppercase text-[#d4a853] mb-4">
                {t('Contacto', 'Contact')}
              </h6>
              <ul className="flex flex-col gap-[0.6rem]">
                <li>
                  <a href="mailto:info@impulsomedia.es" className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    info@impulsomedia.es
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/34680863229" className="text-[0.85rem] text-[rgba(242, 237, 230, 0.60)] no-underline transition-colors hover:text-[#f2ede6]">
                    +34 680 863 229
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[0.78rem] text-[rgba(242, 237, 230, 0.60)]">
            &copy; {currentYear} ImpulsoMedia. {t('Todos los derechos reservados.', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  )
}
