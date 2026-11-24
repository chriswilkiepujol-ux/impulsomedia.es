// New drafts for the feed. POST = the owner pressed "Generar más" (optionally with a topic). GET = daily cron top-up.
import { NextResponse } from 'next/server'
import { ownerFromRequest, isCron, botClient, getSettings, generateDrafts } from '@/lib/social/core'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: Request) {
  const sb = await ownerFromRequest(req)
  if (!sb) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const { n, topic } = await req.json().catch(() => ({}))
  const r = await generateDrafts(sb, { n: Number(n) || 3, topic })
  return NextResponse.json(r, { status: r.ok ? 200 : 500 })
}

export async function GET(req: Request) {
  if (!isCron(req)) return NextResponse.json({ error: 'no auth' }, { status: 401 })
  const sb = await botClient()
  const s = await getSettings(sb)
  if (!s.autogenerate) return NextResponse.json({ skipped: 'autogenerate off' })
  const { count } = await sb.from('social_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft')
  if ((count || 0) >= (s.min_drafts || 8)) return NextResponse.json({ skipped: 'enough drafts', drafts: count })
  return NextResponse.json(await generateDrafts(sb, { n: s.gen_per_run || 3 }))
}
