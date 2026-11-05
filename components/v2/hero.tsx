"use client"

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { esToEn } from '@/lib/route-map'
import { Mesh, GOLD, GOLD2, INK } from './shared'

const MESH = [GOLD, GOLD2, INK, GOLD]

export function HeroV2() {
  const { t, language } = useLanguage()
  const en = language === 'en'
  const contact = en ? esToEn['/contacto'] : '/contacto'
  const work = en ? esToEn['/proyectos'] : '/proyectos'

  return (
    <header className="hero">
      <Mesh colors={MESH} alpha={0.22} />
      <div className="gridlines" aria-hidden="true" />
      <div className="wrap">
        <div className="top">
          <div>
            <div className="eyebrow rise">{t('Agencia digital · Sotogrande · Gibraltar · Campo de Gibraltar', 'Digital agency · Sotogrande · Gibraltar · Campo de Gibraltar')}</div>
            <h1 className="rise d1">
              {en ? <>Websites that <em>convert.</em><br />Campaigns that scale.</> : <>Webs que <em>convierten.</em><br />Campañas que escalan.</>}
            </h1>
          </div>
          <div className="side">
            <p className="sub rise d2">
              {t(
                'Diseño web a medida, SEO, Google y Meta Ads y automatización con IA para negocios que quieren crecer. Sin plantillas ni intermediarios: hablas con quien construye tu web y gestiona tus campañas.',
                'Custom web design, SEO, Google and Meta Ads and AI automation for businesses that want to grow. No templates, no middlemen: you talk to the person who builds your site and runs your campaigns.'
              )}
            </p>
            <div className="actions rise d3">
              <Link href={contact} className="btn">{t('Pide tu auditoría gratuita', 'Get your free audit')} <span className="arr">→</span></Link>
              <Link href={work} className="btn ghost">{t('Ver proyectos', 'See our work')}</Link>
            </div>
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
            <div className="k">{t('Velocidad de carga', 'Load time')}</div>
            <div className="v">&lt; 1 s<small>Next.js + Vercel</small></div>
            <svg viewBox="0 0 160 36" preserveAspectRatio="none"><path d="M0 30 L20 28 L40 24 L60 26 L80 18 L100 16 L120 10 L140 8 L160 3" fill="none" stroke="#C9A04A" strokeWidth="2" /></svg>
          </div>
          <div className="widget w2">
            <div className="k">{t('Reseñas en Google', 'Google reviews')}</div>
            <div className="v">{t('5,0', '5.0')}<small style={{ color: '#c9a04a' }}>★★★★★</small></div>
          </div>
          <div className="widget w3 wa">
            <div className="ic">W</div>
            <div className="msg"><b>{t('Nueva reserva', 'New booking')}</b>{t('Mesa VIP · sábado 23:00 · 8 pax', 'VIP table · Saturday 11pm · 8 pax')}</div>
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
