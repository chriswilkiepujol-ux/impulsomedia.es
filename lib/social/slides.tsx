// Impulso Social: brand slide renderer (1080x1350, 4:5) used by the feed app and by Instagram publishing.
// Slides are plain JSON stored in social_posts.slides; this file turns one slide into a JPG.
// Typography follows the v2 site: Bricolage Grotesque (headings), Manrope (body), DM Mono (labels), Syne (logo).
import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export const SLIDE_W = 1080
export const SLIDE_H = 1350

export type Slide =
  | { k: 'cover'; eyebrow?: string; h: string; sub?: string }
  | { k: 'point'; n: string; h: string; b?: string }
  | { k: 'text'; eyebrow?: string; h: string; b?: string }
  | { k: 'list'; eyebrow?: string; h: string; items: string[] }
  | { k: 'stat'; eyebrow?: string; big: string; h: string; b?: string }
  | { k: 'cta'; h: string; sub?: string; url?: string }

export type Theme = 'dark' | 'light' | 'gold'
export type SlidePost = { slides: Slide[]; theme: Theme; lang: 'es' | 'en' }

const THEMES: Record<Theme, { bg: string; fg: string; sub: string; mute: string; accent: string; line: string; pillBg: string; pillFg: string; logoB: string }> = {
  dark: { bg: '#111418', fg: '#f4f1ea', sub: '#bdb8ac', mute: '#7d828a', accent: '#d4a853', line: '#2a2f37', pillBg: '#d4a853', pillFg: '#111418', logoB: '#d4a853' },
  light: { bg: '#f6f4ef', fg: '#111418', sub: '#3a3f47', mute: '#7a7f87', accent: '#b8892f', line: '#d5d0c6', pillBg: '#111418', pillFg: '#ffffff', logoB: '#b8892f' },
  gold: { bg: '#c9a04a', fg: '#111418', sub: '#2c2410', mute: '#5d4a1c', accent: '#111418', line: 'rgba(17,20,24,.28)', pillBg: '#111418', pillFg: '#ffffff', logoB: '#ffffff' },
}

let fontCache: any[] | null = null
async function fonts() {
  if (fontCache) return fontCache
  const dir = join(process.cwd(), 'lib', 'social', 'fonts')
  const load = (f: string) => readFile(join(dir, f))
  const [syne, b7, b8, m5, m7, mono] = await Promise.all([load('syne-800.ttf'), load('bricolage-700.ttf'), load('bricolage-800.ttf'), load('manrope-500.ttf'), load('manrope-700.ttf'), load('dmmono-500.ttf')])
  fontCache = [
    { name: 'Syne', data: syne, weight: 800, style: 'normal' },
    { name: 'Bricolage', data: b7, weight: 700, style: 'normal' },
    { name: 'Bricolage', data: b8, weight: 800, style: 'normal' },
    { name: 'Manrope', data: m5, weight: 500, style: 'normal' },
    { name: 'Manrope', data: m7, weight: 700, style: 'normal' },
    { name: 'DM Mono', data: mono, weight: 500, style: 'normal' },
  ]
  return fontCache
}

// Heading size steps by text length, so long headlines never overflow the card.
const size = (t: string, steps: [number, number][], min: number) => { const n = (t || '').length; for (const [max, px] of steps) if (n <= max) return px; return min }
const pad2 = (n: number) => String(n).padStart(2, '0')

function Pulse({ color, s }: { color: string; s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="2" fill="none" />
      <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// The logo's heartbeat stretched into a full-width line: the one decorative motif, used on covers and CTAs.
function Beat({ color, opacity, w = 1080, h = 220, sw = 5 }: { color: string; opacity: number; w?: number; h?: number; sw?: number }) {
  const m = h / 2
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ opacity }}>
      <path d={`M0 ${m} L${w * 0.46} ${m} L${w * 0.52} ${h * 0.2} L${w * 0.62} ${h * 0.86} L${w * 0.72} ${h * 0.04} L${w * 0.78} ${m} L${w} ${m}`} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function Eyebrow({ text, t }: { text: string; t: (typeof THEMES)[Theme] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'DM Mono', fontSize: 28, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.mute }}>
      <div style={{ width: 44, height: 4, background: t.accent, marginRight: 18 }} />
      <span>{text}</span>
    </div>
  )
}

function Body({ slide, t, last }: { slide: Slide; t: (typeof THEMES)[Theme]; last: boolean }) {
  const H = (text: string, px: number, weight = 800, color = t.fg) => (
    <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: weight, fontSize: px, lineHeight: 1.03, letterSpacing: '-0.03em', color }}>{text}</div>
  )
  const P = (text: string, px = 46, color = t.sub) => (
    <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 500, fontSize: px, lineHeight: 1.4, color }}>{text}</div>
  )
  if (slide.k === 'cover') {
    const px = size(slide.h, [[22, 156], [34, 136], [50, 116], [70, 100], [90, 90]], 80)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingBottom: 210 }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : <div style={{ display: 'flex', width: 120, height: 6, background: t.accent }} />}
        <div style={{ display: 'flex', marginTop: 38 }}>{H(slide.h, px)}</div>
        {slide.sub ? <div style={{ display: 'flex', marginTop: 36, maxWidth: 860 }}>{P(slide.sub, 48)}</div> : null}
      </div>
    )
  }
  if (slide.k === 'point') {
    const px = size(slide.h, [[24, 104], [40, 90], [60, 78], [80, 68]], 60)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 290, lineHeight: 0.86, letterSpacing: '-0.05em', color: t.accent }}>{slide.n}</div>
        <div style={{ display: 'flex', width: '100%', height: 2, background: t.line, marginTop: 36, marginBottom: 40 }} />
        {H(slide.h, px, 700)}
        {slide.b ? <div style={{ display: 'flex', marginTop: 30 }}>{P(slide.b)}</div> : null}
      </div>
    )
  }
  if (slide.k === 'text') {
    const px = size(slide.h, [[24, 124], [40, 106], [60, 90], [80, 78]], 68)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : <div style={{ display: 'flex', width: 120, height: 6, background: t.accent }} />}
        <div style={{ display: 'flex', marginTop: 36 }}>{H(slide.h, px)}</div>
        {slide.b ? <div style={{ display: 'flex', marginTop: 36 }}>{P(slide.b, 48)}</div> : null}
      </div>
    )
  }
  if (slide.k === 'list') {
    const items = (slide.items || []).slice(0, 6)
    const px = size(slide.h, [[24, 96], [40, 84], [54, 74]], 64)
    const ipx = items.length > 4 ? 41 : 46
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : <div style={{ display: 'flex', width: 120, height: 6, background: t.accent }} />}
        <div style={{ display: 'flex', marginTop: 34, marginBottom: 20 }}>{H(slide.h, px)}</div>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 28, paddingBottom: 28, borderTop: `2px solid ${t.line}` }}>
            <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: 28, color: t.accent, width: 78, marginTop: 12 }}>{pad2(i + 1)}</div>
            <div style={{ display: 'flex', flex: 1, fontFamily: 'Manrope', fontWeight: 700, fontSize: ipx, lineHeight: 1.3, color: t.fg }}>{it}</div>
          </div>
        ))}
      </div>
    )
  }
  if (slide.k === 'stat') {
    const bpx = size(slide.big, [[3, 330], [5, 260], [8, 190]], 150)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : null}
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: bpx, lineHeight: 0.92, letterSpacing: '-0.05em', color: t.accent, marginTop: 26 }}>{slide.big}</div>
        <div style={{ display: 'flex', marginTop: 34 }}>{H(slide.h, size(slide.h, [[30, 84], [50, 72], [70, 64]], 56), 700)}</div>
        {slide.b ? <div style={{ display: 'flex', marginTop: 28 }}>{P(slide.b)}</div> : null}
      </div>
    )
  }
  // cta
  const px = size(slide.h, [[20, 140], [32, 120], [48, 100], [64, 86]], 74)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingBottom: 200 }}>
      <Pulse color={t.accent} s={130} />
      <div style={{ display: 'flex', marginTop: 44 }}>{H(slide.h, px)}</div>
      {slide.sub ? <div style={{ display: 'flex', marginTop: 30 }}>{P(slide.sub, 48)}</div> : null}
      {slide.url ? (
        <div style={{ display: 'flex', marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: t.pillBg, color: t.pillFg, borderRadius: 999, padding: '26px 42px', fontFamily: 'Manrope', fontWeight: 700, fontSize: 38 }}>{slide.url}</div>
        </div>
      ) : null}
    </div>
  )
}

function Card({ post, index }: { post: SlidePost; index: number }) {
  const t = THEMES[post.theme] || THEMES.dark
  const total = post.slides.length
  const slide = post.slides[index]
  const last = index === total - 1
  const deco = slide.k === 'cover' || slide.k === 'cta'
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, display: 'flex', flexDirection: 'column', background: t.bg, color: t.fg, padding: '78px 84px 70px', position: 'relative' }}>
      {deco ? (
        <div style={{ display: 'flex', position: 'absolute', left: 0, bottom: 118, width: SLIDE_W }}>
          <Beat color={t.accent} opacity={post.theme === 'gold' ? 0.22 : 0.3} />
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Pulse color={post.theme === 'gold' ? '#111418' : t.accent} s={50} />
          <div style={{ display: 'flex', marginLeft: 16, fontFamily: 'Syne', fontWeight: 800, fontSize: 28, letterSpacing: '0.14em' }}>
            <span style={{ color: t.fg }}>IMPULSO</span>
            <span style={{ color: t.logoB, marginLeft: 10 }}>MEDIA</span>
          </div>
        </div>
        {total > 1 ? <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.08em', color: t.mute }}>{`${pad2(index + 1)} / ${pad2(total)}`}</div> : null}
      </div>
      <Body slide={slide} t={t} last={last} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.06em', color: t.mute }}>
        <span>impulsomedia.es</span>
        {total > 1 && !last ? <span style={{ color: t.accent }}>{post.lang === 'en' ? 'Swipe →' : 'Desliza →'}</span> : <span />}
      </div>
    </div>
  )
}

export async function renderSlidePng(post: SlidePost, index: number): Promise<Buffer> {
  const res = new ImageResponse(<Card post={post} index={index} />, { width: SLIDE_W, height: SLIDE_H, fonts: (await fonts()) as any })
  return Buffer.from(await res.arrayBuffer())
}

// Instagram only accepts JPG, so every slide is delivered as one.
export async function renderSlideJpeg(post: SlidePost, index: number, width = SLIDE_W): Promise<Buffer> {
  const png = await renderSlidePng(post, index)
  let img = sharp(png)
  if (width !== SLIDE_W) img = img.resize({ width })
  return img.jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toBuffer()
}

export function cleanSlides(raw: any): Slide[] {
  const s = (x: any, n: number) => String(x ?? '').replace(/\s+/g, ' ').trim().slice(0, n)
  const out: Slide[] = []
  for (const r of Array.isArray(raw) ? raw.slice(0, 10) : []) {
    const k = r?.k
    if (k === 'cover') out.push({ k, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 110), sub: s(r.sub, 140) || undefined })
    else if (k === 'point') out.push({ k, n: s(r.n, 3) || String(out.length), h: s(r.h, 100), b: s(r.b, 200) || undefined })
    else if (k === 'text') out.push({ k, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 110), b: s(r.b, 240) || undefined })
    else if (k === 'list') out.push({ k, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 70), items: (Array.isArray(r.items) ? r.items : []).map((i: any) => s(i, 80)).filter(Boolean).slice(0, 6) })
    else if (k === 'stat') out.push({ k, eyebrow: s(r.eyebrow, 40) || undefined, big: s(r.big, 10), h: s(r.h, 90), b: s(r.b, 200) || undefined })
    else if (k === 'cta') out.push({ k, h: s(r.h, 80), sub: s(r.sub, 140) || undefined, url: s(r.url, 44) || undefined })
  }
  return out.filter((x: any) => x.h)
}
