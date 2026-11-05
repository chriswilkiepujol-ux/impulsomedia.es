"use client"

import Link from 'next/link'
import { Mesh, Reveal, GOLD, GOLD2 } from './shared'

const MESH = [GOLD, GOLD2, '90,100,120']

/** Dark rounded call-to-action card with drifting gold artwork (v2 design). */
export function CtaCard({
  eyebrow,
  headline,
  sub,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow?: string
  headline: string
  sub?: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  const external = primaryHref.startsWith('http')
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="cta">
          <Mesh colors={MESH} alpha={0.35} speed={1.4} />
          <div className="in">
            <div>
              {eyebrow && <div className="eyebrow">{eyebrow}</div>}
              <h2>{headline}</h2>
              {sub && <p style={{ color: '#c3c7cd', fontSize: 18, lineHeight: 1.55, marginTop: 18, maxWidth: '46ch' }}>{sub}</p>}
            </div>
            <div className="side">
              {external ? (
                <a className="btn gold" href={primaryHref} target="_blank" rel="noopener noreferrer">{primaryLabel} <span className="arr" style={{ background: '#fff' }}>→</span></a>
              ) : (
                <Link className="btn gold" href={primaryHref}>{primaryLabel} <span className="arr" style={{ background: '#fff' }}>→</span></Link>
              )}
              {secondaryHref && secondaryLabel && <Link className="btn ghost" href={secondaryHref}>{secondaryLabel}</Link>}
              <p className="note">chris@impulsomedia.es · +34 680 863 229</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
