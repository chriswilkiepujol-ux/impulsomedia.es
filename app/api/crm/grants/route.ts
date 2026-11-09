// CRM → Grant alerts → "Check now" (and the daily cron): looks for new digitalisation calls.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { fromBdns, fromBoe, storeGrants } from '@/lib/grants'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { days, debug } = await req.json().catch(() => ({}))
  const dbg: any[] | undefined = debug ? [] : undefined
  const [a, b] = await Promise.all([fromBdns(Math.min(Number(days) || 14, 180), dbg), fromBoe(Math.min(Number(days) || 7, 14), dbg)])
  const r = await storeGrants(sb, [...a, ...b])
  return NextResponse.json({ ok: true, bdns: a.length, boe: b.length, ...r, debug: dbg })
}
