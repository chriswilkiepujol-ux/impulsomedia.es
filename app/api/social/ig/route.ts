// Instagram connection for the app's settings screen. The token is stored in social_settings (owner-only RLS) and never sent back.
import { NextResponse } from 'next/server'
import { ownerFromRequest, getSettings, igIdentify, log } from '@/lib/social/core'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  const sb = await ownerFromRequest(req)
  if (!sb) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const { action, token } = await req.json().catch(() => ({}))
  if (action === 'connect') {
    const t = String(token || '').trim()
    if (t.length < 40) return NextResponse.json({ error: 'That token looks incomplete. Copy the whole thing.' }, { status: 400 })
    try {
      const me = await igIdentify(t)
      const now = new Date().toISOString()
      const { error } = await sb.from('social_settings').update({ ig_token: t, ig_user_id: me.id, ig_username: me.username, ig_token_at: now, ig_checked_at: now }).eq('id', 1)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      await log(sb, 'ig_connected', null, { username: me.username })
      return NextResponse.json({ ok: true, username: me.username })
    } catch (e: any) { return NextResponse.json({ error: String(e?.message || e).slice(0, 300) }, { status: 400 }) }
  }
  if (action === 'check') {
    const s = await getSettings(sb)
    if (!s.ig_token) return NextResponse.json({ connected: false })
    try {
      const me = await igIdentify(s.ig_token)
      await sb.from('social_settings').update({ ig_checked_at: new Date().toISOString(), ig_username: me.username }).eq('id', 1)
      return NextResponse.json({ connected: true, username: me.username })
    } catch (e: any) { return NextResponse.json({ connected: false, error: String(e?.message || e).slice(0, 300) }) }
  }
  if (action === 'disconnect') {
    await sb.from('social_settings').update({ ig_token: null, ig_user_id: null, ig_username: null, ig_token_at: null }).eq('id', 1)
    await log(sb, 'ig_disconnected', null, {})
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'bad_action' }, { status: 400 })
}
