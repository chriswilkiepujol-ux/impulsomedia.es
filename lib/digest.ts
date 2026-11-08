import { sendPush } from './push'

// Morning digest: one notification summarising what needs attention today. sb = bot/owner client.
export async function runDigest(sb: any): Promise<{ sent: number; parts: string[] }> {
  const now = new Date(); const iso = (d: Date) => d.toISOString().slice(0, 10)
  const today = iso(now), in3 = iso(new Date(now.getTime() + 3 * 864e5)), month = today.slice(0, 7)
  const endOfDay = new Date(now); endOfDay.setUTCHours(23, 59, 59, 999)
  const [{ data: pays }, { data: leads }, { data: deals }] = await Promise.all([
    sb.from('crm_payments').select('id,deal_id,period,due_date,status').eq('status', 'pending'),
    sb.from('crm_leads').select('id,name,relationship,status,priority,next_action_at,created_at,change_note,changed_at').neq('relationship', 'past'),
    sb.from('crm_deals').select('id,lead_id,kind,status,start_date'),
  ])
  const overdue = (pays || []).filter((p: any) => p.due_date && p.due_date < today).length
  const dueSoon = (pays || []).filter((p: any) => p.due_date && p.due_date >= today && p.due_date <= in3).length
  const followUps = (leads || []).filter((l: any) => l.relationship === 'lead' && l.next_action_at && new Date(l.next_action_at) <= endOfDay && !['ganado', 'descartado'].includes(l.status))
  const strongNew = (leads || []).filter((l: any) => l.relationship === 'lead' && ['nuevo', 'revisado'].includes(l.status) && (l.priority || 0) >= 80 && now.getTime() - new Date(l.created_at).getTime() < 26 * 3600e3).length
  const cold = (leads || []).filter((l: any) => l.relationship === 'lead' && l.status === 'propuesta' && (!l.next_action_at || new Date(l.next_action_at) < now)).length
  const clientIds = new Set((leads || []).filter((l: any) => l.relationship === 'client').map((l: any) => l.id))
  const missing = (deals || []).filter((d: any) => d.kind === 'monthly' && d.status === 'active' && clientIds.has(d.lead_id) && (!d.start_date || d.start_date.slice(0, 7) <= month) && !(pays || []).some((p: any) => p.deal_id === d.id && p.period === month)).length
  const parts = [
    overdue && `${overdue} overdue payment${overdue > 1 ? 's' : ''}`,
    dueSoon && `${dueSoon} payment${dueSoon > 1 ? 's' : ''} due in 3 days`,
    missing && `${missing} monthly payment${missing > 1 ? 's' : ''} not created`,
    followUps.length && `${followUps.length} follow-up${followUps.length > 1 ? 's' : ''} today${followUps.length <= 3 ? ` (${followUps.map((l: any) => l.name).join(', ')})` : ''}`,
    strongNew && `${strongNew} new strong lead${strongNew > 1 ? 's' : ''}`,
    cold && `${cold} proposal${cold > 1 ? 's' : ''} with no next step`,
  ].filter(Boolean) as string[]
  if (!parts.length) return { sent: 0, parts }
  const sent = await sendPush(sb, { type: 'digest', title: 'Today in your CRM', body: parts.join(' · '), url: overdue || dueSoon || missing ? '/?tab=billing' : '/?tab=leads', tag: `digest-${today}` })
  return { sent, parts }
}
