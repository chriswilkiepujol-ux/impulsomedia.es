// Finds the owner / best person to contact for one lead (public business sources only) and saves it.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { findPeople, savePeople } from '@/lib/people'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { id } = await req.json().catch(() => ({}))
  const { data: lead } = await sb.from('crm_leads').select('*').eq('id', String(id || '')).single()
  if (!lead) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (lead.do_not_contact) return NextResponse.json({ ok: true, skipped: 'do_not_contact' })
  const res = await findPeople(lead)
  return NextResponse.json({ ok: true, ...(await savePeople(sb, lead, res)) })
}
