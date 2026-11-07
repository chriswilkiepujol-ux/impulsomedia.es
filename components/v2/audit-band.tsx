"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useFreeAuditLive, auditHref } from '@/lib/free-audit-flag'
import { Reveal } from './shared'

const track = (name: string, p: Record<string, any> = {}) => { try { (window as any).gtag?.('event', name, p) } catch {} }

// URL box that hands off to the audit page with the address pre-filled.
export function AuditQuick({ dark = false, where }: { dark?: boolean; where: string }) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const go = (e: React.FormEvent) => {
    e.preventDefault(); track('free_audit_home_start', { where })
    router.push(`${auditHref(language === 'en')}${url.trim() ? `?url=${encodeURIComponent(url.trim())}` : ''}#form`)
  }
  return (
    <form className={`aq ${dark ? 'dk' : ''}`} onSubmit={go}>
      <input inputMode="url" autoComplete="url" placeholder={t('tuweb.com', 'yoursite.com')} value={url} onChange={e => setUrl(e.target.value)} aria-label={t('Dirección de tu web', 'Your website address')} />
      <button type="submit" className="btn gold">{t('Analizar gratis', 'Review it free')} <span className="arr" style={{ background: '#fff' }}>→</span></button>
    </form>
  )
}

export function AuditBandV2() {
  const { t } = useLanguage()
  const live = useFreeAuditLive()
  if (!live) return null
  const areas = t('Primera impresión,Llamadas a la acción,Velocidad,SEO técnico,Medición y anuncios,¿Está anticuada?,Seguridad y legal,Presencia local', 'First impression,Calls to action,Speed,Technical SEO,Tracking and ads,Is it outdated?,Security and legal,Local presence').split(',')
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="ab">
          <div className="in">
            <div>
              <div className="eyebrow">{t('Auditoría web gratis · 1 minuto', 'Free website review · 1 minute')}</div>
              <h2>{t('¿Tu web te trae clientes o los espanta?', 'Does your website win customers or lose them?')}</h2>
              <p className="lead">{t('Pon tu dirección y te decimos cómo la ve un cliente nuevo, si Google la entiende, si carga rápido en el móvil y si estás midiendo algo. Ocho apartados con puntuación y qué hacer en cada uno.', 'Enter your address and we tell you how a new customer sees it, whether Google understands it, whether it loads fast on a phone and whether you are measuring anything. Eight scored areas, with what to do in each.')}</p>
              <AuditQuick dark where="band" />
              <p className="note">{t('Gratis · sin instalar nada · resultado en pantalla y por email', 'Free · nothing to install · result on screen and by email')}</p>
            </div>
            <ul className="chips">{areas.map((a, i) => <li key={a}><span>{String(i + 1).padStart(2, '0')}</span>{a}</li>)}</ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
