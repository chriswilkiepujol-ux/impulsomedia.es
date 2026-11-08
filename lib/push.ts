// Web Push to the installed CRM app (crm.impulsomedia.es). Subscriptions live in crm_push_subs.
// Lock-screen text never carries money amounts or personal details beyond a business name/domain.
import webpush from 'web-push'
import { createHmac, timingSafeEqual } from 'crypto'

export const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BLVRTpckbQp9au7eVMNAyYRen5e11WXNzXMqGuw4WsMP660mlg-eB6S2NMwXGk9WYUzvHWQjnzEm0BS74scXL9Y'
export type PushType = 'audits' | 'requests' | 'digest' | 'test'
export type PushMsg = { title: string; body: string; url?: string; tag?: string; type: PushType; snoozeLead?: string | null }

// Signed, short-lived token so "Remind me tomorrow" works from the lock screen without logging in.
const key = () => process.env.VAPID_PRIVATE_KEY || ''
export function snoozeToken(lead: string, exp: number) { return createHmac('sha256', key()).update(`snooze.${lead}.${exp}`).digest('base64url') }
export function snoozeOk(lead: string, exp: number, sig: string) {
  if (!key() || !lead || !exp || exp < Date.now() / 1000) return false
  const a = Buffer.from(snoozeToken(lead, exp)), b = Buffer.from(String(sig))
  return a.length === b.length && timingSafeEqual(a, b)
}

let configured = false
function configure() {
  if (configured) return true
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!priv) return false
  webpush.setVapidDetails('mailto:chris@impulsomedia.es', VAPID_PUBLIC, priv)
  configured = true
  return true
}

export const pushConfigured = () => configure()

// sb must be an owner/bot client (RLS). Returns how many devices received it.
export async function sendPush(sb: any, msg: PushMsg): Promise<number> {
  if (!configure()) return 0
  const { data: subs } = await sb.from('crm_push_subs').select('endpoint,keys,prefs')
  if (!subs?.length) return 0
  const weekend = [0, 6].includes(new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })).getDay())
  let n = 0
  await Promise.all(subs.map(async (s: any) => {
    const p = s.prefs || {}
    if (msg.type !== 'test' && p[msg.type] === false) return
    if (msg.type === 'digest' && weekend && !p.weekend_digest) return
    try {
      const exp = Math.floor(Date.now() / 1000) + 3 * 86400
      const snooze = msg.snoozeLead ? { lead: msg.snoozeLead, exp, sig: snoozeToken(msg.snoozeLead, exp) } : undefined
      await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify({ title: msg.title, body: msg.body, url: msg.url || '/', tag: msg.tag || msg.type, snooze }), { TTL: 60 * 60 * 12, urgency: msg.type === 'digest' ? 'normal' : 'high' })
      n++
      await sb.from('crm_push_subs').update({ last_ok_at: new Date().toISOString() }).eq('endpoint', s.endpoint)
    } catch (e: any) {
      // 404/410: the browser dropped the subscription (app uninstalled, permission revoked).
      if (e?.statusCode === 404 || e?.statusCode === 410) await sb.from('crm_push_subs').delete().eq('endpoint', s.endpoint)
    }
  }))
  return n
}
