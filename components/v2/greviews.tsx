"use client"

import { useState } from 'react'
import { Reveal } from './shared'

export const GBP_REVIEW_URL = 'https://g.page/r/Cart50OPlmevEBE/review'

export type GReview = { name: string; role: string; text: string }

// Avatar colours in the style of Google account initials
const AVATAR = ['#1a73e8', '#e8710a', '#188038', '#a142f4', '#d93025', '#12b5cb', '#c5221f', '#0b8043']

const initial = (n: string) => n.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/g, '').slice(0, 1).toUpperCase()

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="gstars" aria-label="5/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.3l-6.2 3.7 1.6-7L2 9.3l7.1-.6L12 2l2.9 6.7 7.1.6-5.4 4.7 1.6 7z" fill="#fbbc04" /></svg>
      ))}
    </span>
  )
}

function Card({ r, i, es }: { r: GReview; i: number; es: boolean }) {
  const [open, setOpen] = useState(false)
  const long = r.text.length > 150
  return (
    <Reveal as="article" className="grev">
      <header>
        <i style={{ background: AVATAR[i % AVATAR.length] }}>{initial(r.name)}</i>
        <span><b>{r.name}</b><small>{r.role}</small></span>
      </header>
      <Stars />
      <p className={long && !open ? 'clamp' : undefined}>{r.text}</p>
      {long && <button type="button" className="more" onClick={() => setOpen(!open)}>{open ? (es ? 'Menos' : 'Less') : (es ? 'Más' : 'More')}</button>}
    </Reveal>
  )
}

/** Summary bar (rating + links to the Google profile) and review cards styled like Google reviews. */
export function GReviews({ reviews, es }: { reviews: GReview[]; es: boolean }) {
  return (
    <>
      <Reveal className="gsum">
        <div className="score">
          <b>{es ? '5,0' : '5.0'}</b>
          <span><Stars size={18} /><small>{es ? 'Valoración en Google' : 'Rating on Google'}</small></span>
        </div>
        <div className="links">
          <a href={GBP_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn ghost">{es ? 'Ver en Google' : 'See on Google'}</a>
          <a href={GBP_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn">{es ? 'Escribir una reseña' : 'Write a review'}</a>
        </div>
      </Reveal>
      <div className="greviews">
        {reviews.map((r, i) => <Card key={r.name} r={r} i={i} es={es} />)}
      </div>
    </>
  )
}
