"use client"

import type { ReactNode } from 'react'
import { Mesh, Reveal, GOLD, GOLD2, INK } from './shared'

const MESH = [GOLD, GOLD2, INK, GOLD]

/** Inner-page hero: cream band with drifting gold artwork, h1 on the left, visual on the right. */
export function PageHero({ eyebrow, title, sub, note, actions, aside, asideFirstOnMobile = false }: {
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
  note?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  /** On phones, show the visual straight after the title instead of after the buttons. */
  asideFirstOnMobile?: boolean
}) {
  return (
    <header className={`phero${asideFirstOnMobile ? ' flip' : ''}`}>
      <Mesh colors={MESH} alpha={0.2} />
      <div className="gridlines" aria-hidden="true" />
      <div className="wrap">
        <div className="txt">
          <div className="eyebrow rise">{eyebrow}</div>
          <h1 className="rise d1">{title}</h1>
          {sub && <p className="sub rise d2">{sub}</p>}
          {note && <p className="sub rise d2">{note}</p>}
          {actions && <div className="actions rise d3">{actions}</div>}
        </div>
        {aside && <div className="aside rise d4">{aside}</div>}
      </div>
    </header>
  )
}

/** Section heading row: eyebrow + h2 on the left, optional lead on the right. */
export function SectionHead({ eyebrow, title, lead, as: H = 'h2' }: { eyebrow: string; title: ReactNode; lead?: ReactNode; as?: 'h2' | 'h1' }) {
  return (
    <Reveal className="shead">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <H style={{ fontSize: 'clamp(32px, 4.6vw, 58px)', marginTop: 18, maxWidth: '18ch' }}>{title}</H>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  )
}

/** Dark slab with artwork and a label, surrounded by floating metric widgets. */
export function WidgetStack({ label, kicker, children }: { label: string; kicker: string; children: ReactNode }) {
  return (
    <div className="wstack">
      <div className="slab">
        <Mesh colors={[GOLD, GOLD2, '90,100,120']} alpha={0.45} speed={1.2} />
        <div className="lbl"><small>{kicker}</small>{label}</div>
      </div>
      {children}
    </div>
  )
}

export function Spark({ d = 'M0 30 L20 28 L40 24 L60 26 L80 18 L100 16 L120 10 L140 8 L160 3' }: { d?: string }) {
  return <svg viewBox="0 0 160 36" preserveAspectRatio="none" aria-hidden="true"><path d={d} fill="none" stroke="#C9A04A" strokeWidth="2" /></svg>
}

export const WA_URL = 'https://wa.me/34680863229'

export function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
