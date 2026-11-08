import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { sendPush, VAPID_PUBLIC, pushConfigured } from '@/lib/push'

export const dynamic = 'force-dynamic'
const json = (b: any, s = 200) => NextResponse.json(b, { status: s, headers: { 'cache-control': 'no-store' } })
const PREF_KEYS = ['audits', 'requests', 'opens', 'digest', 'weekend_digest']

// Signed-in CRM user only (same Bearer token as the rest of the CRM; RLS checks the owner).
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return json({ error: 'no auth' }, 401)
  const sb = crmTokenClient(token)
  const { data: u } = await sb.auth.getUser(token)
  if (!u?.user) return json({ error: 'no auth' }, 401)
  let body: any; try { body = await req.json() } catch { return json({ error: 'bad_json' }, 400) }
  const sub = body.subscription
  if (body.action === 'key') return json({ key: VAPID_PUBLIC })
  if (body.action === 'subscribe') {
    if (!sub?.endpoint || !/^https:\/\//.test(sub.endpoint) || !sub.keys?.p256dh || !sub.keys?.auth) return json({ error: 'bad_sub' }, 400)
    const { error } = await sb.from('crm_push_subs').upsert({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth }, user_agent: String(req.headers.get('user-agent') || '').slice(0, 200) }, { onConflict: 'endpoint' })
    return error ? json({ error: error.message }, 500) : json({ ok: true })
  }
  if (body.action === 'prefs') {
    if (!sub?.endpoint) return json({ error: 'bad_sub' }, 400)
    const prefs: Record<string, boolean> = {}
    for (const k of PREF_KEYS) if (typeof body.prefs?.[k] === 'boolean') prefs[k] = body.prefs[k]
    const { data: cur } = await sb.from('crm_push_subs').select('prefs').eq('endpoint', sub.endpoint).single()
    await sb.from('crm_push_subs').update({ prefs: { ...(cur?.prefs || {}), ...prefs } }).eq('endpoint', sub.endpoint)
    return json({ ok: true })
  }
  if (body.action === 'get') {
    const { data } = sub?.endpoint ? await sb.from('crm_push_subs').select('prefs').eq('endpoint', sub.endpoint).single() : { data: null }
    return json({ prefs: data?.prefs || null })
  }
  if (body.action === 'unsubscribe') {
    if (sub?.endpoint) await sb.from('crm_push_subs').delete().eq('endpoint', sub.endpoint)
    return json({ ok: true })
  }
  if (body.action === 'test') {
    const n = await sendPush(sb, { type: 'test', title: 'ImpulsoMedia CRM', body: 'Notifications are working on this device.', url: '/', tag: 'test' })
    const { count } = await sb.from('crm_push_subs').select('endpoint', { count: 'exact', head: true })
    return json({ ok: true, sent: n, devices: count || 0, configured: pushConfigured() })
  }
  return json({ error: 'bad_action' }, 400)
}
