// Live preview while editing a post in the app: renders one slide from the JSON in the request. Owner only.
import { NextResponse } from 'next/server'
import { ownerFromRequest } from '@/lib/social/core'
import { renderSlideJpeg, cleanSlides } from '@/lib/social/slides'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  if (!(await ownerFromRequest(req))) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const b = await req.json().catch(() => ({}))
  const slides = cleanSlides(b.slides)
  const i = Math.max(0, Math.min(slides.length - 1, Number(b.index) || 0))
  if (!slides.length) return NextResponse.json({ error: 'empty' }, { status: 400 })
  const jpg = await renderSlideJpeg({ slides, theme: ['dark', 'light', 'gold'].includes(b.theme) ? b.theme : 'dark', lang: b.lang === 'en' ? 'en' : 'es' }, i, 540)
  return new Response(new Uint8Array(jpg), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'no-store' } })
}
