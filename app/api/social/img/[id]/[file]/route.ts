// Public JPG of one slide of one post: /api/social/img/<post uuid>/<n>.jpg
// Public on purpose (Instagram has to download it). The post id is an unguessable UUID and only slide content is exposed.
import { crmAnonClient } from '@/lib/crm-supabase'
import { renderSlideJpeg, cleanSlides } from '@/lib/social/slides'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const noindex = { 'x-robots-tag': 'noindex, nofollow, noarchive' }

export async function GET(req: Request, ctx: { params: Promise<{ id: string; file: string }> }) {
  const { id, file } = await ctx.params
  const n = parseInt(file, 10)
  // Fixed sample slide: a health check for the renderer that needs no database row.
  if (id === 'demo') {
    const jpg = await renderSlideJpeg({ slides: [{ k: 'cover', eyebrow: 'Impulso Social', h: 'El generador de imágenes funciona', sub: 'Imagen de prueba.' }], theme: 'dark', lang: 'es' }, 0, 540)
    return new Response(new Uint8Array(jpg), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'no-store', ...noindex } })
  }
  if (!UUID.test(id) || !n || n < 1 || n > 10) return new Response('Not found', { status: 404, headers: noindex })
  const { data, error } = await crmAnonClient().rpc('social_public_slides', { p_id: id })
  if (error || !data) return new Response('Not found', { status: 404, headers: noindex })
  const slides = cleanSlides(data.slides)
  if (n > slides.length) return new Response('Not found', { status: 404, headers: noindex })
  const w = new URL(req.url).searchParams.get('w')
  const width = w === '540' ? 540 : 1080
  try {
    const jpg = await renderSlideJpeg({ slides, theme: data.theme, lang: data.lang }, n - 1, width)
    return new Response(new Uint8Array(jpg), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, s-maxage=31536000, immutable', ...noindex } })
  } catch (e: any) {
    console.error('[social] render', id, n, String(e?.message || e).slice(0, 300))
    return new Response('Render error', { status: 500, headers: noindex })
  }
}
