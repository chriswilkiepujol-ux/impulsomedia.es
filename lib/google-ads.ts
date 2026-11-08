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
export async function domainForAdvertiser(advertiser: string): Promise<string | null> {
  const q = advertiser.replace(/[,.]?\s*\b(s\.?l\.?u?|s\.?a\.?u?|s\.?l\.?p|sociedad limitada)\b\.?/gi, '').replace(/\s+/g, ' ').trim()
  const words = [q, q.split(' ').slice(0, 2).join(' ')].filter((x, i, a) => x && a.indexOf(x) === i)
  const want = advertiser.trim().toLowerCase()
  for (const w of words) {
    try {
      const r = await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchSuggestions?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '1': w, '2': 10, '3': 10 }) }), signal: AbortSignal.timeout(12000) })
      if (!r.ok) continue
      const j: any = await r.json()
      const domains = (j['1'] || []).map((x: any) => x?.['2']?.['1']).filter(Boolean).slice(0, 4) as string[]
      for (const d of domains) {
        const g = await googleAdsByDomain(d)
        if (g.ok && g.advertisers.some(a => a.trim().toLowerCase() === want)) return d
      }
    } catch { /* try next */ }
  }
  return null
}
