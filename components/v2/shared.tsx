"use client"

import { useEffect, useRef, type ReactNode } from 'react'

export function Logo() {
  return (
    <>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="#c9a04a" strokeWidth="2" fill="none" />
        <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke="#c9a04a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      Impulso<em>Media</em>
    </>
  )
}

/** Fade + rise on first entry into the viewport. */
export function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'blockquote' | 'li' }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top <= window.innerHeight) return
    el.classList.add('pre')
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.remove('pre'); io.disconnect() }
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = Tag as any
  return <T ref={ref} className={`reveal ${className}`}>{children}</T>
}

/** Counts up from 0 when scrolled into view. */
export function CountUp({ end, suffix = '', gold = false }: { end: number; suffix?: string; gold?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const s = performance.now()
      const f = (n: number) => {
        let p = Math.min(1, (n - s) / 1400)
        p = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(end * p) + suffix
        if (p < 1) requestAnimationFrame(f)
      }
      requestAnimationFrame(f)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [end, suffix])
  return <span ref={ref} style={gold ? { color: 'var(--gold)' } : undefined}>0{suffix}</span>
}

/** Drifting gradient-mesh artwork (gold / ink blobs) on a canvas. */
export function Mesh({ colors, alpha, speed = 1, className = 'mesh' }: { colors: string[]; alpha: number; speed?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const x = c.getContext('2d')
    if (!x) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, raf = 0
    type B = { c: string; x: number; y: number; r: number; a: number; s: number }
    let B: B[] = []
    const size = () => {
      W = c.width = c.offsetWidth; H = c.height = c.offsetHeight
      B = colors.map(col => ({ c: col, x: Math.random() * W, y: Math.random() * H, r: Math.max(W, H) * (0.28 + Math.random() * 0.25), a: Math.random() * 6.28, s: speed * (0.6 + Math.random()) }))
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(c)
    const draw = (t: number) => {
      x.clearRect(0, 0, W, H)
      x.globalCompositeOperation = 'lighter'
      for (const b of B) {
        const k = t * 0.0001 * b.s
        const bx = b.x + Math.cos(b.a + k) * W * 0.12, by = b.y + Math.sin(b.a * 1.3 + k) * H * 0.12
        const g = x.createRadialGradient(bx, by, 0, bx, by, b.r)
        g.addColorStop(0, `rgba(${b.c},${alpha})`); g.addColorStop(1, `rgba(${b.c},0)`)
        x.fillStyle = g; x.fillRect(0, 0, W, H)
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw(0)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [colors, alpha, speed])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

export const GOLD = '201,160,74'
export const GOLD2 = '227,194,110'
export const INK = '17,20,24'
