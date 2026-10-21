"use client"

import { useLanguage } from '@/lib/language-context'
import { FaqAccordion } from '@/components/faq-accordion'
import { MessageCircle, Layers, PenTool, Cog, Workflow, RefreshCw, Languages, Search, Calendar } from 'lucide-react'

/**
 * /precios · /en/pricing
 * Not a price list. Explains what drives the price of a project, gives a few
 * indicative "from" examples and sends people to the discovery call.
 */
export function PricingGuide() {
  const { t, language } = useLanguage()
  const es = language === 'es'
  const contactHref = es ? '/contacto' : '/en/contact'

  const factors = [
    { icon: Layers, es: ['Número de páginas', 'No es lo mismo una web de 4 páginas que una de 20 con secciones por servicio, zona o idioma.'], en: ['Number of pages', 'A 4-page site and a 20-page site with sections per service, area or language are different projects.'] },
    { icon: PenTool, es: ['Tipo de diseño', 'Diseño a medida desde cero, con tu marca y tus fotos, o algo más contenido partiendo de una estructura probada.'], en: ['Type of design', 'Fully custom from scratch, with your brand and photography, or a tighter build on a proven structure.'] },
    { icon: Cog, es: ['Funcionalidades', 'Reservas, tienda online, área privada, calculadoras, mapas interactivos, integraciones con tu CRM o tu software de gestión.'], en: ['Functionality', 'Bookings, e-commerce, client areas, calculators, interactive maps, integrations with your CRM or management software.'] },
    { icon: Workflow, es: ['Automatizaciones', 'Formularios que crean leads en tu CRM, publicación automática de contenido, avisos por WhatsApp, informes.'], en: ['Automations', 'Forms that create leads in your CRM, automatic content publishing, WhatsApp notifications, reporting.'] },
    { icon: RefreshCw, es: ['Web nueva o existente', 'Construir desde cero suele ser más limpio y más barato que arreglar una web antigua; migrar contenido y posicionamiento tiene su propio trabajo.'], en: ['New or existing site', 'Building from scratch is usually cleaner and cheaper than patching an old site; migrating content and rankings is its own job.'] },
    { icon: Languages, es: ['Idiomas', 'Cada idioma es contenido escrito nativo y configuración técnica para que Google muestre la versión correcta.'], en: ['Languages', 'Each language means natively written content plus the technical setup so Google serves the right version.'] },
    { icon: Search, es: ['SEO y contenido', 'Desde el SEO on page básico que incluye toda web hasta investigación de palabras clave, páginas por zona y un plan de contenidos.'], en: ['SEO and content', 'From the basic on-page SEO every site includes, to keyword research, area pages and a content plan.'] },
    { icon: Calendar, es: ['Plazos', 'Un lanzamiento en dos semanas tiene un coste distinto a uno planificado a dos meses.'], en: ['Timeline', 'A two-week launch is priced differently from one planned over two months.'] },
  ]

  const examples = [
    { es: { name: 'Web de presentación', from: 'desde 950 €', who: 'Negocio local con un servicio claro', scope: ['4-5 páginas', 'Diseño a medida', 'Móvil primero', 'Formulario y WhatsApp', 'SEO on page básico'] },
      en: { name: 'Presentation site', from: 'from €950', who: 'Local business with one clear service', scope: ['4-5 pages', 'Custom design', 'Mobile first', 'Form and WhatsApp', 'Basic on-page SEO'] } },
    { es: { name: 'Web corporativa bilingüe', from: 'desde 1.800 €', who: 'Empresa con varios servicios o zonas', scope: ['8-12 páginas en ES y EN', 'Casos de éxito y blog', 'SEO técnico completo', 'Ficha de Google', 'Dos rondas de revisión'] },
      en: { name: 'Bilingual corporate site', from: 'from €1,800', who: 'Company with several services or areas', scope: ['8-12 pages in ES and EN', 'Case studies and blog', 'Full technical SEO', 'Google Business Profile', 'Two revision rounds'] } },
    { es: { name: 'Web con reservas o tienda', from: 'desde 3.000 €', who: 'Restaurante, clínica, alquileres, comercio', scope: ['Todo lo anterior', 'Reservas o pagos online', 'Integración con tu sistema', 'Automatización de avisos', 'Formación de tu equipo'] },
      en: { name: 'Site with bookings or shop', from: 'from €3,000', who: 'Restaurant, clinic, rentals, retail', scope: ['Everything above', 'Online bookings or payments', 'Integration with your system', 'Automated notifications', 'Team training'] } },
    { es: { name: 'Proyecto a medida', from: 'presupuesto por proyecto', who: 'Operadores, grupos, plataformas, varios mercados', scope: ['Arquitectura multi-mercado', 'Áreas privadas y paneles', 'Integraciones y API', 'Compliance y legal', 'Equipo y plazos dedicados'] },
      en: { name: 'Custom project', from: 'quoted per project', who: 'Operators, groups, platforms, several markets', scope: ['Multi-market architecture', 'Client areas and dashboards', 'Integrations and APIs', 'Compliance and legal', 'Dedicated team and timeline'] } },
  ]

  const faqs = es
    ? [
        { q: '¿Por qué no publicáis una lista de precios cerrada?', a: 'Porque dos webs con el mismo número de páginas pueden costar el doble una que otra según el diseño, las integraciones y lo que tengan que conseguir. Un precio fijo obliga a encajar tu proyecto en un paquete; nosotros preferimos encajar la propuesta en tu proyecto.' },
        { q: '¿Los ejemplos son el precio final?', a: 'No. Son puntos de partida para que sepas en qué orden de magnitud te mueves. El precio definitivo va en la propuesta, por escrito, y es cerrado: lo que no está en ella no se cobra sin acordarlo antes.' },
        { q: '¿Cómo se paga?', a: 'En proyectos de web, el 50 % al empezar y el resto al publicar. En servicios mensuales (SEO, anuncios, contenido), por adelantado cada mes y sin permanencia.' },
        { q: '¿Y los servicios mensuales?', a: 'SEO, gestión de anuncios y redes se presupuestan según canales, sector, competencia e inversión publicitaria. La inversión en Google o Meta se paga aparte desde tu propia cuenta; nuestra tarifa es la gestión. En cuentas grandes, como porcentaje de la inversión.' },
        { q: '¿Qué pasa si ya tengo una web?', a: 'La vemos. Si la base es buena, trabajamos sobre ella; si es una plantilla lenta o antigua, normalmente sale más barato rehacerla que parchearla, y te lo diremos con números.' },
        { q: '¿Qué incluye la llamada de descubrimiento?', a: 'Treinta minutos gratis por WhatsApp, videollamada o en persona. Hablamos de tu negocio y de lo que necesita la web; en 48 horas recibes una propuesta con alcance, precio y plazo.' },
      ]
    : [
        { q: 'Why do you not publish a fixed price list?', a: 'Because two sites with the same number of pages can cost twice as much as each other depending on design, integrations and what they have to achieve. A fixed price forces your project into a package; we would rather fit the proposal to your project.' },
        { q: 'Are the examples the final price?', a: 'No. They are starting points so you know the order of magnitude. The final price goes in the written proposal and it is fixed: what is not in it is not charged without agreeing it first.' },
        { q: 'How do you invoice?', a: 'For websites, 50% to start and the rest at launch. For monthly services (SEO, ads, content), monthly in advance with no minimum term.' },
        { q: 'What about monthly services?', a: 'SEO, ads management and social are scoped by channels, sector, competition and media budget. Ad spend is paid directly to Google or Meta from your own account; our fee is the management. On larger accounts, as a percentage of spend.' },
        { q: 'What if I already have a website?', a: 'We look at it. If the foundations are good we build on them; if it is a slow or dated template, rebuilding is usually cheaper than patching, and we will show you the numbers.' },
        { q: 'What does the discovery call include?', a: 'Thirty free minutes on WhatsApp, video or in person. We talk through your business and what the site needs; within 48 hours you receive a proposal with scope, price and timeline.' },
      ]

  return (
    <>
      {/* Intro */}
      <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#262C37]">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[64ch]">
            <span className="section-label mb-4 block">{t('Precios', 'Pricing')}</span>
            <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.18] tracking-[-0.015em] mb-5">
              {t('Cada proyecto se presupuesta ', 'Every project is priced ')}
              <em className="text-[#d4a853] not-italic">{t('según lo que necesita.', 'on what it needs.')}</em>
            </h1>
            <p className="text-[rgba(242,237,230,0.82)] text-base leading-[1.7] mb-4">
              {t(
                'No trabajamos con tarifas fijas porque dos negocios nunca necesitan lo mismo. El precio depende del diseño, del número de páginas, de las funcionalidades y automatizaciones, de si partimos de cero o de una web existente, de los idiomas y del plazo. Más abajo tienes qué pesa en el presupuesto y unos ejemplos orientativos para situarte.',
                "We don't work with fixed rates because no two businesses need the same thing. The price depends on the design, the number of pages, the functionality and automations, whether we start from scratch or from an existing site, the languages and the timeline. Below you'll find what drives the budget and some indicative examples to place yourself."
              )}
            </p>
            <p className="text-[rgba(242,237,230,0.6)] text-sm leading-[1.7] mb-7">
              {t(
                'El precio definitivo siempre va por escrito en una propuesta cerrada, después de una llamada de descubrimiento gratuita.',
                'The final price always goes in a written, fixed proposal after a free discovery call.'
              )}
            </p>
            <a
              href="https://wa.me/34680863229?text=Hola%2C%20quiero%20una%20propuesta%20para%20mi%20proyecto"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25d366] text-white px-7 py-4 rounded-[3px] font-display font-bold text-[0.82rem] tracking-[0.07em] uppercase no-underline transition-all duration-200 hover:-translate-y-[2px]"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              {t('Pedir propuesta por WhatsApp', 'Request a proposal on WhatsApp')}
            </a>
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#2E3542]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-3">
            {t('Qué determina el precio', 'What determines the price')}
          </h2>
          <p className="text-[rgba(242,237,230,0.65)] text-sm md:text-base mb-8 md:mb-10 max-w-[60ch]">
            {t('Ocho cosas que miramos antes de poner un número.', 'Eight things we look at before putting a number down.')}
          </p>
          <div className="mobile-dense grid grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-[rgba(255,255,255,0.09)]">
            {factors.map((f, i) => {
              const Icon = f.icon
              const [title, desc] = es ? f.es : f.en
              return (
                <div key={title} className="bg-[#2E3542] p-6 md:p-7">
                  <span className="font-display text-[0.65rem] font-bold tracking-[0.2em] text-[#d4a853] mb-4 block">{String(i + 1).padStart(2, '0')}</span>
                  <Icon className="w-7 h-7 text-[#d4a853] mb-4" strokeWidth={1.5} />
                  <h3 className="font-display font-extrabold text-lg mb-2">{title}</h3>
                  <p className="text-[0.85rem] text-[rgba(242,237,230,0.60)] leading-[1.6]">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#262C37]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-3">
            {t('Ejemplos orientativos', 'Indicative examples')}
          </h2>
          <p className="text-[rgba(242,237,230,0.65)] text-sm md:text-base mb-8 md:mb-10 max-w-[64ch]">
            {t(
              'Para que sepas en qué orden de magnitud se mueve cada tipo de proyecto. Son puntos de partida, no presupuestos.',
              'So you know the order of magnitude for each type of project. Starting points, not quotes.'
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {examples.map((ex) => {
              const e = es ? ex.es : ex.en
              return (
                <div key={e.name} className="rounded-[3px] border border-[#36404E] p-5 md:p-6 flex flex-col">
                  <h3 className="font-display font-extrabold text-lg mb-1">{e.name}</h3>
                  <div className="font-display font-extrabold text-[1.35rem] text-[#d4a853] leading-none mb-2">{e.from}</div>
                  <p className="text-[0.78rem] text-[rgba(242,237,230,0.55)] mb-4">{e.who}</p>
                  <ul className="flex flex-col gap-1.5 mt-auto">
                    {e.scope.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-[0.82rem] text-[rgba(242,237,230,0.75)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] shrink-0 mt-[7px]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <p className="text-[rgba(242,237,230,0.5)] text-xs md:text-sm mt-6 max-w-[70ch]">
            {t(
              'Precios sin IVA, orientativos y sujetos al alcance final de cada propuesta. Los servicios mensuales (SEO, anuncios, contenido) se presupuestan por canales, sector e inversión.',
              'Prices exclude VAT, are indicative and subject to the final scope of each proposal. Monthly services (SEO, ads, content) are scoped by channels, sector and media budget.'
            )}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[clamp(3rem,6.5vw,5rem)] px-6 md:px-[clamp(1.5rem,5vw,4rem)] bg-[#2E3542]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display font-extrabold text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.2] tracking-[-0.015em] mb-8">
            {t('Preguntas sobre precios', 'Questions about pricing')}
          </h2>
          <div className="max-w-[820px]">
            <FaqAccordion items={faqs} />
          </div>
          <a
            href={contactHref}
            className="inline-flex items-center gap-3 mt-8 border border-[rgba(242,237,230,0.25)] text-[#f2ede6] px-7 py-4 rounded-[3px] font-display font-bold text-[0.82rem] tracking-[0.07em] uppercase no-underline transition-all duration-200 hover:border-[#d4a853] hover:text-[#d4a853]"
          >
            <Calendar className="w-[18px] h-[18px]" />
            {t('Reservar llamada de descubrimiento', 'Book a discovery call')}
          </a>
        </div>
      </section>
    </>
  )
}
