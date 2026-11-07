"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { esToEn, getAlternatePath } from '@/lib/route-map'
import { Logo } from './shared'
import { useFreeAuditLive, auditHref } from '@/lib/free-audit-flag'

export function HeaderV2() {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const homeHref = isEn ? '/en' : '/'
  const altHref = getAlternatePath(pathname)
  const contact = isEn ? esToEn['/contacto'] : '/contacto'
  const auditLive = useFreeAuditLive()
  const base = isEn
    ? [[esToEn['/servicios'], 'Services'], [esToEn['/proyectos'], 'Work'], [esToEn['/precios'], 'Pricing'], [esToEn['/nosotros'], 'About'], [esToEn['/opiniones'], 'Reviews'], [esToEn['/blog'], 'Blog']]
    : [['/servicios', 'Servicios'], ['/proyectos', 'Proyectos'], ['/precios', 'Precios'], ['/nosotros', 'Nosotros'], ['/opiniones', 'Opiniones'], ['/blog', 'Blog']]
  // Audit link replaces Blog in the bar (the blog stays in the footer and mobile menu) so the nav does not get longer.
  const links = auditLive ? [...base.slice(0, 5), [auditHref(isEn), isEn ? 'Free audit' : 'Auditoría gratis']] : base
  const mobileLinks = auditLive ? [...base, [auditHref(isEn), isEn ? 'Free audit' : 'Auditoría gratis']] : base

  return (
    <nav className="nav">
      <div className="wrap">
        <Link href={homeHref} className="logo" aria-label="ImpulsoMedia"><Logo /></Link>
        <ul>{links.map(([h, l]) => <li key={h}><Link href={h}>{l}</Link></li>)}</ul>
        <div className="right">
          <span className="lang">
            <Link href={isEn ? pathname : altHref} className={isEn ? 'on' : ''}>EN</Link>
            <Link href={isEn ? altHref : pathname} className={!isEn ? 'on' : ''}>ES</Link>
          </span>
          <Link href={contact} className="btn">{isEn ? "Let's talk" : 'Hablemos'} <span className="arr">→</span></Link>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 4h14M2 9h14M2 14h14" />}
            </svg>
          </button>
        </div>
      </div>
      <div className={`mobile ${open ? 'open' : ''}`}>
        {mobileLinks.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>)}
        <Link href={contact} className="btn">{isEn ? "Let's talk" : 'Hablemos'} <span className="arr">→</span></Link>
        <span className="lang">
          <Link href={isEn ? pathname : altHref} className={isEn ? 'on' : ''}>EN</Link>
          <Link href={isEn ? altHref : pathname} className={!isEn ? 'on' : ''}>ES</Link>
        </span>
      </div>
    </nav>
  )
}
