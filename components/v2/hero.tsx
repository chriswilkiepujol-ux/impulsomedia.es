"use client"

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { esToEn } from '@/lib/route-map'
import { Silk } from './silk'
import { useFreeAuditLive } from '@/lib/free-audit-flag'
import { AuditQuick } from './audit-band'

export function HeroV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  const contact = en ? esToEn['/contacto'] : '/contacto'
  const work = en ? esToEn['/proyectos'] : '/proyectos'
  const auditLive = useFreeAuditLive()

  return (
    <header className="hero">
      <Silk />
      <div className="wrap">
        <div className="top">
          <div>
            <div className="eyebrow rise">{t('Agencia digital · Sotogrande · Gibraltar · Campo de Gibraltar', 'Digital agency · Sotogrande · Gibraltar · Campo de Gibraltar')}</div>
            <h1 className="rise d1">
              {en ? <>Websites that <em>convert.</em><br />Campaigns that scale.</> : <>Webs que <em>convierten.</em><br />Campañas que escalan.</>}
            </h1>
            <div className="side">
            <p className="sub rise d2">
              {t(
                'Diseño web a medida, SEO, Google y Meta Ads y automatización con IA para negocios que quieren crecer. Sin plantillas ni intermediarios: hablas con quien construye tu web y gestiona tus campañas.',
                'Custom web design, SEO, Google and Meta Ads and AI automation for businesses that want to grow. No templates, no middlemen: you talk to the person who builds your site and runs your campaigns.'
              )}
            </p>
            {auditLive ? <div className="rise d3">
              <div className="aq-label">{t('Analiza tu web gratis en 1 minuto', 'Review your website free in 1 minute')}</div>
              <AuditQuick where="hero" />
              <div className="actions" style={{ marginTop: 12 }}><Link href={work} className="btn ghost">{t('Ver proyectos', 'See our work')}</Link><Link href={contact} className="aq-alt">{t('o hablemos de tu proyecto →', 'or talk to us about your project →')}</Link></div>
            </div> : <div className="actions rise d3">
              <Link href={contact} className="btn">{t('Pide tu auditoría gratuita', 'Get your free audit')} <span className="arr">→</span></Link>
              <Link href={work} className="btn ghost">{t('Ver proyectos', 'See our work')}</Link>
            </div>}
            <div className="proof rise d3">
              <span className="g"><span className="stars">★★★★★</span> {t('5,0 en Google', '5.0 on Google')}</span>
              <span className="avatars"><i /><i /><i /></span>
              <span>{t('7 negocios confían en nosotros', '7 businesses trust us')}</span>
            </div>
            </div>
          </div>

        <div className="stage rise d4" aria-label={t('Una web de cliente en monitor y móvil, con métricas flotantes', 'A client website on desktop and phone, with floating metrics')}>
          <div className="plate" />
          <div className="widget w1">
            <div className="k">{t('Crecimiento SEO', 'SEO growth')}</div>
            <div className="v">×8<small>{t('impresiones', 'impressions')}</small></div>
            <svg viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true"><path d="M0 33 L20 32 L40 31 L60 27 L80 22 L100 19 L120 14 L140 9 L160 2" fill="none" stroke="#C9A04A" strokeWidth="2" /></svg>
            <div className="foot">{t('Google · 4 semanas · impulsomedia.es', 'Google · 4 weeks · impulsomedia.es')}</div>
          </div>
          <div className="widget w2">
            <div className="k">{t('Reseñas en Google', 'Google reviews')}</div>
            <div className="v">{t('5,0', '5.0')}<small style={{ color: '#fbbc04' }}>★★★★★</small></div>
          </div>
          <div className="widget w3 svcs">
            <div className="k">{t('Un solo equipo', 'One team')}</div>
            <div className="chips"><span>Web</span><span>SEO</span><span>Ads</span><span>{t('IA', 'AI')}</span></div>
            <div className="foot">{t('10+ años en performance marketing', '10+ years in performance marketing')}</div>
          </div>
          <div className="monitor"><div className="screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/pujolwilkie-scroll-desktop-2x.webp" alt="" width={840} height={3630} style={{ ['--scroll-to' as string]: 'calc(-100% + 100%/4.3)' }} loading="eager" />
          </div></div>
          <div className="phone"><div className="screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/pujolwilkie-scroll-mobile-2x.webp" alt="" width={260} height={5276} style={{ ['--scroll-to' as string]: 'calc(-100% + 100%/9.6)' }} loading="eager" />
          </div></div>
        </div>
        </div>
      </div>
    </header>
  )
}

export function StripV2() {
  const { t } = useLanguage()
  const items = ['Google Ads', 'Meta Ads', 'TikTok Ads', 'WordPress', 'Next.js', 'Vercel', 'Claude AI', 'Google Business', 'Search Console', 'Stripe', 'FourVenues', 'Make']
  return (
    <div className="strip">
      <div className="wrap">
        <span className="lbl">{t('Trabajamos con', 'We work with')}</span>
        <div className="mask"><div className="track">{[...items, ...items].map((s, i) => <span key={i}>{s}</span>)}</div></div>
      </div>
    </div>
  )
}
