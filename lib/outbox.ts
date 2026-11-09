// Rule: no email leaves for anyone other than Chris without his approval.
// Code that wants to email a client, lead or visitor calls queueEmail(); Chris approves it in CRM → Outbox,
// and only then sendOutbox() sends it. Emails to Chris himself (notifications) are not affected.
import { sendPush } from './push'

export const INTERNAL = ['chris@impulsomedia.es']
const FROM = 'ImpulsoMedia <chris@impulsomedia.es>'

export async function queueEmail(sb: any, m: { kind: string; to: string; subject: string; html: string; lead_id?: string | null; ref_id?: string | null }) {
  const { data, error } = await sb.from('crm_outbox').insert({ kind: m.kind, to_email: m.to, subject: m.subject, html: m.html, lead_id: m.lead_id || null, ref_id: m.ref_id || null }).select('id').single()
  if (error) throw new Error('outbox: ' + error.message)
  try { await sendPush(sb, { type: 'outbox', title: 'Email waiting for your approval', body: `${m.subject} → ${m.to}`, url: '/?tab=outbox', tag: `outbox-${data.id}` }) } catch {}
  return data.id as string
}

// Only called from the approve action in the CRM (owner token).
export async function sendOutbox(sb: any, id: string, edits: { subject?: string } = {}) {
  const { data: m } = await sb.from('crm_outbox').select('*').eq('id', id).single()
  if (!m) return { ok: false, error: 'not_found' }
  if (m.status !== 'pending') return { ok: false, error: 'already_' + m.status }
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false, error: 'no_resend_key' }
  // Claim it first so a double tap can't send twice.
  const { data: claimed } = await sb.from('crm_outbox').update({ status: 'sent', decided_at: new Date().toISOString(), subject: edits.subject || m.subject }).eq('id', id).eq('status', 'pending').select('id')
  if (!claimed?.length) return { ok: false, error: 'already_sent' }
  try {
    const { Resend } = await import('resend'); const resend = new Resend(key)
    const r: any = await resend.emails.send({ from: FROM, to: [m.to_email], replyTo: 'chris@impulsomedia.es', subject: edits.subject || m.subject, html: m.html })
    if (r?.error) throw new Error(r.error.message || 'send failed')
  } catch (e: any) {
    await sb.from('crm_outbox').update({ status: 'failed', error: String(e?.message || e).slice(0, 300) }).eq('id', id)
    return { ok: false, error: 'send_failed' }
  }
  if (m.kind === 'free_audit' && m.ref_id) {
    const { data: fa } = await sb.from('free_audits').select('flags').eq('id', m.ref_id).single()
    await sb.from('free_audits').update({ email_sent: true, flags: { ...(fa?.flags || {}), email_queued: false, email_approved_at: new Date().toISOString() } }).eq('id', m.ref_id)
  }
  if (m.lead_id) await sb.from('crm_activities').insert({ lead_id: m.lead_id, type: 'mensaje', body: `Email approved and sent to ${m.to_email}: ${edits.subject || m.subject}` })
  return { ok: true }
}
