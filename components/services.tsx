"use client"

import { useLanguage } from '@/lib/language-context'
import { Package, MessageCircle } from 'lucide-react'
import { services } from '@/lib/services-data'
import { esToEn } from '@/lib/route-map'
import Link from 'next/link'
import { PageHero, SectionHead } from '@/components/v2/page'
import { ServiceOrbit } from '@/components/v2/orbit'
import { Reveal } from '@/components/v2/shared'


export function Services({ primary = false }: { primary?: boolean } = {}) {
  const { t, language } = useLanguage()


  const wa = 'https://wa.me/34680863229'
  const es = language === 'es'
  return (
    <>
      {primary && (
        <PageHero
          eyebrow={t('Servicios · Sotogrande · Gibraltar · Costa del Sol', 'Services · Sotogrande · Gibraltar · Costa del Sol')}
          title={<>{t('Servicios que ', 'Services that ')}<em>{t('funcionan', 'work')}</em></>}
          sub={t(
            'Soluciones digitales completas para hacer crecer tu negocio: diseño web, SEO, publicidad y automatización con IA bajo un mismo techo. Hablas siempre con la persona que hace el trabajo.',
            'Complete digital solutions to grow your business: web design, SEO, paid media and AI automation under one roof. You always talk to the person doing the work.'
          )}
          actions={<>
            <a className="btn" href={wa} target="_blank" rel="noopener noreferrer">{t('Cuéntanos tu proyecto', 'Tell us about your project')} <span className="arr">→</span></a>
            <Link className="btn ghost" href={es ? '/precios' : '/en/pricing'}>{t('Cómo presupuestamos', 'How we price')}</Link>
          </>}
          aside={<ServiceOrbit />}
          asideFirstOnMobile
        />
      )}
      <section id="services" className="section dark">
        <div className="wrap">
          <SectionHead
            eyebrow={t('Lo que hacemos', 'What we do')}
            title={t('Todo el rango de servicios', 'The full range of services')}
            lead={t('Cada tarjeta lleva a la página del servicio con detalles, casos y preguntas frecuentes.', 'Each card leads to the service page with details, case studies and FAQs.')}
          />
          <div className="tiles c3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Reveal key={service.num} as="div">
                  <a className="tile" href={es ? service.pillar : esToEn[service.pillar]} style={{ height: '100%' }}>
                    <span className="n">{service.num}</span>
                    <span className="ic"><Icon strokeWidth={1.6} /></span>
                    <h3>{es ? service.titleEs : service.titleEn}</h3>
                    <p>{es ? service.descEs : service.descEn}</p>
                    <div className="tags">{(es ? service.tagsEs : service.tagsEn).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </a>
                </Reveal>
              )
            })}
            <Reveal as="div">
              <div className="tile feat" style={{ height: '100%' }}>
                <span className="n">PACK</span>
                <span className="ic"><Package strokeWidth={1.6} /></span>
                <h3>{es ? 'Paquete Digital Completo' : 'Full Digital Package'}</h3>
                <p>{es
                  ? 'Todo incluido: web, branding, redes sociales y mantenimiento. La solución completa para lanzar o renovar tu presencia digital.'
                  : 'All-inclusive: web, branding, social media and maintenance. The complete solution to launch or renew your digital presence.'}</p>
                <a className="btn" href={wa} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                  <MessageCircle className="w-4 h-4" /> {es ? 'Solicitar info' : 'Request info'}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
