"use client"

import { useLanguage } from '@/lib/language-context'
import { FaqAccordion } from '@/components/faq-accordion'
import { PageHero, SectionHead, WidgetStack } from '@/components/v2/page'
import { Reveal } from '@/components/v2/shared'
import { Layers, PenTool, Cog, Workflow, RefreshCw, Languages, Search, Calendar } from 'lucide-react'

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
    { icon: RefreshCw, es: ['Web nueva o existente', 'Podemos partir de cero o mejorar la web que ya tienes; cada opción tiene un alcance distinto y te explicamos cuál compensa más.'], en: ['New or existing site', 'We can start from scratch or improve the site you already have; each option has a different scope and we explain which one pays off.'] },
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
        { q: '¿Qué pasa si ya tengo una web?', a: 'Trabajamos sobre ella sin problema: mejoras, nuevas secciones, SEO o velocidad. Si vemos que algo compensa rehacerlo, te lo proponemos con números y tú decides.' },
        { q: '¿Qué incluye la llamada de descubrimiento?', a: 'Treinta minutos gratis por WhatsApp, videollamada o en persona. Hablamos de tu negocio y de lo que necesita la web; en 48 horas recibes una propuesta con alcance, precio y plazo.' },
      ]
    : [
        { q: 'Why do you not publish a fixed price list?', a: 'Because two sites with the same number of pages can cost twice as much as each other depending on design, integrations and what they have to achieve. A fixed price forces your project into a package; we would rather fit the proposal to your project.' },
        { q: 'Are the examples the final price?', a: 'No. They are starting points so you know the order of magnitude. The final price goes in the written proposal and it is fixed: what is not in it is not charged without agreeing it first.' },
        { q: 'How do you invoice?', a: 'For websites, 50% to start and the rest at launch. For monthly services (SEO, ads, content), monthly in advance with no minimum term.' },
        { q: 'What about monthly services?', a: 'SEO, ads management and social are scoped by channels, sector, competition and media budget. Ad spend is paid directly to Google or Meta from your own account; our fee is the management. On larger accounts, as a percentage of spend.' },
        { q: 'What if I already have a website?', a: 'We work on it, no problem: improvements, new sections, SEO or speed. If we think part of it is worth rebuilding, we propose it with numbers and you decide.' },
        { q: 'What does the discovery call include?', a: 'Thirty free minutes on WhatsApp, video or in person. We talk through your business and what the site needs; within 48 hours you receive a proposal with scope, price and timeline.' },
      ]

  const featIdx = 3
  return (
    <>
      <PageHero
        eyebrow={t('Precios', 'Pricing')}
        title={<>{t('Cada proyecto se presupuesta ', 'Every project is priced ')}<em>{t('según lo que necesita.', 'on what it needs.')}</em></>}
        sub={t(
          'No trabajamos con tarifas fijas porque dos negocios nunca necesitan lo mismo. El precio depende del diseño, del número de páginas, de las funcionalidades y automatizaciones, de si partimos de cero o de una web existente, de los idiomas y del plazo. Más abajo tienes qué pesa en el presupuesto y unos ejemplos orientativos para situarte.',
          "We don't work with fixed rates because no two businesses need the same thing. The price depends on the design, the number of pages, the functionality and automations, whether we start from scratch or from an existing site, the languages and the timeline. Below you'll find what drives the budget and some indicative examples to place yourself."
        )}
        note={t(
          'El precio definitivo siempre va por escrito en una propuesta cerrada, después de una llamada de descubrimiento gratuita.',
          'The final price always goes in a written, fixed proposal after a free discovery call.'
        )}
        actions={<>
          <a className="btn" href="https://wa.me/34680863229?text=Hola%2C%20quiero%20una%20propuesta%20para%20mi%20proyecto" target="_blank" rel="noopener noreferrer">{t('Pedir propuesta por WhatsApp', 'Request a proposal on WhatsApp')} <span className="arr">→</span></a>
          <a className="btn ghost" href={contactHref}>{t('Reservar llamada', 'Book a call')}</a>
        </>}
        aside={
          <WidgetStack kicker={t('Propuesta cerrada', 'Fixed proposal')} label={t('Alcance, precio y plazo por escrito en 48 horas', 'Scope, price and timeline in writing within 48 hours')}>
            <div className="widget" style={{ left: 0, top: 0 }}>
              <div className="k">{t('Web de presentación', 'Presentation site')}</div>
              <div className="v">{t('desde 950 €', 'from €950')}</div>
            </div>
            <div className="widget" style={{ right: 0, top: '34%', animationDelay: '-2s' }}>
              <div className="k">{t('Pago', 'Payment')}</div>
              <div className="v">50 / 50<small>{t('inicio · lanzamiento', 'start · launch')}</small></div>
            </div>
            <div className="widget wa" style={{ left: '6%', bottom: 0, animationDelay: '-4s' }}>
              <div className="ic">48h</div>
              <div className="msg"><b>{t('Propuesta enviada', 'Proposal sent')}</b>{t('Tras la llamada de descubrimiento', 'After the discovery call')}</div>
            </div>
          </WidgetStack>
        }
      />

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow={t('Factores', 'Factors')}
            title={t('Qué determina el precio', 'What determines the price')}
            lead={t('Ocho cosas que miramos antes de poner un número.', 'Eight things we look at before putting a number down.')}
          />
          <div className="tiles">
            {factors.map((f, i) => {
              const Icon = f.icon
              const [title, desc] = es ? f.es : f.en
              return (
                <Reveal key={title} as="div">
                  <div className="tile" style={{ height: '100%' }}>
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ic"><Icon strokeWidth={1.6} /></span>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper2)' }}>
        <div className="wrap">
          <SectionHead
            eyebrow={t('Ejemplos', 'Examples')}
            title={t('Ejemplos orientativos', 'Indicative examples')}
            lead={t('Para que sepas en qué orden de magnitud se mueve cada tipo de proyecto. Son puntos de partida, no presupuestos.', 'So you know the order of magnitude for each type of project. Starting points, not quotes.')}
          />
          <div className="prices">
            {examples.map((ex, i) => {
              const e = es ? ex.es : ex.en
              return (
                <Reveal key={e.name} as="div" className={`price ${i === featIdx ? 'feat' : ''}`}>
                  <span className="who">{e.who}</span>
                  <h3>{e.name}</h3>
                  <div className="from">{e.from}</div>
                  <ul>{e.scope.map((sc) => <li key={sc}>{sc}</li>)}</ul>
                </Reveal>
              )
            })}
          </div>
          <p className="note" style={{ maxWidth: '80ch', marginTop: 22 }}>
            {t(
              'Precios sin IVA, orientativos y sujetos al alcance final de cada propuesta. Los servicios mensuales (SEO, anuncios, contenido) se presupuestan por canales, sector e inversión.',
              'Prices exclude VAT, are indicative and subject to the final scope of each proposal. Monthly services (SEO, ads, content) are scoped by channels, sector and media budget.'
            )}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="FAQ" title={t('Preguntas sobre precios', 'Questions about pricing')} />
          <Reveal className="faqbox"><FaqAccordion items={faqs} /></Reveal>
          <Reveal><div style={{ marginTop: 28 }}><a className="btn ghost" href={contactHref}>{t('Reservar llamada de descubrimiento', 'Book a discovery call')}</a></div></Reveal>
        </div>
      </section>
    </>
  )
}
