// Recomputes the opportunity score for every lead from data already stored (latest audit + ad numbers). No outside calls.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
import { opportunity } from '@/lib/opportunity'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const sb = crmTokenClient(token)
  const { data: leads } = await sb.from('crm_leads').select('*').eq('relationship', 'lead')
  const { data: audits } = await sb.from('crm_audits').select('*').order('audited_at', { ascending: false }).limit(5000)
  const last = new Map<string, any>(); for (const a of audits || []) if (!last.has(a.lead_id)) last.set(a.lead_id, a)
  let n = 0; const now = new Date().toISOString()
  for (const l of leads || []) {
    const o = opportunity(l, last.get(l.id) || null, l.ads_counts)
    await sb.from('crm_leads').update({ opp_score: o.score, opp_tier: o.tier, opp_why: o.why, opp_value: o.value, opp_at: now }).eq('id', l.id); n++
  }
  return NextResponse.json({ ok: true, rescored: n })
}
