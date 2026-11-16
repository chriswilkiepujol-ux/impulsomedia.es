// Finds the owner / best person to contact at a lead's business, from public business sources only:
// the company's own website (about, team, legal notice) and the official register (BORME admin already on the lead).
// LinkedIn is never scraped: we only keep LinkedIn links the company itself publishes, and give Chris search links.
const UA = 'Mozilla/5.0 (compatible; ImpulsoMediaAudit/1.0; +https://impulsomedia.es)'
const PAGE_HINT = /(aviso[-_ ]?legal|legal|quien|qui[eé]nes|sobre|nosotros|equipo|team|about|historia|fundador|founder|staff|profesionales|doctor|direcci[oó]n|our-story|meet|conocenos|con[oó]cenos|empresa)/i
const FALLBACK = ['/aviso-legal', '/aviso-legal/', '/quienes-somos', '/sobre-nosotros', '/nosotros', '/equipo', '/about', '/about-us', '/team']
const GENERIC_MAIL = /^(info|contacto|contact|hola|hello|admin|administracion|reservas|bookings?|ventas|sales|office|oficina|recepcion|clinica|citas|soporte|support|web|marketing|rrhh|empleo|jobs|noreply|no-reply|facturacion|pedidos)\b/i

async function get(url: string, ms = 8000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html' } })
    if (!r.ok || !(r.headers.get('content-type') || '').includes('html')) return null
    return { url: r.url, html: (await r.text()).slice(0, 600000) }
  } catch { return null } finally { clearTimeout(t) }
}

const textOf = (html: string) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|section|footer)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;|&[a-z]+;/gi, ' ')
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim()

function links(html: string, base: string) {
  const out: string[] = []
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) { try { out.push(new URL(m[1], base).href) } catch {} }
  return out
}

export type Person = { name: string; role: string | null; decision_maker: boolean; confidence: 'high' | 'medium' | 'low'; evidence: string | null; source_url: string | null; linkedin_url: string | null; email: string | null; found_by: string }

export async function findPeople(lead: any): Promise<{ people: Person[]; best: number | null; legal_name: string | null; note: string | null; pages: string[]; error?: string }> {
  const people: Person[] = []
  if (lead.contact_name && /BORME/i.test(`${lead.source || ''} ${lead.notes || ''}`))
    people.push({ name: lead.contact_name, role: 'Administrador (BORME)', decision_maker: true, confidence: 'high', evidence: 'Listed as administrator in the official company register (BORME).', source_url: lead.source_url || null, linkedin_url: null, email: null, found_by: 'borme' })
  if (!lead.website) return { people, best: people.length ? 0 : null, legal_name: null, note: null, pages: [] }

  const home = await get(lead.website)
  if (!home) return { people, best: people.length ? 0 : null, legal_name: null, note: null, pages: [], error: 'site_unreachable' }
  const origin = new URL(home.url).origin
  const all = links(home.html, home.url)
  const same = [...new Set(all.filter(u => u.startsWith(origin) && PAGE_HINT.test(new URL(u).pathname)))].slice(0, 5)
  const tryUrls = same.length >= 2 ? same : [...same, ...FALLBACK.map(p => origin + p)].slice(0, 6)
  const pages = [home, ...(await Promise.all(tryUrls.map(u => get(u, 7000)))).filter(Boolean) as { url: string; html: string }[]]
  const uniq = pages.filter((p, i) => pages.findIndex(q => q.url === p.url) === i).slice(0, 6)

  // Things the site itself publishes: personal LinkedIn profiles, named work emails, schema.org people.
  const linkedins = new Set<string>(), mails = new Set<string>(), schemaPeople: string[] = []
  for (const p of uniq) {
    for (const u of links(p.html, p.url)) if (/linkedin\.com\/in\//i.test(u)) linkedins.add(u.split('?')[0])
    for (const m of p.html.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) if (!GENERIC_MAIL.test(m[0]) && !/example|sentry|wixpress|\.png|\.jpg/i.test(m[0])) mails.add(m[0].toLowerCase())
    for (const m of p.html.matchAll(/"@type"\s*:\s*"Person"[^}]*?"name"\s*:\s*"([^"]+)"/g)) schemaPeople.push(m[1])
    for (const m of p.html.matchAll(/"(founder|employee|author)"\s*:\s*\{[^}]*?"name"\s*:\s*"([^"]+)"/g)) schemaPeople.push(`${m[2]} (${m[1]})`)
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { people, best: people.length ? 0 : null, legal_name: null, note: null, pages: uniq.map(p => p.url), error: 'no_ai_key' }
  const corpus = uniq.map(p => `### PAGE ${p.url}\n${textOf(p.html).slice(0, 7000)}`).join('\n\n').slice(0, 30000)
  const prompt = `You help a small marketing agency find the right person to contact at a local business in Spain: "${lead.name}" (${lead.category || 'business'}, ${lead.area || ''}).
Below is text from the business's own website. Identify the PEOPLE NAMED ON THESE PAGES who run or decide for the business (owner, founder, director, gerente, socio, medical director, head chef-owner, administrator in the legal notice, etc.). Also note other named staff only if no decision-maker is named.
Rules:
- Only people explicitly named in the text. Never guess or invent names, never infer from email addresses alone.
- The legal notice (aviso legal) often names the owner: if the titular is a person (autónomo), that person is the owner; if it is a company (S.L./S.A.), report the company as legal_name and do not treat it as a person.
- evidence = a short verbatim quote (max 140 chars) proving the name and role; source_url = the PAGE url it came from.
- confidence: high = name + clear owner/director role; medium = name with a senior role but unclear if decision-maker; low = named staff only.
Also known from the site: schema people ${JSON.stringify(schemaPeople.slice(0, 8))}; named work emails ${JSON.stringify([...mails].slice(0, 8))}; personal LinkedIn links ${JSON.stringify([...linkedins].slice(0, 8))}.
Match a LinkedIn link or email to a person only if the link/email clearly contains that person's name.
Reply with JSON only: {"legal_name": string|null, "people":[{"name":string,"role":string|null,"decision_maker":boolean,"confidence":"high"|"medium"|"low","evidence":string,"source_url":string,"linkedin_url":string|null,"email":string|null}], "best": index|null, "note": string|null}
"note" = one short sentence for the agency, e.g. who to approach and why, or that no person is named.

${corpus}`
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.PEOPLE_MODEL || process.env.FREE_AUDIT_MODEL || 'claude-haiku-5-5', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] }),
    })
    const j = await r.json()
    const txt = (j?.content || []).map((c: any) => c.text || '').join('')
    const parsed = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1))
    const corpusLower = corpus.toLowerCase()
    for (const p of parsed.people || []) {
      if (!p?.name || p.name.length > 80) continue
      // Guard against invented names: the surname (last word) must appear in the pages we read.
      const last = String(p.name).trim().split(/\s+/).pop()!.toLowerCase()
      if (last.length > 2 && !corpusLower.includes(last)) continue
      if (people.some(q => q.name.toLowerCase() === String(p.name).toLowerCase())) continue
      people.push({
        name: String(p.name).trim(), role: p.role || null, decision_maker: !!p.decision_maker,
        confidence: ['high', 'medium', 'low'].includes(p.confidence) ? p.confidence : 'low',
        evidence: p.evidence ? String(p.evidence).slice(0, 200) : null, source_url: p.source_url || null,
        linkedin_url: p.linkedin_url && /linkedin\.com\/in\//i.test(p.linkedin_url) ? p.linkedin_url : null,
        email: p.email && !GENERIC_MAIL.test(p.email) ? String(p.email).toLowerCase() : null, found_by: 'website_ai',
      })
    }
    const rank = (p: Person) => (p.decision_maker ? 10 : 0) + ({ high: 3, medium: 2, low: 1 } as any)[p.confidence] + (p.found_by === 'borme' ? 1 : 0)
    let best: number | null = null
    people.forEach((p, i) => { if (best === null || rank(p) > rank(people[best])) best = i })
    return { people, best, legal_name: parsed.legal_name || null, note: parsed.note || null, pages: uniq.map(p => p.url) }
  } catch (e: any) {
    return { people, best: people.length ? 0 : null, legal_name: null, note: null, pages: uniq.map(p => p.url), error: 'ai_failed' }
  }
}

// Saves the findings: people rows, the best one as the lead's main contact (unless Chris already set one), and a note.
export async function savePeople(sb: any, lead: any, res: Awaited<ReturnType<typeof findPeople>>) {
  const rows = res.people.map((p, i) => ({ ...p, lead_id: lead.id, best: i === res.best }))
  if (rows.length) {
    await sb.from('crm_people').update({ best: false }).eq('lead_id', lead.id).neq('found_by', 'manual')
    await sb.from('crm_people').upsert(rows, { onConflict: 'lead_id,name' })
  }
  const best = res.best !== null ? res.people[res.best] : null
  const patch: any = { people_checked_at: new Date().toISOString(), legal_owner_note: res.note || (res.people.length ? null : 'No owner or manager named on their website.') }
  if (best && !lead.contact_name) { patch.contact_name = best.name.split(/\s+/)[0]; patch.contact_role = best.role }
  if (res.legal_name && !lead.legal_name) patch.legal_name = res.legal_name
  await sb.from('crm_leads').update(patch).eq('id', lead.id)
  if (best) await sb.from('crm_activities').insert({ lead_id: lead.id, type: 'auditoria', body: `Decision-maker found: ${best.name}${best.role ? ` (${best.role})` : ''} · ${best.confidence} confidence · ${best.source_url || 'website'}` })
  return { ...res, saved: rows.length }
}
