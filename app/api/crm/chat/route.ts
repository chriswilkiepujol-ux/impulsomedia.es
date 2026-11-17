// Claude chat inside a lead/client page. Each lead keeps its own history in crm_chat.
// Claude gets the lead's CRM context (details, audit facts, people, activity, deals) on every turn.
import { NextResponse } from 'next/server'
import { crmTokenClient } from '@/lib/crm-supabase'
export const maxDuration = 180
export const dynamic = 'force-dynamic'

const MODEL = process.env.CRM_CHAT_MODEL || 'claude-opus-5-5'

const pickLead = (l: any) => {
  const keep = ['name', 'legal_name', 'category', 'area', 'website', 'phone', 'email', 'address', 'status', 'relationship', 'lead_type', 'origin', 'contact_name', 'contact_role', 'contacted_at', 'next_action_at', 'notes', 'google_rating', 'google_reviews', 'primary_pitch', 'pitch_angle', 'opp_tier', 'opp_score', 'opp_value', 'opp_why', 'priority_why', 'ads_live', 'ads_counts', 'agency_name', 'agency_evidence', 'fact_fixes', 'legal_owner_note', 'deal_monthly', 'deal_one_off', 'client_code']
  return Object.fromEntries(keep.filter(k => l[k] != null && l[k] !== '').map(k => [k, l[k]]))
}

export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return NextResponse.json({ error: 'no_ai_key' }, { status: 500 })
  const sb = crmTokenClient(token)
  const { lead_id, message } = await req.json().catch(() => ({}))
  const text = String(message || '').trim().slice(0, 8000)
  if (!lead_id || !text) return NextResponse.json({ error: 'bad_request' }, { status: 400 })

  const [{ data: lead }, { data: audits }, { data: acts }, { data: people }, { data: deals }, { data: history }] = await Promise.all([
    sb.from('crm_leads').select('*').eq('id', lead_id).single(),
    sb.from('crm_audits').select('*').eq('lead_id', lead_id).order('audited_at', { ascending: false }).limit(1),
    sb.from('crm_activities').select('type,body,created_at,meta').eq('lead_id', lead_id).order('created_at', { ascending: false }).limit(40),
    sb.from('crm_people').select('name,role,decision_maker,confidence,best,source_url,linkedin_url').eq('lead_id', lead_id),
    sb.from('crm_deals').select('name,kind,amount_net,status,start_date,products').eq('lead_id', lead_id),
    sb.from('crm_chat').select('role,content').eq('lead_id', lead_id).order('created_at', { ascending: true }).limit(60),
  ])
  if (!lead) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const a = audits?.[0]
  const auditFacts = a ? Object.fromEntries(Object.entries(a).filter(([k, v]) => !['id', 'lead_id', 'raw'].includes(k) && v != null && typeof v !== 'object').slice(0, 60)) : null

  const system = `You are Claude, working inside Chris Wilkie's CRM for Impulso Media (a small web design, SEO and Google/Meta Ads studio in Sotogrande, Cádiz, Spain; Chris is an autónomo). This conversation is only about one ${lead.relationship === 'client' ? 'client' : 'prospect'}: "${lead.name}". Chris uses it to think through strategy, plan follow-ups, draft messages (WhatsApp, email, LinkedIn), prepare calls and proposals, and keep a running history.
Rules:
- Answer in the language Chris writes in (often Spanish or English). Messages to the prospect: Spanish unless told otherwise, warm and personal, never salesy or automated-sounding, short for WhatsApp.
- Use the CRM context below. Website audit facts come from an automated scan and can be wrong (e.g. chat buttons added by plugins): never state a negative fact about their website ("you have no WhatsApp") in a message unless Chris confirms it. Facts listed in fact_fixes as "wrong" are wrong.
- Be concrete and brief. If something important is missing (budget, decision-maker, timeline), say what to ask.
- You cannot send anything or change the CRM yourself; tell Chris what to do (e.g. "log it as Contacted with a follow-up in 3 days").
Today is ${new Date().toISOString().slice(0, 10)}.

CRM CONTEXT (JSON):
${JSON.stringify({ lead: pickLead(lead), audit: auditFacts, people, deals, recent_activity: acts }, null, 1).slice(0, 24000)}`

  const messages = [...(history || []).map((m: any) => ({ role: m.role, content: m.content })), { role: 'user', content: text }]
  await sb.from('crm_chat').insert({ lead_id, role: 'user', content: text })
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 3000, system, messages }),
      signal: AbortSignal.timeout(170000),
    })
    const j = await r.json()
    if (!r.ok) return NextResponse.json({ error: j?.error?.message || 'ai_error' }, { status: 502 })
    const reply = (j.content || []).map((c: any) => c.text || '').join('').trim()
    await sb.from('crm_chat').insert({ lead_id, role: 'assistant', content: reply, model: MODEL })
    return NextResponse.json({ ok: true, reply })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 502 })
  }
}
