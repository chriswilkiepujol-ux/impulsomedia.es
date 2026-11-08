import { NextResponse } from 'next/server'
import { crmAnonClient } from '@/lib/crm-supabase'
import { snoozeOk } from '@/lib/push'

export const dynamic = 'force-dynamic'

// Called by the service worker when "Remind me tomorrow" is tapped on a notification.
export async function POST(req: Request) {
  let b: any; try { b = await req.json() } catch { return NextResponse.json({ error: 'bad_json' }, { status: 400 }) }
  const lead = String(b?.lead || ''), exp = Number(b?.exp), sig = String(b?.sig || '')
  if (!/^[0-9a-f-]{36}$/.test(lead) || !snoozeOk(lead, exp, sig)) return NextResponse.json({ error: 'invalid' }, { status: 401 })
  const sb = crmAnonClient()
  const { error } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (error) return NextResponse.json({ error: 'auth' }, { status: 500 })
  const t = new Date(); t.setUTCDate(t.getUTCDate() + 1); t.setUTCHours(8, 0, 0, 0) // 09:00 Madrid in winter, 10:00 in summer
  await sb.from('crm_leads').update({ next_action_at: t.toISOString() }).eq('id', lead)
  await sb.from('crm_activities').insert({ lead_id: lead, type: 'estado', body: 'Snoozed to tomorrow from a phone notification' })
  return NextResponse.json({ ok: true })
}
