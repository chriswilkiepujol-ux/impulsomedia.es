// CRM → Outbox: Chris approves (sends) or rejects a queued email. Owner token only.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { sendOutbox } from '@/lib/outbox'
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { data: u } = await sb.auth.getUser(); if (!u?.user) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const { id, action, subject } = await req.json().catch(() => ({}))
  if (action === 'reject') { await sb.from('crm_outbox').update({ status: 'rejected', decided_at: new Date().toISOString() }).eq('id', id).eq('status', 'pending'); return NextResponse.json({ ok: true }) }
  if (action === 'send') return NextResponse.json(await sendOutbox(sb, String(id), { subject }))
  return NextResponse.json({ error: 'bad_action' }, { status: 400 })
}
