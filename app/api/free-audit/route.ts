import { NextResponse, after } from 'next/server'
import { createHash } from 'crypto'
import { crmAnonClient } from '@/lib/crm-supabase'
import { runFreeAudit, normaliseUrl, type Lang, type Result } from '@/lib/free-audit'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ROLES = new Set(['owner', 'director', 'marketing', 'other'])
const json = (b: any, s = 200) => NextResponse.json(b, { status: s, headers: { 'cache-control': 'no-store' } })

async function bot() {
  const sb = crmAnonClient()
  const { error } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (error) throw new Error('auth: ' + error.message)
  return sb
}
const ipOf = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || '0'
const hash = (s: string) => createHash('sha256').update(s + (process.env.CRON_SECRET || '')).digest('hex').slice(0, 32)
const clean = (s: any, n: number) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n)

async function turnstileOk(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ secret, response: token, remoteip: ip }) })
    return !!(await r.json())?.success
  } catch { return false }
}

const ANS_LABEL: Record<string, Record<string, string>> = {
  maintainer: { me: 'the owner', team: 'someone on the team', freelancer: 'a freelancer', agency: 'an agency', nobody: 'nobody' },
  cost: { lt500: 'under €500/yr', '500-2k': '€500–2k/yr', '2-5k': '€2–5k/yr', gt5k: 'over €5k/yr', unsure: 'not sure' },
  ads: { google: 'Google', meta: 'Meta', both: 'Google + Meta', no: 'none', unsure: 'not sure' },
  role: { owner: 'Owner / founder', director: 'Director / manager', marketing: 'Marketing', other: 'Other' },
}
const answersText = (a: Record<string, any>) => [
  a.maintainer && `site looked after by ${ANS_LABEL.maintainer[a.maintainer] || a.maintainer}`,
  a.agency_name && `(${clean(a.agency_name, 80)})`,
  a.cost && `annual cost ${ANS_LABEL.cost[a.cost] || a.cost}`,
  a.ads && `ads: ${ANS_LABEL.ads[a.ads] || a.ads}`,
  a.frustration && `frustration: “${clean(a.frustration, 200)}”`,
].filter(Boolean).join(' · ')

// Creates or updates the CRM lead for this business and logs the request.
async function syncLead(sb: any, row: any, result: Result | null) {
  const host = row.host
  const { data: found } = await sb.from('crm_leads').select('id,name,relationship,notes,contact_name,email').or(`website.ilike.%//${host}%,website.ilike.%//www.${host}%`).limit(1)
  let lead = found?.[0]
  const siteName = (result?.facts.title || '').split(/\s[|–—-]\s|\s\|\s/)[0].trim().slice(0, 70)
  const base: any = {
    origin: 'inbound', lead_type: 'warm', contact_name: row.name || null, email: row.email || null, contact_role: row.role || null,
    next_action_at: new Date(Date.now() + 86400000).toISOString(),
  }
  if (!lead) {
    const ins = { ...base, name: siteName || host, website: result?.facts.final_url || row.url, category: result?.ai?.category || null, source: 'Free audit', source_url: 'https://impulsomedia.es/auditoria-web-gratis', status: 'nuevo', relationship: 'lead', notes: `Requested a free audit (${row.lang}). ${answersText(row.answers || {})}`.trim() }
    const { data, error } = await sb.from('crm_leads').insert(ins).select().single()
    if (error) throw new Error('lead insert: ' + error.message)
    lead = data
  } else {
    const patch: any = { ...base }
    if (lead.relationship !== 'lead') { delete patch.lead_type; delete patch.origin; delete patch.next_action_at }
    if (lead.contact_name && !row.name) delete patch.contact_name
    if (lead.email && !row.email) delete patch.email
    await sb.from('crm_leads').update(patch).eq('id', lead.id)
  }
  const score = result?.overall != null ? `score ${result.overall}/100` : 'site could not be analysed'
  const cards = result ? result.cards.map(c => `${c.key} ${c.score ?? '—'}`).join(', ') : ''
  await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Free audit requested by ${row.name || '—'} (${ANS_LABEL.role[row.role] || row.role || 'role unknown'}, ${row.email || 'no email'}) · ${score}${cards ? ` · ${cards}` : ''} · ${answersText(row.answers || {}) || 'no extra answers'} · result: https://impulsomedia.es/${row.lang === 'en' ? 'en/free-website-audit' : 'auditoria-web-gratis'}?id=${row.id}` })
  if (row.email) await sb.from('crm_contacts').upsert({ lead_id: lead.id, kind: 'email', value: row.email, label: `${row.name || ''} ${row.role ? `(${ANS_LABEL.role[row.role] || row.role})` : ''}`.trim(), source_url: 'free audit' }, { onConflict: 'lead_id,kind,value', ignoreDuplicates: true })
  return lead.id
}

async function sendEmails(row: any, result: Result | null) {
  const key = process.env.RESEND_API_KEY
  if (!key || !row.email) return false
  const { Resend } = await import('resend'); const resend = new Resend(key)
  const en = row.lang === 'en'
  const link = `https://impulsomedia.es/${en ? 'en/free-website-audit' : 'auditoria-web-gratis'}?id=${row.id}`
  const rows = result ? result.cards.map(c => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${c.title}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:700">${c.score ?? '—'}/100</td></tr>`).join('') : ''
  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111418">
    <p style="color:#7a7f87;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 8px">ImpulsoMedia · ${en ? 'Free website review' : 'Auditoría web gratis'}</p>
    <h1 style="font-size:24px;margin:0 0 16px">${en ? `Your review of ${row.host}` : `Tu revisión de ${row.host}`}</h1>
    ${result ? `<p style="font-size:40px;font-weight:800;margin:0 0 4px">${result.overall ?? '—'}<span style="font-size:16px;color:#7a7f87">/100</span></p>` : `<p>${en ? 'We could not load the site to analyse it. The link below shows what happened.' : 'No pudimos cargar la web para analizarla. En el enlace verás qué ha pasado.'}</p>`}
    <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}</table>
    <p><a href="${link}" style="display:inline-block;background:#111418;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">${en ? 'Open the full result' : 'Ver el resultado completo'}</a></p>
    <p style="color:#3a3f47">${en ? 'This is the short, automated version. If you want, I can go through it with you on a 15-minute call and tell you what is worth fixing first, with no commitment.' : 'Esta es la versión corta y automática. Si quieres, la repasamos juntos en una llamada de 15 minutos y te digo qué merece la pena arreglar primero, sin compromiso.'}</p>
    <p style="color:#3a3f47">Chris Wilkie · ImpulsoMedia · <a href="https://wa.me/34680863229" style="color:#111418">WhatsApp</a> · chris@impulsomedia.es</p>
    <p style="color:#7a7f87;font-size:12px">${en ? 'You receive this email because you requested a review at impulsomedia.es. Reply “baja” and we will not write again.' : 'Recibes este correo porque pediste una revisión en impulsomedia.es. Responde “baja” y no volveremos a escribirte.'}</p></div>`
  try {
    await resend.emails.send({ from: 'Chris Wilkie · ImpulsoMedia <chris@impulsomedia.es>', to: [row.email], replyTo: 'chris@impulsomedia.es', subject: en ? `Your website review: ${row.host}` : `Tu revisión web: ${row.host}`, html })
    await resend.emails.send({ from: 'ImpulsoMedia <chris@impulsomedia.es>', to: ['chris@impulsomedia.es'], subject: `Free audit: ${row.host} (${row.role || '?'}) · ${result?.overall ?? 'failed'}`, html: `<p><b>${row.name}</b> (${row.email}, ${row.role}) requested a free audit of <a href="${row.url}">${row.url}</a>.</p><p>Score: ${result?.overall ?? 'failed'}. ${answersText(row.answers || {})}</p><p><a href="${link}">Result</a> · <a href="https://crm.impulsomedia.es/">CRM</a></p>` })
    return true
  } catch { return false }
}

async function process_(id: string) {
  const sb = await bot()
  const { data: row } = await sb.from('free_audits').select('*').eq('id', id).single()
  if (!row || row.status === 'done') return
  await sb.from('free_audits').update({ status: 'running', started_at: new Date().toISOString(), attempts: (row.attempts || 0) + 1 }).eq('id', id)
  let result: Result | null = null; let error: string | null = null
  try {
    // A business audited in the last 24 h gets the same result: the site has not changed, and it keeps the cost bounded.
    const { data: prev } = await sb.from('free_audits').select('result').eq('host', row.host).eq('status', 'done').eq('lang', row.lang).not('result', 'is', null).gte('created_at', new Date(Date.now() - 86400000).toISOString()).neq('id', id).order('created_at', { ascending: false }).limit(1)
    if (prev?.[0]?.result) result = prev[0].result
    else { const r = await runFreeAudit(row.url, row.lang as Lang, row.answers || {}); if (r.ok) result = r.result; else error = r.error }
  } catch (e: any) { error = 'exception: ' + String(e?.message || e).slice(0, 200) }
  let lead_id: string | null = row.lead_id
  try { lead_id = await syncLead(sb, row, result) } catch (e: any) { error = (error ? error + ' · ' : '') + 'crm: ' + String(e?.message || e).slice(0, 120) }
  const email_sent = await sendEmails(row, result)
  await sb.from('free_audits').update({ status: result ? 'done' : 'failed', result, error, lead_id, email_sent, finished_at: new Date().toISOString() }).eq('id', id)
}

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return json({ error: 'bad_json' }, 400) }
  const ip = ipOf(req)
  if (body.action === 'answers') {
    const id = clean(body.id, 40); if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'bad_id' }, 400)
    const a: Record<string, string> = {}
    for (const k of ['maintainer', 'cost', 'ads', 'agency_name', 'frustration']) if (body.answers?.[k]) a[k] = clean(body.answers[k], k === 'frustration' ? 300 : 80)
    const sb = await bot()
    const { data: row } = await sb.from('free_audits').select('id,lead_id,answers').eq('id', id).single()
    if (!row) return json({ error: 'not_found' }, 404)
    const answers = { ...(row.answers || {}), ...a }
    await sb.from('free_audits').update({ answers }).eq('id', id)
    if (row.lead_id && Object.keys(a).length) {
      await sb.from('crm_activities').insert({ lead_id: row.lead_id, type: 'nota', body: `Free audit answers: ${answersText(answers)}` })
      const { data: l } = await sb.from('crm_leads').select('notes').eq('id', row.lead_id).single()
      await sb.from('crm_leads').update({ notes: `${(l?.notes || '').replace(/\n?Free audit answers:[\s\S]*$/, '')}\nFree audit answers: ${answersText(answers)}`.trim() }).eq('id', row.lead_id)
    }
    return json({ ok: true })
  }
  // honeypot: bots fill every field; humans never see this one
  if (body.company_website) return json({ ok: true, id: '00000000-0000-4000-8000-000000000000' })
  const n = normaliseUrl(clean(body.url, 300)); if ('error' in n) return json({ error: 'url_' + n.error }, 400)
  const email = clean(body.email, 120).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return json({ error: 'email' }, 400)
  const name = clean(body.name, 80); if (name.length < 2) return json({ error: 'name' }, 400)
  const role = ROLES.has(body.role) ? body.role : 'other'
  const lang: Lang = body.lang === 'en' ? 'en' : 'es'
  if (!body.consent) return json({ error: 'consent' }, 400)
  if (!(await turnstileOk(body.turnstile, ip))) return json({ error: 'captcha' }, 400)
  const sb = await bot()
  const iph = hash(ip)
  const hour = new Date(Date.now() - 3600000).toISOString(), day = new Date(Date.now() - 86400000).toISOString()
  const { count: perIp } = await sb.from('free_audits').select('id', { count: 'exact', head: true }).eq('ip_hash', iph).gte('created_at', hour)
  if ((perIp || 0) >= 5) return json({ error: 'rate' }, 429)
  const { count: perDay } = await sb.from('free_audits').select('id', { count: 'exact', head: true }).gte('created_at', day)
  if ((perDay || 0) >= 150) return json({ error: 'busy' }, 429)
  const utm: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']) if (body.utm?.[k]) utm[k] = clean(body.utm[k], 80)
  const answers: Record<string, string> = {}
  if (body.answers?.ads) answers.ads = clean(body.answers.ads, 20)
  const { data: row, error } = await sb.from('free_audits').insert({ url: n.url, host: n.host, lang, name, email, role, answers, utm, ip_hash: iph, user_agent: clean(req.headers.get('user-agent'), 200), consent: true }).select('id').single()
  if (error || !row) return json({ error: 'db' }, 500)
  after(() => process_(row.id).catch(() => {}))
  return json({ ok: true, id: row.id })
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id') || ''
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'bad_id' }, 400)
  const sb = await bot()
  const { data: row } = await sb.from('free_audits').select('id,url,host,lang,status,result,error,answers,started_at,attempts,created_at').eq('id', id).single()
  if (!row) return json({ error: 'not_found' }, 404)
  // If the background job died (timeout, cold start), pick it up again, at most twice.
  const stale = (row.status === 'queued' && Date.now() - new Date(row.created_at).getTime() > 20000) || (row.status === 'running' && row.started_at && Date.now() - new Date(row.started_at).getTime() > 75000)
  if (stale && (row.attempts || 0) < 2) { after(() => process_(id).catch(() => {})); row.status = 'running' }
  else if (stale) { await sb.from('free_audits').update({ status: 'failed', error: 'gave up after retries' }).eq('id', id); row.status = 'failed'; row.error = 'timeout' }
  return json({ id: row.id, url: row.url, host: row.host, lang: row.lang, status: row.status, result: row.result, error: row.error, answers: row.answers })
}
