// Impulso Social: brand slide renderer (1080x1350, 4:5) used by the feed app and by Instagram publishing.
// Slides are plain JSON stored in social_posts.slides; this file turns one slide into a JPG.
// A slide is a layout (cover, poster, point, text, list, stat, versus, cta) plus an optional drawn visual ("art").
// Typography follows the v2 site: Bricolage Grotesque (headings), Manrope (body), DM Mono (labels), Syne (logo).
import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export const SLIDE_W = 1080
export const SLIDE_H = 1350
const PAD = 84
const ART_W = SLIDE_W - PAD * 2
const ART_H = 480

export type Art = { k: string; [key: string]: any }
export type Slide = { k: 'cover' | 'poster' | 'photo' | 'point' | 'text' | 'list' | 'stat' | 'versus' | 'cta'; art?: Art; [key: string]: any }
export type Theme = 'dark' | 'light' | 'gold'
export type SlidePost = { slides: Slide[]; theme: Theme; lang: 'es' | 'en' }
export const ART_KINDS = ['search', 'map', 'phone', 'audit', 'chat', 'review', 'rock', 'ad', 'calendar', 'form', 'flow', 'site', 'checklist'] as const

// Real photos a slide may use as a full background (k: "photo", img: one of these keys). Files are traced into the API functions in next.config.mjs.
export const PHOTOS: Record<string, string> = { founder: 'public/images/chris-wilkie.jpg' }
const photoCache: Record<string, string> = {}
async function photoData(key: string): Promise<string | null> {
  if (!PHOTOS[key]) return null
  if (photoCache[key]) return photoCache[key]
  try {
    const buf = await sharp(await readFile(join(process.cwd(), PHOTOS[key]))).resize(SLIDE_W, SLIDE_H, { fit: 'cover', position: 'top' }).jpeg({ quality: 90 }).toBuffer()
    return (photoCache[key] = `data:image/jpeg;base64,${buf.toString('base64')}`)
  } catch { return null }
}

type T = {
  bg: string; glow: string; fg: string; sub: string; mute: string; accent: string; onAccent: string; line: string; logoB: string
  panel: string; panel2: string; panelLine: string; onPanel: string; subPanel: string; skel: string; pop: string; onPop: string
  block: string; onBlock: string; subBlock: string
}
const THEMES: Record<Theme, T> = {
  dark: { bg: '#111418', glow: 'rgba(212,168,83,0.13)', fg: '#f4f1ea', sub: '#bdb8ac', mute: '#7d828a', accent: '#d4a853', onAccent: '#111418', line: '#2a2f37', logoB: '#d4a853',
    panel: '#1a1f26', panel2: '#252b34', panelLine: '#343b46', onPanel: '#f4f1ea', subPanel: '#b4b0a6', skel: '#3a424e', pop: '#d4a853', onPop: '#111418', block: '#d4a853', onBlock: '#111418', subBlock: '#3b2f10' },
  light: { bg: '#f6f4ef', glow: 'rgba(184,137,47,0.12)', fg: '#111418', sub: '#3a3f47', mute: '#7a7f87', accent: '#b8892f', onAccent: '#ffffff', line: '#d5d0c6', logoB: '#b8892f',
    panel: '#ffffff', panel2: '#ece8df', panelLine: '#d9d4c9', onPanel: '#111418', subPanel: '#4a4f57', skel: '#d5d0c6', pop: '#c9982f', onPop: '#111418', block: '#111418', onBlock: '#f4f1ea', subBlock: '#bdb8ac' },
  gold: { bg: '#c9a04a', glow: 'rgba(255,255,255,0.20)', fg: '#111418', sub: '#2c2410', mute: '#5d4a1c', accent: '#111418', onAccent: '#f4f1ea', line: 'rgba(17,20,24,.28)', logoB: '#ffffff',
    panel: '#111418', panel2: '#1e232b', panelLine: '#2e353f', onPanel: '#f4f1ea', subPanel: '#b4b0a6', skel: '#39414c', pop: '#d4a853', onPop: '#111418', block: '#111418', onBlock: '#f4f1ea', subBlock: '#bdb8ac' },
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
const size = (t: string, steps: [number, number][], min: number) => { const n = (t || '').replace(/\*/g, '').length; for (const [max, px] of steps) if (n <= max) return px; return min }
const pad2 = (n: number) => String(n).padStart(2, '0')
const L = (lang: string, es: string, en: string) => (lang === 'en' ? en : es)

// ---------- small pieces ----------
function Pulse({ color, s }: { color: string; s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="2" fill="none" />
      <path d="M6 16 L10 16 L12 10 L16 22 L20 8 L22 16 L26 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
// The logo's heartbeat stretched into a full-width line.
function Beat({ color, opacity, w = 1080, h = 220, sw = 5 }: { color: string; opacity: number; w?: number; h?: number; sw?: number }) {
  const m = h / 2
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ opacity }}>
      <path d={`M0 ${m} L${w * 0.46} ${m} L${w * 0.52} ${h * 0.2} L${w * 0.62} ${h * 0.86} L${w * 0.72} ${h * 0.04} L${w * 0.78} ${m} L${w} ${m}`} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
const STAR = 'M12 2.500l2.900 6.200 6.800.800-5 4.700 1.300 6.700L12 17.600l-6 3.300 1.300-6.700-5-4.700 6.800-.800z'
const PIN = 'M12 22s7-7.200 7-12.500A7 7 0 0 0 5 9.500C5 14.800 12 22 12 22z'
const HANDSET = 'M6.600 10.800a15 15 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.250 11.400 11.400 0 0 0 3.600.600 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1 11.400 11.400 0 0 0 .600 3.600 1 1 0 0 1-.250 1z'
function Stars({ s, color }: { s: number; color: string }) {
  return (
    <div style={{ display: 'flex' }}>
      {[0, 1, 2, 3, 4].map(i => <svg key={i} width={s} height={s} viewBox="0 0 24 24" style={{ marginRight: s * 0.16 }}><path d={STAR} fill={color} /></svg>)}
    </div>
  )
}
function Bar({ w, h = 18, c, mt = 0 }: { w: number | string; h?: number; c: string; mt?: number }) {
  return <div style={{ display: 'flex', width: w, height: h, borderRadius: h / 2, background: c, marginTop: mt }} />
}
function Mono({ children, px = 22, color, mt = 0 }: { children: any; px?: number; color: string; mt?: number }) {
  return <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: px, letterSpacing: '0.12em', textTransform: 'uppercase', color, marginTop: mt }}>{children}</div>
}
function Ring({ p, s, color, track }: { p: number; s: number; color: string; track: string }) {
  const r = 26, c = 2 * Math.PI * r
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r={r} stroke={track} strokeWidth="8" fill="none" />
      <circle cx="32" cy="32" r={r} stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray={`${p * c} ${c}`} transform="rotate(-90 32 32)" />
    </svg>
  )
}
// Headline text. Words between *asterisks* get a solid highlight block.
function Rich({ text, px, t, weight = 800, color, hi, onHi }: { text: string; px: number; t: T; weight?: number; color?: string; hi?: string; onHi?: string }) {
  // glue = this word touches the previous one in the source ("*falla*." or "¿*Quién*"), so no space is drawn between them.
  const parts: { w: string; em: boolean; glue: boolean }[] = []
  String(text || '').split('*').forEach((chunk, ci) => {
    chunk.split(/\s+/).filter(Boolean).forEach((w, wi) => parts.push({ w, em: ci % 2 === 1, glue: wi === 0 && ci > 0 && !/^\s/.test(chunk) && parts.length > 0 && !/\s$/.test(String(text).split('*')[ci - 1] || ' ') }))
  })
  // A short highlighted phrase stays in one piece, so it moves to the next line whole instead of leaving one word behind.
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].em) continue
    let j = i
    while (parts[j + 1]?.em && !parts[j + 1].glue) j++
    const joined = parts.slice(i, j + 1).map(x => x.w).join(' ')
    if (j > i && joined.length * px * 0.58 <= 800) parts.splice(i, j - i + 1, { w: joined, em: true, glue: parts[i].glue })
  }
  const gap = Math.round(px * 0.24), edge = Math.round(px * 0.12), hair = Math.round(px * 0.05)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', fontFamily: 'Bricolage', fontWeight: weight, fontSize: px, lineHeight: 1.06, letterSpacing: '-0.03em', color: color || t.fg }}>
      {parts.map((p, i) => {
        const prev = !!parts[i - 1]?.em, next = !!parts[i + 1]?.em, tight = !!parts[i + 1]?.glue
        const tail = (x?: { w: string; em: boolean; glue: boolean }) => !!x && x.glue && !x.em && /^[.,;:?!»”)]+$/.test(x.w)
        if (tail(p) && parts[i - 1]?.em) return null // drawn together with the highlight before it
        if (!p.em) return <div key={i} style={{ display: 'flex', marginLeft: p.glue ? hair : 0, marginRight: tight ? hair : gap }}>{p.w}</div>
        const block = <div key={i} style={{ display: 'flex', background: hi || t.accent, color: onHi || t.onAccent, paddingLeft: prev ? 0 : edge, paddingRight: next ? gap : edge, marginRight: next || tight ? 0 : gap }}>{p.w}</div>
        // Closing punctuation right after a highlight ("*falla*?") stays on the same line as the highlight.
        if (tail(parts[i + 1])) return <div key={i} style={{ display: 'flex', marginRight: parts[i + 2]?.glue ? hair : gap }}>{block}<div style={{ display: 'flex', marginLeft: hair }}>{parts[i + 1].w}</div></div>
        return block
      })}
    </div>
  )
}

// ---------- drawn visuals ----------
function ArtSearch({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const dim = (k: number) => (
    <div key={k} style={{ display: 'flex', alignItems: 'center', height: 100, borderRadius: 24, background: t.panel, opacity: 0.6, padding: '0 28px', marginTop: 16 }}>
      <div style={{ display: 'flex', width: 54, height: 54, borderRadius: 27, background: t.skel }} />
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 22, flex: 1 }}><Bar w={k ? '38%' : '52%'} c={t.skel} /><Bar w={k ? '24%' : '30%'} h={14} c={t.skel} mt={12} /></div>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 100, borderRadius: 50, background: t.panel, border: `2px solid ${t.panelLine}`, padding: '0 36px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke={t.subPanel} strokeWidth="2.200" /><path d="M15.500 15.500 21 21" stroke={t.subPanel} strokeWidth="2.200" strokeLinecap="round" /></svg>
        <div style={{ display: 'flex', marginLeft: 22, fontFamily: 'Manrope', fontWeight: 500, fontSize: 40, color: t.onPanel }}>{a.q || L(lang, 'fisio en Sotogrande', 'physio in Sotogrande')}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', height: 124, borderRadius: 24, background: t.panel, border: `3px solid ${t.pop}`, padding: '0 28px', marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: 34, background: t.pop }}><Pulse color={t.onPop} s={44} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 22, flex: 1 }}>
          <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 700, fontSize: 36, color: t.onPanel }}>{a.you || L(lang, 'Tu negocio', 'Your business')}</div>
          <div style={{ display: 'flex', marginTop: 8 }}><Stars s={24} color={t.pop} /></div>
        </div>
        <svg width="46" height="46" viewBox="0 0 24 24"><path d={PIN} fill={t.pop} /><circle cx="12" cy="9.500" r="2.600" fill={t.panel} /></svg>
      </div>
      {dim(0)}{dim(1)}
    </div>
  )
}
function ArtMap({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const small = (x: number, y: number) => <g transform={`translate(${x} ${y}) scale(2)`}><path d={PIN} fill={t.skel} /><circle cx="12" cy="9.500" r="2.600" fill={t.panel} /></g>
  return (
    <div style={{ display: 'flex', position: 'relative', width: ART_W, height: ART_H, borderRadius: 32, background: t.panel, overflow: 'hidden' }}>
      <svg width={ART_W} height={ART_H} viewBox={`0 0 ${ART_W} ${ART_H}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <circle cx="770" cy="190" r="86" fill={t.panel2} />
        <rect x="60" y="250" width="150" height="90" rx="14" fill={t.panel2} />
        <path d="M-20 150 L940 84" stroke={t.panelLine} strokeWidth="28" />
        <path d="M-20 380 L940 316" stroke={t.panelLine} strokeWidth="18" />
        <path d="M250 -20 L330 500" stroke={t.panelLine} strokeWidth="22" />
        <path d="M660 -20 L610 500" stroke={t.panelLine} strokeWidth="16" />
        {small(120, 150)}{small(700, 330)}{small(470, 20)}{small(800, 60)}
        <circle cx="470" cy="236" r="104" fill={t.pop} opacity="0.14" />
        <circle cx="470" cy="236" r="62" fill={t.pop} opacity="0.24" />
        <g transform="translate(416 138) scale(4.500)"><path d={PIN} fill={t.pop} /><circle cx="12" cy="9.500" r="2.800" fill={t.panel} /></g>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 28, bottom: 28, background: t.panel2, border: `2px solid ${t.panelLine}`, borderRadius: 22, padding: '20px 26px' }}>
        <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 700, fontSize: 32, color: t.onPanel }}>{a.name || L(lang, 'Tu negocio', 'Your business')}</div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}><Stars s={22} color={t.pop} /><div style={{ display: 'flex', marginLeft: 12 }}><Mono px={19} color={t.subPanel}>{L(lang, 'Abierto ahora', 'Open now')}</Mono></div></div>
      </div>
    </div>
  )
}
function ArtPhone({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const slow = a.mode === 'slow'
  return (
    <div style={{ display: 'flex', position: 'relative', width: ART_W, height: ART_H, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', position: 'absolute', left: ART_W / 2 - 240, top: 0, width: 480, height: 480, borderRadius: 240, background: t.pop, opacity: 0.13 }} />
      <div style={{ display: 'flex', position: 'absolute', left: ART_W / 2 - 170, top: 70, width: 340, height: 340, borderRadius: 170, background: t.pop, opacity: 0.15 }} />
      <div style={{ display: 'flex', flexDirection: 'column', width: 286, height: 476, borderRadius: 48, border: `7px solid ${t.panelLine}`, background: t.panel, padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignSelf: 'center', width: 92, height: 18, borderRadius: 9, background: t.panelLine }} />
        {slow ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 56 }}>
            <Ring p={0.3} s={150} color={t.pop} track={t.panel2} />
            <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 64, color: t.onPanel, marginTop: 16 }}>{a.tag || '3 s'}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              <div style={{ display: 'flex', width: 34, height: 34, borderRadius: 17, background: t.skel }} />
              <div style={{ display: 'flex', marginLeft: 10 }}><Bar w={100} h={14} c={t.skel} /></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 116, borderRadius: 16, background: t.panel2, marginTop: 16, padding: 16 }}><Bar w="70%" h={16} c={t.skel} /><Bar w="45%" h={12} c={t.skel} mt={9} /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 72, borderRadius: 36, background: t.pop, marginTop: 18 }}>
              {a.tag ? null : <svg width="30" height="30" viewBox="0 0 24 24"><path d={HANDSET} fill={t.onPop} /></svg>}
              <div style={{ display: 'flex', marginLeft: a.tag ? 0 : 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: t.onPop }}>{a.tag || L(lang, 'Llamar', 'Call')}</div>
            </div>
            <Bar w="86%" h={14} c={t.skel} mt={20} /><Bar w="60%" h={14} c={t.skel} mt={11} />
          </div>
        )}
      </div>
    </div>
  )
}
function ArtAudit({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const labels = lang === 'en' ? ['Impression', 'Contact', 'Speed', 'SEO', 'Tracking', 'Design', 'Local', 'Legal'] : ['Impresión', 'Contacto', 'Velocidad', 'SEO', 'Medición', 'Diseño', 'Local', 'Legal']
  const ps = [0.85, 0.5, 0.35, 0.72, 0.4, 0.9, 0.6, 0.78]
  const tile = (i: number) => (
    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 194, height: 164, borderRadius: 18, background: t.panel2, marginRight: i % 4 === 3 ? 0 : 18 }}>
      <Ring p={ps[i]} s={82} color={ps[i] >= 0.7 ? t.pop : t.subPanel} track={t.panelLine} />
      <Mono px={18} color={t.onPanel} mt={10}>{labels[i]}</Mono>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W, height: ART_H, borderRadius: 28, background: t.panel, border: `2px solid ${t.panelLine}`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 70, padding: '0 26px', borderBottom: `2px solid ${t.panelLine}` }}>
        {[0, 1, 2].map(i => <div key={i} style={{ display: 'flex', width: 16, height: 16, borderRadius: 8, background: t.skel, marginRight: 10 }} />)}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, height: 42, borderRadius: 21, background: t.panel2, marginLeft: 16, padding: '0 20px', fontFamily: 'DM Mono', fontSize: 21, color: t.subPanel }}>impulsomedia.es</div>
      </div>
      {a.mode === 'input' ? (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '44px 36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 104, borderRadius: 20, background: t.panel2, border: `3px solid ${t.pop}`, padding: '0 14px 0 28px' }}>
            <div style={{ display: 'flex', flex: 1, fontFamily: 'Manrope', fontWeight: 500, fontSize: 40, color: t.onPanel }}>{a.q || L(lang, 'www.tuweb.es', 'www.yoursite.com')}</div>
            <div style={{ display: 'flex', alignItems: 'center', height: 76, borderRadius: 14, background: t.pop, padding: '0 30px', fontFamily: 'Manrope', fontWeight: 700, fontSize: 32, color: t.onPop }}>{L(lang, 'Analizar', 'Analyse')}</div>
          </div>
          <div style={{ display: 'flex', width: '100%', height: 16, borderRadius: 8, background: t.panel2, marginTop: 44 }}><div style={{ display: 'flex', width: '62%', height: 16, borderRadius: 8, background: t.pop }} /></div>
          <Mono px={20} color={t.subPanel} mt={18}>{L(lang, 'Leyendo tu portada…', 'Reading your homepage…')}</Mono>
          <div style={{ display: 'flex', marginTop: 34 }}>{[0, 1, 2, 3].map(i => <div key={i} style={{ display: 'flex', flex: 1, height: 70, borderRadius: 14, background: t.panel2, marginRight: i === 3 ? 0 : 16 }} />)}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '30px 30px 0' }}>
          <div style={{ display: 'flex' }}>{[0, 1, 2, 3].map(tile)}</div>
          <div style={{ display: 'flex', marginTop: 18 }}>{[4, 5, 6, 7].map(tile)}</div>
        </div>
      )}
    </div>
  )
}
function ArtChat({ a, t, lang }: { a: Art; t: T; lang: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}><Mono px={22} color={t.mute}>{a.time || '22:04'}</Mono></div>
      <div style={{ display: 'flex', alignSelf: 'flex-start', maxWidth: 700, background: t.panel, border: `2px solid ${t.panelLine}`, borderRadius: 30, borderBottomLeftRadius: 8, padding: '26px 32px', marginTop: 20, fontFamily: 'Manrope', fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: t.onPanel }}>{a.q || L(lang, 'Hola, ¿tenéis hueco mañana?', 'Hi, any slots tomorrow?')}</div>
      {a.a ? (
        <div style={{ display: 'flex', alignSelf: 'flex-end', maxWidth: 700, background: t.pop, borderRadius: 30, borderBottomRightRadius: 8, padding: '26px 32px', marginTop: 22, fontFamily: 'Manrope', fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: t.onPop }}>{a.a}</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-end', marginTop: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 76, borderRadius: 38, border: `3px dashed ${t.skel}`, padding: '0 30px' }}>{[0, 1, 2].map(i => <div key={i} style={{ display: 'flex', width: 16, height: 16, borderRadius: 8, background: t.skel, marginRight: i === 2 ? 0 : 12 }} />)}</div>
        </div>
      )}
      {a.note ? <div style={{ display: 'flex', alignSelf: a.a ? 'flex-start' : 'flex-end', marginTop: 16 }}><Mono px={21} color={t.mute}>{a.note}</Mono></div> : null}
    </div>
  )
}
function ArtReview({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const name = a.name || 'Ana'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W, background: t.panel, border: `2px solid ${t.panelLine}`, borderRadius: 28, padding: '32px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 76, height: 76, borderRadius: 38, background: t.panel2, fontFamily: 'Bricolage', fontWeight: 800, fontSize: 36, color: t.pop }}>{name.slice(0, 1).toUpperCase()}</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
          <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 700, fontSize: 32, color: t.onPanel }}>{name}</div>
          <div style={{ display: 'flex', marginTop: 6 }}><Stars s={26} color={t.pop} /></div>
        </div>
      </div>
      <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 500, fontSize: 36, lineHeight: 1.35, color: t.onPanel, marginTop: 22 }}>{a.text || L(lang, 'Muy buen trato y muy puntuales.', 'Friendly and always on time.')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `6px solid ${t.pop}`, paddingLeft: 24, marginTop: 26 }}>
        <Mono px={19} color={t.pop}>{L(lang, 'Respuesta del propietario', "Owner's reply")}</Mono>
        <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 500, fontSize: 33, lineHeight: 1.35, color: t.subPanel, marginTop: 10 }}>{a.reply || L(lang, 'Gracias, Ana, por confiar en nuestra clínica de Sotogrande.', 'Thank you, Ana, for trusting our clinic in Sotogrande.')}</div>
      </div>
    </div>
  )
}
function ArtRock({ a, t }: { a: Art; t: T; lang: string }) {
  const chip = (text: string, left: number, top: number) => (
    <div style={{ display: 'flex', position: 'absolute', left, top, background: t.panel, border: `2px solid ${t.panelLine}`, borderRadius: 16, padding: '10px 18px', fontFamily: 'DM Mono', fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.onPanel }}>{text}</div>
  )
  return (
    <div style={{ display: 'flex', position: 'relative', width: ART_W, height: ART_H }}>
      <svg width={ART_W} height={ART_H} viewBox={`0 0 ${ART_W} ${ART_H}`} fill="none" style={{ position: 'absolute', left: 0, top: 0 }}>
        <circle cx="250" cy="120" r="124" fill={t.pop} opacity="0.2" />
        <circle cx="250" cy="120" r="74" fill={t.pop} />
        <path d="M0 392 L0 352 L90 338 L210 346 L320 368 L400 392 Z" fill={t.panel} />
        <path d="M430 392 L470 366 L498 250 L524 150 L552 112 L590 124 L634 104 L676 132 L724 186 L780 262 L836 330 L880 364 L912 376 L912 392 Z" fill={t.panel2} />
        <path d="M430 392 L470 366 L498 250 L524 150 L552 112 L570 250 L560 392 Z" fill={t.panelLine} opacity="0.6" />
        <rect x="0" y="392" width={ART_W} height="6" fill={t.panelLine} />
        <path d="M60 430 H330 M420 430 H640 M700 430 H860 M160 462 H520 M600 462 H800" stroke={t.panelLine} strokeWidth="5" strokeLinecap="round" />
        <path d="M130 330 Q 300 190 478 300" stroke={t.pop} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 16" />
        <circle cx="130" cy="332" r="11" fill={t.pop} />
        <circle cx="482" cy="302" r="11" fill={t.pop} />
      </svg>
      {chip(a.a || 'Sotogrande', 20, 262)}
      {chip(a.b || 'Gibraltar', 640, 34)}
      {chip(a.c || '20 min', 330, 196)}
    </div>
  )
}
function ArtAd({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const dot = (n: number, top: number) => (
    <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 672, top, width: 54, height: 54, borderRadius: 27, background: t.onPanel === '#111418' ? '#111418' : '#f4f1ea', color: t.onPanel === '#111418' ? '#f4f1ea' : '#111418', fontFamily: 'DM Mono', fontSize: 25 }}>{n}</div>
  )
  return (
    <div style={{ display: 'flex', position: 'relative', width: ART_W, height: ART_H, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: 500, height: 476, borderRadius: 28, background: t.panel, border: `2px solid ${t.panelLine}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 26, background: t.pop }}><Pulse color={t.onPop} s={34} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 14 }}><Bar w={150} h={16} c={t.skel} /><Mono px={16} color={t.subPanel} mt={8}>{L(lang, 'Publicidad', 'Sponsored')}</Mono></div>
        </div>
        <div style={{ display: 'flex', position: 'relative', height: 190, background: t.panel2, overflow: 'hidden' }}>
          <div style={{ display: 'flex', position: 'absolute', left: 270, top: -40, width: 300, height: 300, borderRadius: 150, background: t.pop }} />
          <div style={{ display: 'flex', position: 'absolute', left: 30, top: 56, width: 200, height: 200, borderRadius: 26, background: t.panelLine }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '22px 22px 0' }}>
          <Bar w="80%" h={22} c={t.onPanel} /><Bar w="52%" h={16} c={t.skel} mt={14} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', height: 60, borderRadius: 30, background: t.pop, padding: '0 34px', marginTop: 22, fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: t.onPop }}>{a.tag || L(lang, 'Reservar', 'Book now')}</div>
        </div>
      </div>
      {dot(1, 18)}{dot(2, 150)}{dot(3, 286)}{dot(4, 372)}
    </div>
  )
}
function ArtCalendar({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const marks: number[] = Array.isArray(a.marks) ? a.marks : []
  const offset = Math.max(0, Math.min(6, Number(a.offset) || 0))
  const days = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const cw = (ART_W - 6 * 12) / 7
  const rows = [0, 1, 2, 3, 4]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W }}>
      <div style={{ display: 'flex' }}>{days.map((d, i) => <div key={i} style={{ display: 'flex', justifyContent: 'center', width: cw, marginRight: i === 6 ? 0 : 12, fontFamily: 'DM Mono', fontSize: 22, color: t.mute }}>{d}</div>)}</div>
      {rows.map(r => (
        <div key={r} style={{ display: 'flex', marginTop: 12 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(c => {
            const n = r * 7 + c - offset + 1, on = n >= 1 && n <= 31, hit = on && marks.includes(n)
            return <div key={c} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: cw, height: 74, borderRadius: 14, marginRight: c === 6 ? 0 : 12, background: hit ? t.pop : on ? t.panel : 'transparent', border: on && !hit ? `2px solid ${t.panelLine}` : '2px solid transparent', fontFamily: 'DM Mono', fontSize: 26, color: hit ? t.onPop : t.subPanel }}>{on ? String(n) : ''}</div>
          })}
        </div>
      ))}
    </div>
  )
}
function ArtForm({ t, lang }: { a: Art; t: T; lang: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: ART_W, height: ART_H }}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: 400, background: t.panel, borderRadius: 24, padding: '24px 26px', opacity: 0.62 }}>
        <Mono px={19} color={t.subPanel}>{L(lang, '8 campos', '8 fields')}</Mono>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} style={{ display: 'flex', height: 30, borderRadius: 8, background: t.panel2, marginTop: i ? 10 : 16 }} />)}
        <svg width="400" height="390" viewBox="0 0 400 390" style={{ position: 'absolute', left: 0, top: 0 }}><path d="M30 360 L370 40" stroke={t.subPanel} strokeWidth="6" strokeLinecap="round" /></svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 28, background: t.panel, border: `3px solid ${t.pop}`, borderRadius: 24, padding: '28px 30px' }}>
        <Mono px={19} color={t.pop}>{L(lang, '3 campos', '3 fields')}</Mono>
        {[L(lang, 'Nombre', 'Name'), L(lang, 'Teléfono', 'Phone'), L(lang, '¿Qué necesitas?', 'What do you need?')].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', height: 68, borderRadius: 14, background: t.panel2, marginTop: i ? 14 : 18, padding: '0 22px', fontFamily: 'Manrope', fontWeight: 500, fontSize: 28, color: t.subPanel }}>{f}</div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 74, borderRadius: 37, background: t.pop, marginTop: 20, fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, color: t.onPop }}>{L(lang, 'Enviar', 'Send')}</div>
      </div>
    </div>
  )
}
function ArtFlow({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const node = (label: string, icon: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 216, height: 216, borderRadius: 44, background: t.panel, border: `2px solid ${t.panelLine}` }}>
      {icon}
      <Mono px={21} color={t.onPanel} mt={16}>{label}</Mono>
    </div>
  )
  const dash = (
    <svg width="110" height="20" viewBox="0 0 110 20" fill="none"><path d="M8 10 H102" stroke={t.pop} strokeWidth="6" strokeLinecap="round" strokeDasharray="2 18" /></svg>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: ART_W, height: ART_H }}>
      {node(a.a || L(lang, 'Correo', 'Email'), <svg width="84" height="84" viewBox="0 0 24 24" fill="none"><rect x="3" y="5.500" width="18" height="13" rx="2.500" stroke={t.onPanel} strokeWidth="1.700" /><path d="M4 7.500l8 6 8-6" stroke={t.onPanel} strokeWidth="1.700" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
      {dash}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 248, height: 248, borderRadius: 124, background: t.pop }}>
        <Pulse color={t.onPop} s={104} />
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: 44, color: t.onPop, marginTop: 2 }}>{a.b || L(lang, 'IA', 'AI')}</div>
      </div>
      {dash}
      {node(a.c || L(lang, 'Agenda', 'Calendar'), <svg width="84" height="84" viewBox="0 0 24 24" fill="none"><rect x="3.500" y="5" width="17" height="15" rx="2.500" stroke={t.onPanel} strokeWidth="1.700" /><path d="M3.500 10h17M8 3v4M16 3v4" stroke={t.onPanel} strokeWidth="1.700" strokeLinecap="round" /><path d="M8.500 15l2.500 2.500 4.500-5" stroke={t.pop} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
    </div>
  )
}
function ArtSite({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const two = a.mode === 'langs'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W, height: ART_H, borderRadius: 28, background: t.panel, border: `2px solid ${t.panelLine}`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 70, padding: '0 26px', borderBottom: `2px solid ${t.panelLine}` }}>
        {[0, 1, 2].map(i => <div key={i} style={{ display: 'flex', width: 16, height: 16, borderRadius: 8, background: t.skel, marginRight: 10 }} />)}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, height: 42, borderRadius: 21, background: t.panel2, marginLeft: 16, padding: '0 20px', fontFamily: 'DM Mono', fontSize: 21, color: t.subPanel }}>{a.q || L(lang, 'tuweb.es', 'yoursite.com')}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 34px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: 38, height: 38, borderRadius: 19, background: t.pop }} />
          <div style={{ display: 'flex', marginLeft: 12 }}><Bar w={130} h={16} c={t.skel} /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Bar w={70} h={14} c={t.skel} /><div style={{ display: 'flex', marginLeft: 18 }}><Bar w={70} h={14} c={t.skel} /></div>
          {two ? (
            <div style={{ display: 'flex', marginLeft: 22, borderRadius: 20, border: `2px solid ${t.panelLine}`, overflow: 'hidden', fontFamily: 'DM Mono', fontSize: 20 }}>
              <div style={{ display: 'flex', padding: '7px 14px', background: t.pop, color: t.onPop }}>ES</div>
              <div style={{ display: 'flex', padding: '7px 14px', color: t.subPanel }}>EN</div>
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ display: 'flex', padding: '34px 34px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 30 }}>
          <Bar w="92%" h={34} c={t.onPanel} /><Bar w="64%" h={34} c={t.onPanel} mt={16} />
          <Bar w="84%" h={15} c={t.skel} mt={28} /><Bar w="70%" h={15} c={t.skel} mt={12} />
          <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', height: 66, borderRadius: 33, background: t.pop, padding: '0 34px', marginTop: 30, fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: t.onPop }}>{a.tag || L(lang, 'Contactar', 'Get in touch')}</div>
        </div>
        <div style={{ display: 'flex', position: 'relative', width: 300, height: 270, borderRadius: 22, background: t.panel2, overflow: 'hidden' }}>
          <div style={{ display: 'flex', position: 'absolute', left: 150, top: 30, width: 110, height: 110, borderRadius: 55, background: t.pop }} />
          <svg width="300" height="270" viewBox="0 0 300 270" style={{ position: 'absolute', left: 0, top: 0 }}><path d="M0 270 L0 210 L90 130 L150 190 L210 150 L300 230 L300 270 Z" fill={t.skel} /></svg>
        </div>
      </div>
    </div>
  )
}
function ArtChecklist({ a, t }: { a: Art; t: T; lang: string }) {
  const done = Math.max(0, Math.min(4, a.marks?.[0] ?? 2))
  const widths = ['62%', '78%', '54%', '70%']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: ART_W, background: t.panel, border: `2px solid ${t.panelLine}`, borderRadius: 28, padding: '14px 34px' }}>
      {widths.map((w, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', height: 102, borderTop: i ? `2px solid ${t.panelLine}` : '2px solid transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, borderRadius: 14, background: i < done ? t.pop : 'transparent', border: i < done ? `3px solid ${t.pop}` : `3px solid ${t.skel}` }}>
            {i < done ? <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M5 12.500l4.500 4.500L19 7.500" stroke={t.onPop} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
          </div>
          <div style={{ display: 'flex', flex: 1, marginLeft: 26 }}><Bar w={w} h={22} c={i < done ? t.onPanel : t.skel} /></div>
          <Mono px={22} color={t.subPanel}>{pad2(i + 1)}</Mono>
        </div>
      ))}
    </div>
  )
}
function ArtBox({ a, t, lang }: { a: Art; t: T; lang: string }) {
  const p = { a, t, lang }
  const el = a.k === 'search' ? <ArtSearch {...p} /> : a.k === 'map' ? <ArtMap {...p} /> : a.k === 'phone' ? <ArtPhone {...p} /> : a.k === 'audit' ? <ArtAudit {...p} /> : a.k === 'chat' ? <ArtChat {...p} />
    : a.k === 'review' ? <ArtReview {...p} /> : a.k === 'rock' ? <ArtRock {...p} /> : a.k === 'ad' ? <ArtAd {...p} /> : a.k === 'calendar' ? <ArtCalendar {...p} /> : a.k === 'form' ? <ArtForm {...p} /> : a.k === 'flow' ? <ArtFlow {...p} /> : a.k === 'site' ? <ArtSite {...p} /> : a.k === 'checklist' ? <ArtChecklist {...p} /> : null
  if (!el) return null
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: ART_W, height: ART_H, marginBottom: 30 }}>{el}</div>
}

// ---------- layouts ----------
function Eyebrow({ text, t, color }: { text: string; t: T; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'DM Mono', fontSize: 28, letterSpacing: '0.16em', textTransform: 'uppercase', color: color || t.mute }}>
      <div style={{ display: 'flex', width: 44, height: 4, background: t.accent, marginRight: 18 }} />
      <span>{text}</span>
    </div>
  )
}
function Body({ slide, t, lang, solo }: { slide: Slide; t: T; lang: string; solo?: boolean }) {
  const art = slide.art && (ART_KINDS as readonly string[]).includes(slide.art.k) ? slide.art : null
  const P = (text: string, px = 46, color = t.sub) => <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 500, fontSize: px, lineHeight: 1.4, color }}>{text}</div>
  const rule = <div style={{ display: 'flex', width: 120, height: 6, background: t.accent }} />
  const wrap = (text: any, bottomPad = 0) => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingBottom: art ? 0 : bottomPad }}>{text}</div>
      {art ? <ArtBox a={art} t={t} lang={lang} /> : null}
    </div>
  )
  if (slide.k === 'cover' || slide.k === 'poster' || slide.k === 'photo') {
    const big = slide.k === 'poster'
    const px = art ? size(slide.h, [[22, 108], [34, 96], [50, 84], [66, 74]], 66)
      : big ? size(slide.h, [[14, 200], [22, 164], [34, 142], [50, 122], [70, 104], [90, 92]], 84) : size(slide.h, [[22, 156], [34, 136], [50, 116], [70, 100], [90, 90]], 80)
    return wrap(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : rule}
        <div style={{ display: 'flex', marginTop: art ? 26 : 38 }}><Rich text={slide.h} px={px} t={t} /></div>
        {slide.sub ? <div style={{ display: 'flex', marginTop: art ? 22 : 36, maxWidth: 880 }}>{P(slide.sub, art ? 40 : 48)}</div> : null}
      </div>, big ? 150 : 200)
  }
  if (slide.k === 'point') {
    const px = art ? size(slide.h, [[24, 80], [40, 70], [60, 62]], 54) : size(slide.h, [[24, 104], [40, 90], [60, 78], [80, 68]], 60)
    return wrap(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: art ? 150 : 290, lineHeight: 0.86, letterSpacing: '-0.05em', color: t.accent }}>{slide.n}</div>
        <div style={{ display: 'flex', width: '100%', height: 2, background: t.line, marginTop: art ? 22 : 36, marginBottom: art ? 24 : 40 }} />
        <Rich text={slide.h} px={px} t={t} weight={700} />
        {slide.b ? <div style={{ display: 'flex', marginTop: art ? 18 : 30 }}>{P(slide.b, art ? 38 : 46)}</div> : null}
      </div>)
  }
  if (slide.k === 'text') {
    const px = art ? size(slide.h, [[24, 96], [40, 84], [60, 72]], 62) : size(slide.h, [[24, 124], [40, 106], [60, 90], [80, 78]], 68)
    return wrap(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : rule}
        <div style={{ display: 'flex', marginTop: art ? 24 : 36 }}><Rich text={slide.h} px={px} t={t} /></div>
        {slide.b ? <div style={{ display: 'flex', marginTop: art ? 20 : 36 }}>{P(slide.b, art ? 40 : 48)}</div> : null}
      </div>)
  }
  if (slide.k === 'list') {
    const items: string[] = (slide.items || []).slice(0, 6)
    // A list that is the whole post (single image) is set larger than a list inside a carousel.
    const px = solo ? size(slide.h, [[24, 116], [40, 100], [54, 86]], 76) : size(slide.h, [[24, 96], [40, 84], [54, 74]], 64)
    const ipx = solo ? (items.length > 4 ? 48 : items.length > 3 ? 54 : 60) : items.length > 4 ? 41 : items.length > 3 ? 46 : 54
    const mark = slide.mark === 'no' || slide.mark === 'yes' ? slide.mark : ''
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : rule}
        <div style={{ display: 'flex', marginTop: 34, marginBottom: 22 }}><Rich text={slide.h} px={px} t={t} /></div>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 28, paddingBottom: 28, borderTop: `2px solid ${t.line}` }}>
            {mark ? (
              <div style={{ display: 'flex', width: 78, marginTop: Math.round(ipx * 0.2) }}>
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none"><path d={mark === 'no' ? 'M6 6l12 12M18 6L6 18' : 'M4.500 12.500l5 5L19.500 7'} stroke={t.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            ) : <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: 28, color: t.accent, width: 78, marginTop: Math.round(ipx * 0.3) }}>{pad2(i + 1)}</div>}
            <div style={{ display: 'flex', flex: 1, fontFamily: 'Manrope', fontWeight: 700, fontSize: ipx, lineHeight: 1.3, color: t.fg }}>{it}</div>
          </div>
        ))}
      </div>
    )
  }
  if (slide.k === 'stat') {
    const bpx = art ? size(slide.big, [[3, 230], [5, 190], [8, 150]], 120) : size(slide.big, [[3, 400], [5, 300], [8, 210]], 160)
    return wrap(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {slide.eyebrow ? <Eyebrow text={slide.eyebrow} t={t} /> : null}
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 800, fontSize: bpx, lineHeight: 0.9, letterSpacing: '-0.05em', color: t.accent, marginTop: 22 }}>{slide.big}</div>
        <div style={{ display: 'flex', marginTop: art ? 20 : 34 }}><Rich text={slide.h} px={art ? size(slide.h, [[40, 62], [70, 54]], 48) : size(slide.h, [[30, 84], [50, 72], [70, 64], [100, 56]], 50)} t={t} weight={700} /></div>
        {slide.b ? <div style={{ display: 'flex', marginTop: art ? 16 : 28 }}>{P(slide.b, art ? 38 : 46)}</div> : null}
      </div>)
  }
  // cta
  const px = size(slide.h, [[20, 140], [32, 120], [48, 100], [64, 86]], 74)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingBottom: 200 }}>
      <Pulse color={t.accent} s={130} />
      <div style={{ display: 'flex', marginTop: 44 }}><Rich text={slide.h} px={px} t={t} /></div>
      {slide.sub ? <div style={{ display: 'flex', marginTop: 30 }}>{P(slide.sub, 48)}</div> : null}
      {slide.url ? (
        <div style={{ display: 'flex', marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: t.block, color: t.onBlock, borderRadius: 999, padding: '26px 42px', fontFamily: 'Manrope', fontWeight: 700, fontSize: 38 }}>{slide.url}</div>
        </div>
      ) : null}
    </div>
  )
}
function Logo({ t, mark, a, b }: { t: T; mark: string; a: string; b: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Pulse color={mark} s={50} />
      <div style={{ display: 'flex', marginLeft: 16, fontFamily: 'Syne', fontWeight: 800, fontSize: 28, letterSpacing: '0.14em' }}>
        <span style={{ color: a }}>IMPULSO</span>
        <span style={{ color: b, marginLeft: 10 }}>MEDIA</span>
      </div>
    </div>
  )
}
// Two statements set against each other: the top half on the theme background, the bottom half on a solid block.
function Versus({ post, index }: { post: SlidePost; index: number }) {
  const t = THEMES[post.theme] || THEMES.dark
  const s = post.slides[index], total = post.slides.length
  const half = (label: string, h: string, b: string, fg: string, sub: string, lab: string, hi: string, onHi: string) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'DM Mono', fontSize: 28, letterSpacing: '0.16em', textTransform: 'uppercase', color: lab }}>{label}</div>
      <div style={{ display: 'flex', marginTop: 22 }}><Rich text={h} px={size(h, [[20, 104], [32, 90], [46, 78]], 68)} t={t} color={fg} hi={hi} onHi={onHi} /></div>
      {b ? <div style={{ display: 'flex', marginTop: 20, fontFamily: 'Manrope', fontWeight: 500, fontSize: 42, lineHeight: 1.38, color: sub }}>{b}</div> : null}
    </div>
  )
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, display: 'flex', flexDirection: 'column', background: t.bg }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: SLIDE_H / 2, padding: `78px ${PAD}px 0` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo t={t} mark={post.theme === 'gold' ? '#111418' : t.accent} a={t.fg} b={t.logoB} />
          {total > 1 ? <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.08em', color: t.mute }}>{`${pad2(index + 1)} / ${pad2(total)}`}</div> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>{half(s.la, s.ha, s.ba, t.fg, t.sub, t.mute, t.accent, t.onAccent)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: SLIDE_H / 2, background: t.block, padding: `0 ${PAD}px 70px` }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>{half(s.lb, s.hb, s.bb, t.onBlock, t.subBlock, t.subBlock, t.onBlock, t.block)}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.06em', color: t.subBlock }}>
          <span>impulsomedia.es</span>
          {total > 1 && index < total - 1 ? <span>{post.lang === 'en' ? 'Swipe →' : 'Desliza →'}</span> : <span />}
        </div>
      </div>
    </div>
  )
}

// A real photo as the whole slide, with the text set over a dark fade at the bottom.
function Photo({ post, index, src }: { post: SlidePost; index: number; src: string }) {
  const t = THEMES.dark
  const s = post.slides[index], total = post.slides.length
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: t.bg, color: t.fg }}>
      <img src={src} width={SLIDE_W} height={SLIDE_H} style={{ position: 'absolute', left: 0, top: 0, width: SLIDE_W, height: SLIDE_H, objectFit: 'cover' }} />
      <div style={{ display: 'flex', position: 'absolute', left: 0, top: 0, width: SLIDE_W, height: 320, backgroundImage: 'linear-gradient(to bottom, rgba(17,20,24,0.72), rgba(17,20,24,0))' }} />
      <div style={{ display: 'flex', position: 'absolute', left: 0, top: 560, width: SLIDE_W, height: SLIDE_H - 560, backgroundImage: 'linear-gradient(to bottom, rgba(17,20,24,0), rgba(17,20,24,0.9) 46%, rgba(17,20,24,0.98))' }} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: `78px ${PAD}px 70px` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo t={t} mark={t.accent} a={t.fg} b={t.logoB} />
          {total > 1 ? <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.08em', color: t.fg }}>{`${pad2(index + 1)} / ${pad2(total)}`}</div> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'flex-end', paddingBottom: 54 }}>
          {s.eyebrow ? <div style={{ display: 'flex' }}><div style={{ display: 'flex', background: t.accent, color: t.onAccent, borderRadius: 999, padding: '10px 22px', fontFamily: 'DM Mono', fontSize: 25, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{s.eyebrow}</div></div> : null}
          <div style={{ display: 'flex', marginTop: 26 }}><Rich text={s.h} px={size(s.h, [[16, 150], [26, 124], [40, 104], [60, 88]], 76)} t={t} /></div>
          {s.sub ? <div style={{ display: 'flex', marginTop: 24, fontFamily: 'Manrope', fontWeight: 500, fontSize: 44, lineHeight: 1.38, color: t.fg }}>{s.sub}</div> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.06em', color: t.sub }}>
          <span>impulsomedia.es</span>
          {total > 1 && index < total - 1 ? <span style={{ color: t.accent }}>{post.lang === 'en' ? 'Swipe →' : 'Desliza →'}</span> : <span />}
        </div>
      </div>
    </div>
  )
}

function Card({ post, index, photo }: { post: SlidePost; index: number; photo?: string | null }) {
  const t = THEMES[post.theme] || THEMES.dark
  const total = post.slides.length
  const slide = post.slides[index]
  if (slide.k === 'versus') return <Versus post={post} index={index} />
  if (slide.k === 'photo' && photo) return <Photo post={post} index={index} src={photo} />
  const last = index === total - 1
  const deco = !slide.art && (slide.k === 'cover' || slide.k === 'poster' || slide.k === 'cta')
  return (
    <div style={{ width: SLIDE_W, height: SLIDE_H, display: 'flex', flexDirection: 'column', backgroundColor: t.bg, backgroundImage: `radial-gradient(circle at 88% 8%, ${t.glow}, rgba(0,0,0,0) 58%)`, color: t.fg, padding: `78px ${PAD}px 70px`, position: 'relative' }}>
      {deco ? (
        <div style={{ display: 'flex', position: 'absolute', left: 0, bottom: 118, width: SLIDE_W }}>
          <Beat color={t.accent} opacity={post.theme === 'gold' ? 0.22 : 0.3} />
        </div>
      ) : null}
      {deco && slide.k === 'poster' ? (
        <svg width="760" height="760" viewBox="0 0 760 760" fill="none" style={{ position: 'absolute', left: 560, top: -260 }}><circle cx="380" cy="380" r="370" stroke={t.accent} strokeWidth="3" opacity={post.theme === 'gold' ? 0.3 : 0.22} fill="none" /><circle cx="380" cy="380" r="280" stroke={t.accent} strokeWidth="3" opacity={post.theme === 'gold' ? 0.2 : 0.14} fill="none" /></svg>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo t={t} mark={post.theme === 'gold' ? '#111418' : t.accent} a={t.fg} b={t.logoB} />
        {total > 1 ? <div style={{ display: 'flex', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.08em', color: t.mute }}>{`${pad2(index + 1)} / ${pad2(total)}`}</div> : null}
      </div>
      <Body slide={slide} t={t} lang={post.lang} solo={total === 1} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Mono', fontSize: 27, letterSpacing: '0.06em', color: t.mute }}>
        <span>impulsomedia.es</span>
        {total > 1 && !last ? <span style={{ color: t.accent }}>{post.lang === 'en' ? 'Swipe →' : 'Desliza →'}</span> : <span />}
      </div>
    </div>
  )
}

export async function renderSlidePng(post: SlidePost, index: number): Promise<Buffer> {
  const sl = post.slides[index]
  const photo = sl?.k === 'photo' ? await photoData(sl.img) : null
  const res = new ImageResponse(<Card post={post} index={index} photo={photo} />, { width: SLIDE_W, height: SLIDE_H, fonts: (await fonts()) as any })
  return Buffer.from(await res.arrayBuffer())
}

// Instagram only accepts JPG, so every slide is delivered as one.
export async function renderSlideJpeg(post: SlidePost, index: number, width = SLIDE_W): Promise<Buffer> {
  const png = await renderSlidePng(post, index)
  let img = sharp(png)
  if (width !== SLIDE_W) img = img.resize({ width })
  return img.jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toBuffer()
}

const s = (x: any, n: number) => String(x ?? '').replace(/\s+/g, ' ').trim().slice(0, n)
function cleanArt(raw: any): Art | undefined {
  if (!raw || !(ART_KINDS as readonly string[]).includes(raw.k)) return undefined
  const a: Art = { k: raw.k }
  for (const key of ['q', 'you', 'name', 'tag', 'time', 'a', 'b', 'c', 'note']) if (raw[key]) a[key] = s(raw[key], 70)
  for (const key of ['text', 'reply']) if (raw[key]) a[key] = s(raw[key], 110)
  if (raw.mode) a.mode = s(raw.mode, 10)
  if (Array.isArray(raw.marks)) a.marks = raw.marks.map((n: any) => Number(n)).filter((n: number) => n >= 1 && n <= 31).slice(0, 12)
  if (raw.offset != null) a.offset = Math.max(0, Math.min(6, Number(raw.offset) || 0))
  return a
}
export function cleanSlides(raw: any): Slide[] {
  const out: Slide[] = []
  for (const r of Array.isArray(raw) ? raw.slice(0, 10) : []) {
    const k = r?.k
    const art = cleanArt(r?.art)
    const withArt = (x: Slide) => { if (art) x.art = art; out.push(x) }
    if (k === 'photo' && PHOTOS[r.img]) out.push({ k, img: r.img, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 110), sub: s(r.sub, 150) || undefined })
    else if (k === 'cover' || k === 'poster') withArt({ k, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 110), sub: s(r.sub, 150) || undefined })
    else if (k === 'point') withArt({ k, n: s(r.n, 3) || String(out.length), h: s(r.h, 100), b: s(r.b, 200) || undefined })
    else if (k === 'text') withArt({ k, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 110), b: s(r.b, 240) || undefined })
    else if (k === 'list') out.push({ k, eyebrow: s(r.eyebrow, 40) || undefined, h: s(r.h, 70), items: (Array.isArray(r.items) ? r.items : []).map((i: any) => s(i, 80)).filter(Boolean).slice(0, 6), ...(r.mark === 'no' || r.mark === 'yes' ? { mark: r.mark } : {}) })
    else if (k === 'stat') withArt({ k, eyebrow: s(r.eyebrow, 40) || undefined, big: s(r.big, 10), h: s(r.h, 120), b: s(r.b, 200) || undefined })
    else if (k === 'versus') out.push({ k, la: s(r.la, 40), ha: s(r.ha, 70), ba: s(r.ba, 130) || undefined, lb: s(r.lb, 40), hb: s(r.hb, 70), bb: s(r.bb, 130) || undefined, h: s(r.ha, 70) })
    else if (k === 'cta') out.push({ k, h: s(r.h, 80), sub: s(r.sub, 140) || undefined, url: s(r.url, 44) || undefined })
  }
  return out.filter(x => x.h)
}
