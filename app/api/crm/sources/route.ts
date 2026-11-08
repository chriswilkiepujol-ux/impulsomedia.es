// CRM → "Find new businesses" → Run: fetch one free source and store new candidates for review.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { fromOsm, fromAds, fromBorme, storeCandidates } from '@/lib/lead-sources'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { data: u } = await sb.auth.getUser(); if (!u?.user) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const { source, days } = await req.json().catch(() => ({}))
  try {
    const list = source === 'osm' ? await fromOsm() : source === 'ads' ? await fromAds() : source === 'borme' ? await fromBorme(Math.min(Number(days) || 10, 20)) : null
    if (!list) return NextResponse.json({ error: 'bad_source' }, { status: 400 })
    return NextResponse.json({ ok: true, ...(await storeCandidates(sb, list)) })
  } catch (e: any) { return NextResponse.json({ error: String(e?.message || e).slice(0, 200) }, { status: 502 }) }
}
