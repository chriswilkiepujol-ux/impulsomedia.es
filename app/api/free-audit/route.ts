import { NextResponse, after } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { resolveMx, resolve4 } from 'dns/promises'
import { crmAnonClient } from '@/lib/crm-supabase'
import { runFreeAudit, normaliseUrl, rootOf, type Lang, type Result } from '@/lib/free-audit'
import { sendPush } from '@/lib/push'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ROLES = new Set(['owner', 'director', 'marketing', 'other'])
const GATE = process.env.FREE_AUDIT_GATE !== 'off' // full report only via the emailed link
const DAILY_CAP = Number(process.env.FREE_AUDIT_DAILY_CAP) || 150
const SITE = 'https://impulsomedia.es'
const FREE_MAIL = /^(gmail|googlemail|hotmail|outlook|live|msn|yahoo|icloud|me|mac|aol|proton|protonmail|pm|gmx|mail|yandex|zoho|telefonica|movistar|orange|ono|terra|hispavista|wanadoo)\.(com|es|net|org|me|ch|co\.uk|fr|de|it)$/
const DISPOSABLE = /(mailinator|guerrillamail|10minutemail|tempmail|temp-mail|yopmail|trashmail|throwam|getnada|dispostable|fakeinbox|maildrop|sharklasers|spamgourmet|mohmal|emailondeck|burnermail|tempr\.email|minuteinbox|mytemp|moakt|tmpmail|mailnesia|mailsac|inboxkitten|33mail|discard\.email|harakirimail|luxusmail|tempail|crazymailing|mailtemp|anonbox|dropmail|tmail|instantemail)/i
const json = (b: any, s = 200) => NextResponse.json(b, { status: s, headers: { 'cache-control': 'no-store' } })
const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
const clean = (s: any, n: number) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n)
const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> => Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])

// One bot session per warm function instead of a password sign-in on every poll.
let cached: { sb: any; until: number } | null = null
async function bot() {
  if (cached && cached.until > Date.now()) return cached.sb
  const sb = crmAnonClient()
  const { error } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (error) throw new Error('auth: ' + error.message)
  cached = { sb, until: Date.now() + 45 * 60 * 1000 }
  return sb
}
const isPublicHost = (req: Request) => /^(www\.)?impulsomedia\.es$/i.test((req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0])
const ipOf = (req: Request) => (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || '0'
const hash = (s: string) => createHash('sha256').update(s + (process.env.CRON_SECRET || '')).digest('hex').slice(0, 32)
// name+alias@gmail.com, n.a.m.e@gmail.com and NAME@GMAIL.COM are the same inbox for limit purposes.
const canonicalEmail = (e: string) => { const [l, d] = e.toLowerCase().split('@'); let local = l.split('+')[0]; if (/^(gmail|googlemail)\.com$/.test(d)) local = local.replace(/\./g, ''); return `${local}@${d}` }

async function mailDomainOk(domain: string) {
  try { const mx = await withTimeout(resolveMx(domain), 3000); if (Array.isArray(mx) && mx.length) return true } catch (e: any) { if (e?.message === 'timeout' || e?.code === 'ETIMEOUT' || e?.code === 'ESERVFAIL') return true }
  try { const a = await withTimeout(resolve4(domain), 2000); return Array.isArray(a) && a.length > 0 } catch (e: any) { return e?.message === 'timeout' }
}
async function turnstileOk(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const r = await withTimeout(fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ secret, response: token, remoteip: ip }) }), 6000)
    return !!(await r.json())?.success
  } catch { return false }
}

const LABEL: Record<string, Record<string, string>> = {
  maintainer: { me: 'the owner', team: 'someone on the team', freelancer: 'a freelancer', agency: 'an agency', nobody: 'nobody' },
  cost: { lt500: 'under €500/yr', '500-2k': '€500–2k/yr', '2-5k': '€2–5k/yr', gt5k: 'over €5k/yr', unsure: 'not sure' },
  ads: { google: 'Google', meta: 'Meta', both: 'Google + Meta', no: 'none', unsure: 'not sure' },
  role: { owner: 'Owner / founder', director: 'Director / manager', marketing: 'Marketing', other: 'Other' },
}
const lab = (k: string, v: any) => (Object.hasOwn(LABEL[k], String(v)) ? LABEL[k][String(v)] : clean(v, 40))
const answersText = (a: Record<string, any>) => [
  a.maintainer && `site looked after by ${lab('maintainer', a.maintainer)}`,
  a.agency_name && `(${clean(a.agency_name, 80)})`,
  a.cost && `annual cost ${lab('cost', a.cost)}`,
  a.ads && `ads: ${lab('ads', a.ads)}`,
  a.frustration && `frustration: “${clean(a.frustration, 200)}”`,
].filter(Boolean).join(' · ')
const resultPath = (row: any) => `/${row.lang === 'en' ? 'en/free-website-audit' : 'auditoria-web-gratis'}?id=${row.id}`

// Creates or updates the CRM lead for this business and logs the request.
async function syncLead(sb: any, row: any, result: Result | null) {
  const host = row.host
  const pats = [`%://${host}`, `%://${host}/%`, `%://www.${host}`, `%://www.${host}/%`]
  const { data: found } = await sb.from('crm_leads').select('id,name,relationship,contact_name,email,contact_role').or(pats.map(p => `website.ilike.${p}`).join(',')).limit(1)
  let lead = found?.[0]
  const siteName = clean((result?.facts.title || '').split(/\s[|–—-]\s|\s\|\s/)[0], 70)
  const owner = !!row.flags?.email_matches_site, risk = !!row.flags?.competitor_risk
  const nextAction = new Date(Date.now() + 86400000).toISOString()
  if (!lead) {
    const ins = { name: siteName || host, website: result?.facts.final_url || row.url, category: result?.ai?.category || null, source: 'Free audit', source_url: `${SITE}/auditoria-web-gratis`, status: 'nuevo', relationship: 'lead', origin: 'inbound', lead_type: 'warm', contact_name: risk ? null : row.name || null, email: risk ? null : row.email || null, contact_role: risk ? null : row.role || null, next_action_at: nextAction, notes: `Requested a free audit (${row.lang}). ${answersText(row.answers || {})}`.trim() }
    const { data, error } = await sb.from('crm_leads').insert(ins).select().single()
    if (error) throw new Error('lead insert: ' + error.message)
    lead = data
  } else if (!risk) {
    // Never overwrite what is already known about an existing lead or client: only fill blanks.
    const patch: any = {}
    if (!lead.contact_name && row.name) patch.contact_name = row.name
    if (!lead.email && row.email) patch.email = row.email
    if (!lead.contact_role && row.role) patch.contact_role = row.role
    if (lead.relationship === 'lead') { patch.origin = 'inbound'; patch.lead_type = 'warm'; patch.next_action_at = nextAction }
    if (Object.keys(patch).length) await sb.from('crm_leads').update(patch).eq('id', lead.id)
  }
  const score = result?.overall != null ? `score ${result.overall}/100` : 'site could not be analysed'
  const cards = result ? result.cards.map(c => `${c.key} ${c.score ?? '—'}`).join(', ') : ''
  const who = owner ? 'email domain matches the site (owner confirmed)' : row.flags?.free_email ? 'free email (unconfirmed)' : 'EMAIL FROM ANOTHER BUSINESS DOMAIN: possible competitor or agency, check before contacting'
  await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Free audit requested by ${row.name || '—'} (${lab('role', row.role)}, ${row.email || 'no email'}) · ${score}${cards ? ` · ${cards}` : ''} · ${answersText(row.answers || {}) || 'no extra answers'} · ${who} · result: ${SITE}${resultPath(row)}` })
  if (row.email) await sb.from('crm_contacts').upsert({ lead_id: lead.id, kind: 'email', value: row.email, label: `${risk ? 'requester (other business) ' : ''}${row.name || ''} ${row.role ? `(${lab('role', row.role)})` : ''}`.trim(), source_url: 'free audit' }, { onConflict: 'lead_id,kind,value', ignoreDuplicates: true })
  return lead.id
}

// Internal alert to Chris (never to the visitor). Always English (CRM language), clearly marked as internal.
const isOwnTest = (row: any) => /@impulsomedia\.es$/i.test(row.email || '')
function whoLine(row: any) {
  if (isOwnTest(row)) return 'Internal test (your own email)'
  return row.flags?.email_matches_site ? 'Owner confirmed (email domain matches the site)' : row.flags?.free_email ? 'Free email address (Gmail, Hotmail…): could be the owner, check' : 'Email from another business domain: possible competitor or agency'
}
function internalSubject(row: any, result: Result | null) {
  return `${isOwnTest(row) ? '[TEST] ' : ''}New audit lead · ${row.host} · ${result?.overall != null ? result.overall + '/100' : 'audit failed'} · ${row.lang === 'en' ? 'EN' : 'ES'} page`
}
function internalAlert(row: any, result: Result | null, link: string, lead_id: string | null) {
  const col = (v: any) => (v == null ? '#7a7f87' : v >= 75 ? '#1f9d55' : v >= 50 ? '#8a6a1e' : '#b91c1c')
  const td = 'padding:7px 0;border-bottom:1px solid #ece8e0;font-size:14px'
  const cards = result ? result.cards.map(c => `<tr><td style="${td}">${esc(c.title)}</td><td style="${td};text-align:right;font-weight:700;color:${col(c.score)}">${c.score ?? '—'}</td></tr>`).join('') : ''
  const ai: any = result?.ai
  const list = (t: string, a: string[] = []) => a.length ? `<p style="margin:14px 0 4px;font-weight:700;font-size:14px">${t}</p><ul style="margin:0;padding-left:18px;color:#3a3f47;font-size:14px;line-height:1.5">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''
  const crm = lead_id ? `https://crm.impulsomedia.es/?lead=${lead_id}` : 'https://crm.impulsomedia.es/'
  const btn = (href: string, label: string, dark = true) => `<a href="${esc(href)}" style="display:inline-block;background:${dark ? '#111418' : '#fff'};color:${dark ? '#fff' : '#111418'};border:1px solid #111418;padding:11px 18px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;margin:0 8px 8px 0">${label}</a>`
  const row2 = (k: string, v: string) => `<tr><td style="color:#7a7f87;padding:3px 14px 3px 0;font-size:14px;vertical-align:top">${k}</td><td style="font-size:14px">${v}</td></tr>`
  const ans = answersText(row.answers || {})
  return `<div style="background:#f6f4ef;padding:24px 12px"><div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;padding:28px 26px;color:#111418">
  <table style="width:100%;border-collapse:collapse"><tr><td><img src="${SITE}/images/impulsomedia-logo.jpg" alt="ImpulsoMedia" width="52" style="display:block;height:auto;border-radius:10px"></td><td style="text-align:right"><span style="background:#111418;color:#c9a04a;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;border-radius:999px">Internal · CRM alert</span></td></tr></table>
  <p style="color:#7a7f87;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:22px 0 6px">New free-audit lead</p>
  <h1 style="font-size:22px;line-height:1.25;margin:0 0 6px">${esc(row.host)}</h1>
  <p style="font-size:38px;font-weight:800;margin:6px 0 14px;line-height:1;color:${col(result?.overall)}">${result?.overall ?? '—'}<span style="font-size:15px;color:#7a7f87;font-weight:400"> /100</span></p>
  <table style="border-collapse:collapse;margin:0 0 6px">
    ${row2('Name', `<b>${esc(row.name || '—')}</b> · ${esc(lab('role', row.role))}`)}
    ${row2('Email', `<a href="mailto:${esc(row.email)}" style="color:#111418">${esc(row.email || '—')}</a>`)}
    ${row2('Who', esc(whoLine(row)))}
    ${row2('Page', row.lang === 'en' ? 'English page — they got the report in English' : 'Spanish page — they got the report in Spanish')}
    ${ans ? row2('Answers', esc(ans)) : ''}
  </table>
  ${ai?.business ? `<p style="margin:14px 0 0;color:#3a3f47;font-size:14px;line-height:1.5"><b style="color:#111418">What a visitor understands:</b> ${esc(ai.business)}</p>` : ''}
  ${list('Biggest issues', ai?.issues)}
  ${list('Quick wins to pitch', ai?.quick_wins)}
  ${cards ? `<table style="width:100%;border-collapse:collapse;margin:16px 0 4px">${cards}</table>` : `<p style="color:#b91c1c">The automatic audit failed: review the site by hand.</p>`}
  <p style="margin:20px 0 0">${btn(crm, 'Open lead in CRM')}${btn(link, 'Open their report', false)}</p>
  <p style="color:#7a7f87;font-size:12px;line-height:1.5;margin:14px 0 0">Only you receive this. Replying goes to ${esc(row.email || 'the requester')}. Opening the report from here does not count as them opening it.</p>
  </div></div>`
}

async function sendEmails(_sb: any, row: any, result: Result | null, _lead_id: string | null) {
  const key = process.env.RESEND_API_KEY
  if (!row.email) return false
  const en = row.lang === 'en'
  const link = `${SITE}${resultPath(row)}&k=${row.key}`
  const host = esc(row.host)
  const rows = result ? result.cards.map(c => `<tr><td style="padding:9px 0;border-bottom:1px solid #ece8e0;font-size:15px">${esc(c.title)}</td><td style="padding:9px 0;border-bottom:1px solid #ece8e0;text-align:right;font-weight:700;font-size:15px;color:${c.score == null ? '#7a7f87' : c.score >= 75 ? '#1f9d55' : c.score >= 50 ? '#8a6a1e' : '#b91c1c'}">${c.score ?? '—'}<span style="color:#7a7f87;font-weight:400">/100</span></td></tr>`).join('') : ''
  const html = `<div style="background:#f6f4ef;padding:28px 12px"><div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px 28px;color:#111418">
    <img src="${SITE}/images/impulsomedia-logo.jpg" alt="ImpulsoMedia" width="150" style="display:block;height:auto;margin-bottom:22px">
    <p style="color:#7a7f87;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 8px">${en ? 'Free website review' : 'Revisión web gratuita'}</p>
    <h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">${en ? `Your review of ${host}` : `Tu revisión de ${host}`}</h1>
    ${result ? `<p style="font-size:44px;font-weight:800;margin:0 0 4px;line-height:1">${result.overall ?? '—'}<span style="font-size:16px;color:#7a7f87;font-weight:400"> /100</span></p>` : `<p>${en ? 'We could not load the site to analyse it. The link below shows what happened.' : 'No pudimos cargar la web para analizarla. En el enlace verás qué ha pasado.'}</p>`}
    <table style="width:100%;border-collapse:collapse;margin:16px 0 22px">${rows}</table>
    <p style="margin:0 0 22px"><a href="${esc(link)}" style="display:inline-block;background:#111418;color:#fff;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:700">${en ? 'Open the full report' : 'Ver el informe completo'}</a></p>
    <p style="color:#3a3f47;line-height:1.55;margin:0 0 10px">${en ? 'This is the short, automated version: what fails in each area, why, and what to do first. If you would like it explained, a member of the ImpulsoMedia team will get in touch in the next few days; you can also reply to this email.' : 'Esta es la versión corta y automática: qué falla en cada apartado, por qué y qué hacer primero. Si quieres que te lo expliquemos, un miembro del equipo de ImpulsoMedia se pondrá en contacto contigo en los próximos días; también puedes responder a este correo.'}</p>
    <p style="color:#3a3f47;line-height:1.55;margin:0 0 26px">${en ? 'If you want to go further, we offer a full website audit and an ad-account audit, each with a written report and a call to walk you through it.' : 'Si quieres ir más allá, ofrecemos una auditoría web completa y una auditoría de cuentas de anuncios, cada una con informe por escrito y una llamada para explicarlo.'}</p>
    <table style="border-collapse:collapse;border-top:1px solid #ece8e0;width:100%"><tr><td style="padding-top:18px;vertical-align:middle;width:56px"><img src="${SITE}/images/impulsomedia-logo.jpg" alt="" width="44" style="display:block;height:auto;border-radius:10px"></td><td style="padding-top:18px;vertical-align:middle;font-size:13px;line-height:1.5;color:#3a3f47"><b style="color:#111418">ImpulsoMedia</b><br>${en ? 'Web design, SEO and paid media · Sotogrande, Campo de Gibraltar' : 'Diseño web, SEO y publicidad · Sotogrande, Campo de Gibraltar'}<br><a href="${SITE}" style="color:#111418">impulsomedia.es</a> · <a href="mailto:chris@impulsomedia.es" style="color:#111418">chris@impulsomedia.es</a> · <a href="https://wa.me/34680863229" style="color:#111418">WhatsApp</a></td></tr></table>
    <p style="color:#7a7f87;font-size:12px;line-height:1.5;margin:22px 0 0">${en ? 'You receive this email because you requested a review at impulsomedia.es. Reply “unsubscribe” and we will not write again. Privacy: impulsomedia.es/en/privacy' : 'Recibes este correo porque pediste una revisión en impulsomedia.es. Responde “baja” y no volveremos a escribirte. Privacidad: impulsomedia.es/privacidad'}</p></div></div>`
  try {
    // Free-audit reports go out automatically (Chris approved this). Outreach to businesses never does: see lib/outbox.ts.
    if (!key) return false
    const { Resend } = await import('resend'); const resend = new Resend(key)
    await withTimeout(resend.emails.send({ from: 'ImpulsoMedia <chris@impulsomedia.es>', to: [row.email], replyTo: 'chris@impulsomedia.es', subject: en ? `Your website review: ${row.host}` : `Tu revisión web: ${row.host}`, html }), 8000)
    withTimeout(resend.emails.send({ from: 'ImpulsoMedia CRM <chris@impulsomedia.es>', to: ['chris@impulsomedia.es'], replyTo: row.email, subject: internalSubject(row, result), html: internalAlert(row, result, link + '&p=1', _lead_id) }), 8000).catch(() => {})
    return true
  } catch { return false }
}

async function process_(id: string) {
  const sb = await bot()
  const { data: row } = await sb.from('free_audits').select('*').eq('id', id).single()
  if (!row || row.status === 'done') return
  if (!row.key) { row.key = randomBytes(9).toString('base64url'); await sb.from('free_audits').update({ key: row.key }).eq('id', id) }
  await sb.from('free_audits').update({ status: 'running', started_at: new Date().toISOString(), attempts: (row.attempts || 0) + 1 }).eq('id', id)
  let result: Result | null = null; let error: string | null = null
  try {
    // The same URL audited in the last 24 h gets the same result: the site has not changed, and it keeps the cost bounded.
    const { data: prev } = await sb.from('free_audits').select('result').eq('url', row.url).eq('status', 'done').eq('lang', row.lang).not('result', 'is', null).gte('created_at', new Date(Date.now() - 86400000).toISOString()).neq('id', id).order('created_at', { ascending: false }).limit(1)
    if (prev?.[0]?.result) result = prev[0].result
    else { const r = await runFreeAudit(row.url, row.lang as Lang, {}); if (r.ok) result = r.result; else error = r.error }
  } catch (e: any) { error = 'exception: ' + String(e?.message || e).slice(0, 200) }
  // Save the outcome first: if the function is cut off during CRM/email work the visitor still gets the report.
  await sb.from('free_audits').update({ status: result ? 'done' : 'failed', result, error, finished_at: new Date().toISOString() }).eq('id', id)
  const { data: fresh } = await sb.from('free_audits').select('answers').eq('id', id).single()
  row.answers = fresh?.answers || row.answers
  let lead_id: string | null = row.lead_id; let crmErr: string | null = null
  // A site that does not even exist is not a lead; a real site that failed for another reason still is.
  if (result || !['unreachable', 'invalid', 'not_html'].includes(error || '')) {
    try { lead_id = await withTimeout(syncLead(sb, row, result), 12000) } catch (e: any) { crmErr = 'crm: ' + String(e?.message || e).slice(0, 120) }
  }
  const email_sent = await sendEmails(sb, row, result, lead_id)
  try {
    const who = row.flags?.email_matches_site ? lab('role', row.role) : row.flags?.free_email ? `${lab('role', row.role)} (free email)` : 'possible competitor/agency'
    await withTimeout(sendPush(sb, { type: 'audits', title: `New free audit · ${row.host}`, body: `${who} · ${result?.overall != null ? `score ${result.overall}/100` : 'audit failed, review by hand'}`, url: lead_id ? `/?lead=${lead_id}` : '/', tag: `audit-${id}`, snoozeLead: lead_id }), 6000)
  } catch {}
  await sb.from('free_audits').update({ lead_id, email_sent, error: [error, crmErr].filter(Boolean).join(' · ') || null }).eq('id', id)
}

// ---------- "Request" buttons on the audit page: full audit, ad-account audit, discuss the result, manual review ----------
const KIND: Record<string, { es: string; en: string; internal: string }> = {
  web_audit: { es: 'Auditoría web completa', en: 'Full website audit', internal: 'FULL WEBSITE AUDIT' },
  ads_audit: { es: 'Auditoría de cuentas de anuncios', en: 'Ad-account audit', internal: 'AD-ACCOUNT AUDIT' },
  discuss: { es: 'Comentar el resultado', en: 'Discuss the result', internal: 'DISCUSS THE RESULT' },
  manual: { es: 'Revisión manual', en: 'Manual review', internal: 'MANUAL REVIEW (automatic audit failed)' },
}
function internalReport(audit: any, r: any, k: string) {
  const res = audit?.result
  const scoreCol = (v: any) => (v == null ? '#7a7f87' : v >= 75 ? '#1f9d55' : v >= 50 ? '#8a6a1e' : '#b91c1c')
  const flags = audit?.flags || {}
  const who = flags.email_matches_site ? '✅ Email domain matches the site: owner/staff confirmed' : flags.free_email ? '⚠️ Free email address (Gmail etc.): unconfirmed' : flags.competitor_risk ? '🚩 Email from ANOTHER business domain: possible competitor or agency, check first' : ''
  const cards = res ? res.cards.map((c: any) => {
    const bad = (c.findings || []).filter((f: any) => f.ok === false).map((f: any) => `<li style="margin:2px 0">✗ ${esc(f.text)}</li>`).join('')
    const good = (c.findings || []).filter((f: any) => f.ok === true).length
    return `<tr><td style="padding:10px 0;border-top:1px solid #ece8e0;vertical-align:top;width:170px"><b>${esc(c.title)}</b><br><span style="font-size:20px;font-weight:800;color:${scoreCol(c.score)}">${c.score ?? '—'}</span><span style="color:#7a7f87">/100</span></td><td style="padding:10px 0 10px 12px;border-top:1px solid #ece8e0;vertical-align:top;font-size:13.5px;line-height:1.45"><i>${esc(c.summary)}</i>${bad ? `<ul style="margin:6px 0 0;padding-left:16px">${bad}</ul>` : ''}<div style="color:#7a7f87;margin-top:4px">${good} check(s) passed · Suggested fix: ${esc(c.action)}</div></td></tr>`
  }).join('') : ''
  const t = res?.tags || {}
  const tagLine = res ? ['GA4/GTM ' + (t.ga4 || t.gtm ? '✓' : '✗'), 'Google Ads ' + (t.google_ads ? (t.google_ads_conversion ? '✓ +conv' : '✓ no conv') : '✗'), 'Meta pixel ' + (t.meta ? (t.meta_events ? '✓ +events' : '✓ no events') : '✗'), t.bing ? 'Bing ✓' : '', t.call_tracking ? 'Call tracking ✓' : ''].filter(Boolean).join(' · ') : ''
  const f = res?.facts || {}
  const facts = res ? [f.platform && `Platform: ${f.platform}`, f.first_year && `Online since ${f.first_year}`, `Pages checked: ${f.pages_checked}`, res.psi?.score != null ? `PageSpeed mobile ${res.psi.score}` : f.load_ms != null ? `Server response ${(f.load_ms / 1000).toFixed(1)} s` : '', `HTTPS ${f.https ? 'yes' : 'NO'}`].filter(Boolean).join(' · ') : ''
  const link = audit ? `${SITE}${resultPath(audit)}&k=${audit.key}` : ''
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:680px;color:#111418">
  <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7a7f87;margin:0">Free audit · new request</p>
  <h2 style="margin:6px 0 4px">${esc(KIND[k].internal)}: ${esc(audit?.host || r.url || '')}</h2>
  <table style="font-size:14px;line-height:1.6;margin:10px 0 14px"><tr><td style="color:#7a7f87;padding-right:12px">Name</td><td><b>${esc(r.name || audit?.name || '—')}</b>${audit?.role ? ` (${esc(lab('role', audit.role))})` : ''}</td></tr><tr><td style="color:#7a7f87;padding-right:12px">Email</td><td><a href="mailto:${esc(r.email || audit?.email || '')}">${esc(r.email || audit?.email || '—')}</a></td></tr>${r.phone ? `<tr><td style="color:#7a7f87;padding-right:12px">Phone</td><td><a href="tel:${esc(r.phone)}">${esc(r.phone)}</a></td></tr>` : ''}<tr><td style="color:#7a7f87;padding-right:12px">Website</td><td><a href="${esc(audit?.url || r.url || '')}">${esc(audit?.url || r.url || '—')}</a></td></tr><tr><td style="color:#7a7f87;padding-right:12px">Language</td><td>${esc(r.lang === 'en' ? 'English' : 'Spanish')}</td></tr>${audit?.utm && Object.keys(audit.utm).length ? `<tr><td style="color:#7a7f87;padding-right:12px">Came from</td><td>${esc(Object.entries(audit.utm).map(([a, b]) => `${a}=${b}`).join(' · '))}</td></tr>` : ''}</table>
  ${r.message ? `<div style="background:#f6f4ef;border-radius:10px;padding:12px 14px;margin-bottom:14px"><b>Their message</b><br>${esc(r.message)}</div>` : ''}
  ${who ? `<p style="margin:0 0 6px">${who}</p>` : ''}
  ${audit && Object.keys(audit.answers || {}).length ? `<p style="margin:0 0 14px">Their answers: ${esc(answersText(audit.answers))}</p>` : ''}
  ${res ? `<h3 style="margin:18px 0 4px">Audit: <span style="color:${scoreCol(res.overall)}">${res.overall ?? '—'}/100</span></h3><p style="margin:0 0 6px;color:#3a3f47;font-size:13.5px">${esc(facts)}</p><p style="margin:0 0 6px;color:#3a3f47;font-size:13.5px">Tags: ${esc(tagLine)}</p>${res.ai?.business ? `<p style="margin:0 0 6px;color:#3a3f47;font-size:13.5px">What a visitor understands: ${esc(res.ai.business)}</p>` : ''}<table style="width:100%;border-collapse:collapse;margin-top:8px">${cards}</table>` : audit ? `<p><b>The automatic audit failed:</b> ${esc(audit.error || 'unknown')}. Review the site by hand.</p>` : '<p>No automatic audit was run (request made before running one).</p>'}
  <p style="margin:18px 0 0">${link ? `<a href="${esc(link)}">Open the full report</a> · ` : ''}<a href="https://crm.impulsomedia.es/">Open the CRM</a></p>
  <p style="color:#7a7f87;font-size:12px;margin-top:14px">Reply to this email goes to the requester.</p></div>`
}

async function handleRequest(body: any, req: Request) {
  const kind = Object.hasOwn(KIND, String(body.kind)) ? String(body.kind) : null
  if (!kind) return json({ error: 'bad_kind' }, 400)
  if (body.xq_field) return json({ ok: true })
  const lang: Lang = body.lang === 'en' ? 'en' : 'es'
  const sb = await bot()
  const iph = hash(ipOf(req))
  const { count } = await sb.from('free_audit_requests').select('id', { count: 'exact', head: true }).eq('ip_hash', iph).gte('created_at', new Date(Date.now() - 3600000).toISOString())
  if ((count || 0) >= 5) return json({ error: 'rate' }, 429)
  let audit: any = null
  const id = clean(body.id, 40)
  if (/^[0-9a-f-]{36}$/.test(id)) audit = (await sb.from('free_audits').select('*').eq('id', id).single()).data
  const r: any = { kind, lang, name: clean(body.name, 80) || audit?.name || '', email: clean(body.email, 120).toLowerCase() || audit?.email || '', phone: clean(body.phone, 30).replace(/[^\d+ ()-]/g, ''), url: '', message: clean(body.message, 1000) }
  if (!audit) {
    // Request made without an audit (from the landing page): needs real contact details and consent.
    if (!body.consent) return json({ error: 'consent' }, 400)
    if (r.name.length < 2 || !/\p{L}{2,}/u.test(r.name)) return json({ error: 'name' }, 400)
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(r.email) || DISPOSABLE.test(r.email.split('@')[1]) || !(await mailDomainOk(r.email.split('@')[1]))) return json({ error: 'email' }, 400)
    if (body.url) { const n = normaliseUrl(clean(body.url, 300)); if ('error' in n) return json({ error: 'url_invalid' }, 400); r.url = n.url }
  }
  // CRM: log the request on the lead (create one if needed) and make it today's follow-up.
  let lead_id: string | null = audit?.lead_id || null
  try {
    if (!lead_id) {
      const host = audit?.host || (r.url ? new URL(r.url).hostname.replace(/^www\./, '') : '')
      if (host) {
        const pats = [`%://${host}`, `%://${host}/%`, `%://www.${host}`, `%://www.${host}/%`]
        lead_id = (await sb.from('crm_leads').select('id').or(pats.map(p => `website.ilike.${p}`).join(',')).limit(1)).data?.[0]?.id || null
      }
      if (!lead_id) {
        const { data } = await sb.from('crm_leads').insert({ name: host || r.name, website: r.url || audit?.url || null, source: 'Audit request', source_url: `${SITE}/auditoria-web-gratis`, status: 'nuevo', relationship: 'lead', origin: 'inbound', lead_type: 'warm', contact_name: r.name || null, email: r.email || null, notes: `Requested: ${KIND[kind].internal}.` }).select('id').single()
        lead_id = data?.id || null
      }
    }
    if (lead_id) {
      await sb.from('crm_activities').insert({ lead_id, type: 'nota', body: `REQUEST: ${KIND[kind].internal} from ${r.name || '—'} (${r.email || 'no email'}${r.phone ? `, ${r.phone}` : ''})${r.message ? ` · message: “${r.message}”` : ''}${audit ? ` · audit score ${audit.result?.overall ?? 'failed'}` : ''}` })
      const { data: l } = await sb.from('crm_leads').select('relationship').eq('id', lead_id).single()
      if (l?.relationship === 'lead') await sb.from('crm_leads').update({ next_action_at: new Date().toISOString(), lead_type: 'warm', origin: 'inbound' }).eq('id', lead_id)
    }
  } catch {}
  let email_sent = false
  const key = process.env.RESEND_API_KEY
  if (key) {
    try {
      const { Resend } = await import('resend'); const resend = new Resend(key)
      await withTimeout(resend.emails.send({ from: 'ImpulsoMedia <chris@impulsomedia.es>', to: ['chris@impulsomedia.es'], replyTo: r.email || undefined, subject: `[Request] ${KIND[kind].internal} · ${audit?.host || r.url || r.name}${audit?.role ? ` · ${lab('role', audit.role)}` : ''}${audit?.result?.overall != null ? ` · ${audit.result.overall}/100` : ''}`, html: internalReport(audit, r, kind) }), 8000)
      email_sent = true
    } catch {}
  }
  try { await withTimeout(sendPush(sb, { type: 'requests', title: `Request: ${KIND[kind].en} · ${audit?.host || (r.url ? new URL(r.url).hostname.replace(/^www\./, '') : r.name)}`, body: `${audit?.role ? lab('role', audit.role) + ' · ' : ''}${audit?.result?.overall != null ? `score ${audit.result.overall}/100 · ` : ''}details in your email`, url: lead_id ? `/?lead=${lead_id}` : '/', tag: `req-${Date.now()}`, snoozeLead: lead_id }), 6000) } catch {}
  await sb.from('free_audit_requests').insert({ audit_id: audit?.id || null, kind, lang, name: r.name || null, email: r.email || null, phone: r.phone || null, url: r.url || audit?.url || null, message: r.message || null, lead_id, ip_hash: iph, email_sent })
  // Saved in the CRM (bell + follow-up today) is enough to call it received; only fail if neither worked.
  if (!email_sent && !lead_id) return json({ error: 'db' }, 500)
  return json({ ok: true })
}

export async function POST(req: Request) {
  let body: any
  try { body = await req.json() } catch { return json({ error: 'bad_json' }, 400) }
  if (!body || typeof body !== 'object') return json({ error: 'bad_json' }, 400)
  const ip = ipOf(req)
  // Before launch the public domain only serves reports we shared (and their request/answer forms), never new audits.
  if (isPublicHost(req) && process.env.NEXT_PUBLIC_FREE_AUDIT_LIVE !== '1' && body.action !== 'request' && body.action !== 'answers') return json({ error: 'not_found' }, 404)
  if (body.action === 'request') return handleRequest(body, req)
  if (body.action === 'answers') {
    const id = clean(body.id, 40); if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'bad_id' }, 400)
    const a: Record<string, string> = {}
    for (const k of ['maintainer', 'cost', 'ads', 'agency_name', 'frustration']) if (body.answers?.[k]) a[k] = clean(body.answers[k], k === 'frustration' ? 300 : 80)
    if (!Object.keys(a).length) return json({ ok: true })
    const sb = await bot()
    const { data: row } = await sb.from('free_audits').select('id,lead_id,answers').eq('id', id).single()
    if (!row) return json({ error: 'not_found' }, 404)
    const answers = { ...(row.answers || {}), ...a }
    await sb.from('free_audits').update({ answers }).eq('id', id)
    // If the lead already exists the answers go there now; otherwise process_ picks them up when it creates it.
    if (row.lead_id) {
      await sb.from('crm_activities').insert({ lead_id: row.lead_id, type: 'nota', body: `Free audit answers: ${answersText(answers)}` })
      const { data: l } = await sb.from('crm_leads').select('notes').eq('id', row.lead_id).single()
      await sb.from('crm_leads').update({ notes: `${(l?.notes || '').replace(/\n?Free audit answers:[\s\S]*$/, '')}\nFree audit answers: ${answersText(answers)}`.trim() }).eq('id', row.lead_id)
    }
    return json({ ok: true })
  }
  // honeypot: bots fill every field; humans never see this one
  if (body.xq_field) return json({ ok: true, id: '00000000-0000-4000-8000-000000000000' })
  const n = normaliseUrl(clean(body.url, 300)); if ('error' in n) return json({ error: 'url_' + n.error }, 400)
  const email = clean(body.email, 120).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return json({ error: 'email' }, 400)
  const name = clean(body.name, 80); if (name.length < 2 || !/\p{L}{2,}/u.test(name) || /https?:|www\.|@|\d{4,}/i.test(name)) return json({ error: 'name' }, 400)
  const role = ROLES.has(body.role) ? body.role : 'other'
  const lang: Lang = body.lang === 'en' ? 'en' : 'es'
  if (!body.consent) return json({ error: 'consent' }, 400)
  const mailDomain = email.split('@')[1]
  if (DISPOSABLE.test(mailDomain) || !(await mailDomainOk(mailDomain))) return json({ error: 'email' }, 400)
  if (!(await turnstileOk(body.turnstile, ip))) return json({ error: 'captcha' }, 400)
  const sb = await bot()
  const iph = hash(ip)
  const hour = new Date(Date.now() - 3600000).toISOString(), day = new Date(Date.now() - 86400000).toISOString()
  const { count: perIp } = await sb.from('free_audits').select('id', { count: 'exact', head: true }).eq('ip_hash', iph).gte('created_at', hour)
  if ((perIp || 0) >= 5) return json({ error: 'rate' }, 429)
  const { count: perMail } = await sb.from('free_audits').select('id', { count: 'exact', head: true }).eq('email_key', canonicalEmail(email)).gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
  if ((perMail || 0) >= 3) return json({ error: 'rate' }, 429)
  const { count: perDay } = await sb.from('free_audits').select('id', { count: 'exact', head: true }).gte('created_at', day)
  if ((perDay || 0) >= DAILY_CAP) return json({ error: 'busy' }, 429)
  const utm: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref']) if (body.utm?.[k]) utm[k] = clean(body.utm[k], 80)
  const flags: Record<string, any> = { free_email: FREE_MAIL.test(mailDomain), email_matches_site: rootOf(mailDomain) === rootOf(n.host) }
  flags.competitor_risk = !flags.free_email && !flags.email_matches_site
  const { data: row, error } = await sb.from('free_audits').insert({ url: n.url, host: n.host, lang, name, email, email_key: canonicalEmail(email), role, answers: {}, utm, ip_hash: iph, user_agent: clean(req.headers.get('user-agent'), 200), consent: true, flags, key: randomBytes(9).toString('base64url') }).select('id').single()
  if (error || !row) return json({ error: 'db' }, 500)
  after(() => process_(row.id).catch(() => {}))
  return json({ ok: true, id: row.id })
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams; const id = q.get('id') || ''; const k = q.get('k') || ''
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: 'bad_id' }, 400)
  const sb = await bot()
  const { data: row } = await sb.from('free_audits').select('id,url,host,lang,status,result,error,answers,started_at,attempts,created_at,key,verified_at,lead_id,email,email_sent,finished_at,flags').eq('id', id).single()
  if (!row) return json({ error: 'not_found' }, 404)
  // If the background job died (timeout, cold start), claim the row atomically and pick it up again, at most twice.
  const now = Date.now()
  const stale = (row.status === 'queued' && now - new Date(row.created_at).getTime() > 20000) || (row.status === 'running' && row.started_at && now - new Date(row.started_at).getTime() > 75000)
  if (stale) {
    if ((row.attempts || 0) < 2) {
      const { data: claimed } = await sb.from('free_audits').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', id).eq('status', row.status).or(`started_at.is.null,started_at.lt.${new Date(now - 75000).toISOString()}`).select('id')
      if (claimed?.length) after(() => process_(id).catch(() => {}))
      row.status = 'running'
    } else { await sb.from('free_audits').update({ status: 'failed', error: 'gave up after retries' }).eq('id', id); row.status = 'failed'; row.error = 'timeout' }
  }
  // Unlock with the emailed key; also unlock when the email could not be sent, otherwise the visitor has no way in.
  const unlocked = !GATE || (!!k && k === row.key) || (row.status === 'done' && !!row.finished_at && row.email_sent === false && !row.flags?.internal && !row.flags?.email_queued)
  // Report we sent from the CRM: tell Chris the first time the prospect opens it (his own preview carries p=1).
  if (row.flags?.internal && k && k === row.key && row.status === 'done' && !row.flags?.opened_at && q.get('p') !== '1') {
    const flags = { ...row.flags, opened_at: new Date().toISOString() }
    const { data: won } = await sb.from('free_audits').update({ flags }).eq('id', id).is('flags->opened_at', null).select('id')
    if (won?.length && row.lead_id) {
      await sb.from('crm_activities').insert({ lead_id: row.lead_id, type: 'nota', body: `Opened the website report you sent them (${row.host}).` })
      const { data: l } = await sb.from('crm_leads').select('name,relationship').eq('id', row.lead_id).single()
      if (l?.relationship === 'lead') await sb.from('crm_leads').update({ next_action_at: new Date().toISOString() }).eq('id', row.lead_id)
      try { await withTimeout(sendPush(sb, { type: 'opens', title: `${l?.name || row.host} opened your report`, body: 'Good moment to follow up while it is fresh.', url: `/?lead=${row.lead_id}`, tag: `open-${id}`, snoozeLead: row.lead_id }), 6000) } catch {}
    }
  }
  if (k && k === row.key && !row.verified_at && row.status === 'done' && !row.flags?.internal && q.get('p') !== '1') {
    await sb.from('free_audits').update({ verified_at: new Date().toISOString() }).eq('id', id)
    if (row.lead_id) await sb.from('crm_activities').insert({ lead_id: row.lead_id, type: 'nota', body: `Opened the full free-audit report from the email link: ${row.email} is a real, working address.` })
  }
  const mask = (e: string) => e.replace(/^(.{2}).*(@.*)$/, '$1…$2')
  const result = row.result ? (unlocked ? row.result : { ...row.result, cards: row.result.cards.map((c: any) => ({ ...c, findings: [], action: '' })), ai: null, pages: [], limits: [], psi: row.result.psi ? { ...row.result.psi, screenshot: null } : null, facts: { ...row.result.facts, title: '', final_url: '' } }) : null
  return json({ id: row.id, host: row.host, lang: row.lang, status: row.status, result, gated: !unlocked, pending_review: !unlocked && !!row.flags?.email_queued && !row.email_sent, email_hint: unlocked ? null : mask(row.email || ''), error: row.error, answers: unlocked ? row.answers : { ads: row.answers?.ads || '' } })
}
