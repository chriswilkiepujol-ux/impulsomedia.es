// Runs every 15 minutes: publishes the liked post whose time has come (one per run), keeps the Instagram token fresh
// and frees posts stuck in "publishing". Nothing is published unless Chris liked it in the app first.
import { NextResponse } from 'next/server'
import { isCron, botClient, getSettings, publishPost, igRefresh, log } from '@/lib/social/core'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(req: Request) {
  if (!isCron(req)) return NextResponse.json({ error: 'no auth' }, { status: 401 })
  const sb = await botClient()
  const s = await getSettings(sb)
  const out: any = {}
  // A run that died mid-publish must not leave the post locked, and must not be retried blindly (it may already be on Instagram).
  const { data: stuck } = await sb.from('social_posts').update({ status: 'failed', error: 'Publishing stopped halfway. Check Instagram to see whether it went out before you retry.' }).eq('status', 'publishing').lt('updated_at', new Date(Date.now() - 20 * 60 * 1000).toISOString()).select('id')
  if (stuck?.length) out.unstuck = stuck.length
  if (s.ig_token && s.ig_token_at && Date.now() - new Date(s.ig_token_at).getTime() > 20 * 864e5) {
    try { const t = await igRefresh(s.ig_token); if (t) { await sb.from('social_settings').update({ ig_token: t, ig_token_at: new Date().toISOString() }).eq('id', 1); out.token = 'refreshed' } }
    catch (e: any) { out.token = String(e?.message || e).slice(0, 200); await log(sb, 'token_refresh_failed', null, { error: out.token }) }
  }
  if (!s.ig_token || !s.autopublish) return NextResponse.json({ ...out, skipped: s.ig_token ? 'autopublish off' : 'instagram not connected' })
  // Only posts due in the last 36 hours go out on their own; older ones wait in the app for a new date.
  const { data: due } = await sb.from('social_posts').select('id,title,scheduled_at').eq('status', 'approved').lte('scheduled_at', new Date().toISOString()).gte('scheduled_at', new Date(Date.now() - 36 * 3600 * 1000).toISOString()).order('scheduled_at', { ascending: true }).limit(1)
  if (!due?.length) return NextResponse.json({ ...out, due: 0 })
  const r = await publishPost(sb, due[0].id)
  return NextResponse.json({ ...out, post: due[0].title, ...r })
}
