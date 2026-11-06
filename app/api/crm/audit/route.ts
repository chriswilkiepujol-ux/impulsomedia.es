import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { auditLead } from '@/lib/crm-audit'
export const maxDuration = 60
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { id } = await req.json()
  const { data: lead, error } = await sb.from('crm_leads').select('*').eq('id', id).single()
  if (error || !lead) return NextResponse.json({ error: 'no encontrado' }, { status: 404 })
  return NextResponse.json(await auditLead(sb, lead))
}
