// Google Ads Transparency Center (unofficial endpoint the public site uses), Spain only.
// By domain: which ads point to that website. days = only ads shown in that many recent days.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
const H = { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': UA, origin: 'https://adstransparency.google.com', referer: 'https://adstransparency.google.com/' }
const ymd = (d: Date) => Number(d.toISOString().slice(0, 10).replace(/-/g, ''))
export async function googleAdsByDomain(domain: string, days?: number): Promise<{ ok: true; count: number; more: boolean; advertisers: string[] } | { ok: false; status?: number; raw?: string }> {
  const range = days ? { '6': ymd(new Date(Date.now() - days * 86400000)), '7': ymd(new Date()) } : {}
  const body = new URLSearchParams({ 'f.req': JSON.stringify({ '2': 100, '3': { ...range, '8': [2724], '12': { '1': domain, '2': true } }, '7': { '1': 1 } }) })
  const r = await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0', { method: 'POST', body, headers: H, signal: AbortSignal.timeout(15000) })
  const text = await r.text()
  if (!r.ok) return { ok: false, status: r.status, raw: text.slice(0, 200) }
  let j: any = {}; try { j = JSON.parse(text) } catch { return { ok: false, status: r.status, raw: text.slice(0, 200) } }
  const list: any[] = Array.isArray(j['1']) ? j['1'] : []
  const advertisers = Array.from(new Set(list.map(c => c?.['12']).filter(Boolean))).slice(0, 5) as string[]
  const total = Number(j['4'] ?? 0) || list.length
  return { ok: true, count: list.length ? Math.max(total, list.length) : 0, more: !!j['2'], advertisers }
}

// Finds an advertiser's website: ask the register for domains matching the company name, then keep only a domain
// whose ads are paid by that same advertiser (so it's verified, not guessed).
export async function domainForAdvertiser(advertiser: string, debug?: any[]): Promise<string | null> {
  const q = advertiser.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' ').replace(/[,.]?\s*\b(s\.?l\.?u?|s\.?a\.?u?|s\.?l\.?p|sociedad limitada)\b\.?/gi, '').replace(/\s+/g, ' ').trim()
  const words = [q, q.split(' ').slice(0, 2).join(' ')].filter((x, i, a) => x && a.indexOf(x) === i)
  const key = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\b(s\.?l\.?u?|s\.?a\.?u?|s\.?l\.?p|sociedad limitada)\b/g, '').replace(/[^a-z0-9]/g, '')
  const want = key(advertiser)
  for (const w of words) {
    try {
      const r = await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchSuggestions?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '1': w, '2': 10, '3': 10 }) }), signal: AbortSignal.timeout(12000) })
      if (!r.ok) continue
      const j: any = await r.json()
      const domains = (j['1'] || []).map((x: any) => x?.['2']?.['1']).filter(Boolean).slice(0, 4) as string[]
      debug?.push({ w, domains })
      for (const d of domains) {
        const g = await googleAdsByDomain(d)
        if (g.ok && g.advertisers.some(a => key(a) === want)) return d
        // Same name as the domain itself (clinicadentalestepona.es for "Clínica Dental Estepona S.L.") is good enough.
        if (want.length >= 8 && key(d.split('.')[0]) === want) return d
      }
    } catch { /* try next */ }
  }
  return null
}

// Fallback: read the web address shown on the advertiser's own ads (ad previews), then verify it the same way.
export async function domainFromAdPreviews(advertiserId: string, advertiser: string, debug?: any[]): Promise<string | null> {
  const key = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\b(s\.?l\.?u?|s\.?a\.?u?|s\.?l\.?p|sociedad limitada)\b/g, '').replace(/[^a-z0-9]/g, '')
  try {
    const r = await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '2': 8, '3': { '8': [2724], '13': { '1': [advertiserId] } }, '7': { '1': 1 } }) }), signal: AbortSignal.timeout(12000) })
    const j: any = await r.json()
    const urls = (j['1'] || []).map((c: any) => c?.['3']?.['1']?.['4']).filter(Boolean).slice(0, 5) as string[]
    const seen = new Map<string, number>()
    for (const u of urls) {
      try {
        const t = await (await fetch(u, { headers: { 'user-agent': UA, referer: 'https://adstransparency.google.com/' }, signal: AbortSignal.timeout(10000) })).text()
        const txt = t.replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\u002f/gi, '/').replace(/\\\//g, '/')
        for (const m of txt.matchAll(/(?:https?:\/\/)?(?:www\.)?([a-z0-9][a-z0-9-]{1,60}\.(?:com|es|net|eu|org|info|co\.uk|gi|cat|biz|io))(?![a-z0-9.-])/gi)) {
          const d = m[1].toLowerCase(); if (/google|gstatic|doubleclick|googleusercontent|youtube|ggpht|w3\.org|schema\.org|googlesyndication|googleadservices/.test(d)) continue
          seen.set(d, (seen.get(d) || 0) + 1)
        }
      } catch { /* next preview */ }
    }
    const ranked = [...seen.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 4)
    debug?.push({ previews: urls.length, ranked })
    for (const d of ranked) { const g = await googleAdsByDomain(d); if (g.ok && g.advertisers.some(a => key(a) === key(advertiser))) return d }
  } catch { /* give up quietly */ }
  return null
}
