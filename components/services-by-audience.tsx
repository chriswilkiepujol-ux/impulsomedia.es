"use client"

import { useLanguage } from '@/lib/language-context'
import { services } from '@/lib/services-data'
import { PageHero, SectionHead, WidgetStack, Spark } from '@/components/v2/page'
import { Reveal } from '@/components/v2/shared'

interface Props {
  category: 'local' | 'performance'
}

export function ServicesByAudience({ category }: Props) {
  const { t, language } = useLanguage()
  const filtered = services.filter((s) => s.category === category)

  const isLocal = category === 'local'

  const es = language === 'es'
  const cta = isLocal ? (
    <a className="btn" href="https://wa.me/34680863229?text=Hi%2C%20I'd%20like%20to%20start%20a%20project%20with%20ImpulsoMedia" target="_blank" rel="noopener noreferrer">
      {t('Hablemos por WhatsApp', "Let's talk on WhatsApp")} <span className="arr">→</span>
    </a>
  ) : (
    <a className="btn" href={es ? '/contacto' : '/en/contact'}>{t('Solicitar una llamada', 'Book a call')} <span className="arr">→</span></a>
  )

  return (
    <>
      <PageHero
        eyebrow={isLocal ? t('Para negocios locales', 'For local businesses') : t('Performance a escala', 'Performance at scale')}
        title={isLocal
          ? (es ? <>Web, SEO y presencia local que <em>atrae clientes</em></> : <>Web, SEO and local presence that <em>brings in clients</em></>)
          : (es ? <>Gestión de campañas para <em>marcas y operadores</em></> : <>Campaign management for <em>brands and operators</em></>)}
        sub={isLocal
          ? t(
              'Diseño web, SEO local, redes sociales y mantenimiento continuo. Trato directo, sin intermediarios, con comunicación rápida por WhatsApp.',
              'Web design, local SEO, social media and ongoing maintenance. Direct relationship, no middlemen, fast communication over WhatsApp.'
            )
          : t(
              'PPC, programática, afiliación, in-app, ASO y consultoría a medida. Gestión de campañas con presupuestos mayores y experiencia en sectores regulados.',
              'PPC, programmatic, affiliate, in-app, ASO and tailored consultancy. Campaign management for larger budgets, with experience across regulated sectors.'
            )}
        actions={<>{cta}<a className="btn ghost" href={es ? '/proyectos' : '/en/work'}>{t('Ver proyectos', 'See our work')}</a></>}
        aside={isLocal ? (
          <WidgetStack kicker={t('Negocio local', 'Local business')} label={t('Que te encuentren cuando buscan en tu zona', 'Get found when people search in your area')}>
            <div className="widget" style={{ left: 0, top: 0 }}>
              <div className="k">{t('Nuestras reseñas en Google', 'Our Google reviews')}</div>
              <div className="v">{t('5,0', '5.0')}<small style={{ color: '#c9a04a' }}>★★★★★</small></div>
              <Spark />
            </div>
            <div className="widget wa" style={{ right: 0, bottom: '6%', animationDelay: '-3s' }}>
              <div className="ic">W</div>
              <div className="msg"><b>{t('Nuevo mensaje', 'New message')}</b>{t('“¿Tenéis cita esta semana?”', '“Any slots this week?”')}</div>
            </div>
          </WidgetStack>
        ) : (
          <WidgetStack kicker={t('Performance', 'Performance')} label={t('Presupuestos grandes, coste por adquisición medido', 'Larger budgets, measured cost per acquisition')}>
            <div className="widget" style={{ left: 0, top: 0 }}>
              <div className="k">{t('Experiencia', 'Experience')}</div>
              <div className="v">10+ {t('años', 'years')}<small>media buying</small></div>
              <Spark d="M0 32 L20 30 L40 26 L60 22 L80 20 L100 12 L120 14 L140 6 L160 4" />
            </div>
            <div className="widget" style={{ right: 0, bottom: '6%', animationDelay: '-3s' }}>
              <div className="k">{t('Sectores regulados', 'Regulated sectors')}</div>
              <div className="v" style={{ fontSize: 18 }}>iGaming · fintech</div>
            </div>
          </WidgetStack>
        )}
      />
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow={t('Servicios', 'Services')} title={isLocal ? t('Lo que hacemos por tu negocio', 'What we do for your business') : t('Canales que gestionamos', 'Channels we manage')} />
          <div className="tiles">
            {filtered.map((service) => {
              const Icon = service.icon
              return (
                <Reveal key={service.num} as="div">
                  <div className="tile" style={{ height: '100%' }}>
                    <span className="n">{service.num}</span>
                    <span className="ic"><Icon strokeWidth={1.6} /></span>
                    <h3>{es ? service.titleEs : service.titleEn}</h3>
                    <p>{es ? service.descEs : service.descEn}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
