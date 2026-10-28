#!/usr/bin/env node
/**
 * Pre-launch technical SEO check. Crawls every URL in public/sitemap.xml on a
 * running server and fails (exit 1) if any rule in docs/SEO-NORMATIVA.md is broken.
 *
 *   pnpm build && pnpm start -p 3000 &   then   pnpm seo:check [baseUrl]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const SITE = 'https://impulsomedia.es'
const sitemap = readFileSync('public/sitemap.xml', 'utf8')
const errors = []
const warns = []
const err = (u, m) => errors.push(`${u}  ✗ ${m}`)
const warn = (u, m) => warns.push(`${u}  ! ${m}`)

const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
  const loc = m[1].match(/<loc>(.*?)<\/loc>/)[1].replace(SITE, '') || '/'
  const alts = Object.fromEntries([...m[1].matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((a) => [a[1], a[2].replace(SITE, '') || '/']))
  const dupes = [...m[1].matchAll(/hreflang="([^"]+)"/g)].map((a) => a[1])
  return { loc, alts, dupes }
})
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
const attr = (h, re) => { const m = h.match(re); return m ? decode(m[1]) : null }

// 1. Sitemap hygiene: unique urls, no duplicate hreflang, reciprocity
const seen = new Set()
for (const e of entries) {
  if (seen.has(e.loc)) err(e.loc, 'duplicated in sitemap'); seen.add(e.loc)
  if (new Set(e.dupes).size !== e.dupes.length) err(e.loc, 'sitemap repeats a hreflang value')
}
const byLoc = Object.fromEntries(entries.map((e) => [e.loc, e]))
for (const e of entries) for (const [lang, href] of Object.entries(e.alts)) {
  if (lang === 'x-default' || href === e.loc) continue
  const other = byLoc[href]
  if (!other) { err(e.loc, `hreflang ${lang} -> ${href} is not in the sitemap`); continue }
  if (!Object.values(other.alts).includes(e.loc)) err(e.loc, `no return tag from ${href}`)
  if (other.alts['x-default'] !== e.alts['x-default']) err(e.loc, `x-default differs from ${href} (${e.alts['x-default']} vs ${other.alts['x-default']})`)
}

// 2. Routes that exist in /app must be in the sitemap
const routes = []
const walk = (d, p = '') => { for (const f of readdirSync(d, { withFileTypes: true })) {
  if (f.isDirectory()) { if (!/^[\[(_]/.test(f.name) && f.name !== 'api') walk(`${d}/${f.name}`, `${p}/${f.name}`) }
  else if (/^page\.tsx?$/.test(f.name)) routes.push(p || '/') } }
walk('app')
for (const r of routes) if (!byLoc[r]) warn(r, 'route exists but is not in sitemap.xml')

// 3. Per-page checks
for (const e of entries) {
  let res
  try { res = await fetch(BASE + e.loc, { redirect: 'manual' }) } catch (x) { err(e.loc, `fetch failed: ${x.message}`); continue }
  if (res.status !== 200) { err(e.loc, `HTTP ${res.status}`); continue }
  const h = await res.text()
  const title = attr(h, /<title>([\s\S]*?)<\/title>/)
  const desc = attr(h, /<meta name="description" content="([^"]*)"/)
  const canon = attr(h, /<link rel="canonical" href="([^"]*)"/)
  const ogT = attr(h, /<meta property="og:title" content="([^"]*)"/)
  const ogD = attr(h, /<meta property="og:description" content="([^"]*)"/)
  const ogI = attr(h, /<meta property="og:image" content="([^"]*)"/)
  const twI = attr(h, /<meta name="twitter:image" content="([^"]*)"/)
  const h1s = (h.match(/<h1[\s>]/g) || []).length
  if (!title) err(e.loc, 'missing <title>')
  else if (title.length > 60) err(e.loc, `title ${title.length} chars (max 60): ${title}`)
  else if (title.length < 25) warn(e.loc, `title only ${title.length} chars`)
  if (!desc) err(e.loc, 'missing meta description')
  else if (desc.length > 160) err(e.loc, `description ${desc.length} chars (max 160)`)
  else if (desc.length < 90) warn(e.loc, `description only ${desc.length} chars`)
  if (canon !== SITE + (e.loc === '/' ? '' : e.loc) && canon !== SITE + e.loc) err(e.loc, `canonical is ${canon}`)
  if (!ogT || !ogD) err(e.loc, 'incomplete Open Graph (og:title / og:description)')
  if (!ogI) err(e.loc, 'missing og:image')
  else if (/\.svg$/.test(ogI)) err(e.loc, 'og:image is an SVG (use PNG/JPG)')
  else if (ogI.startsWith(SITE)) { const p = 'public' + ogI.replace(SITE, ''); if (!existsSync(p)) err(e.loc, `og:image file missing: ${p}`) }
  if (!twI) warn(e.loc, 'missing twitter:image')
  if (h1s !== 1) err(e.loc, `${h1s} <h1> tags (need exactly 1)`)
  if (/<meta name="robots" content="[^"]*noindex/.test(h)) err(e.loc, 'noindex on a sitemap URL')
  const tags = [...h.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2].replace(SITE, '') || '/'])
  const langs = tags.map((t) => t[0])
  if (new Set(langs).size !== langs.length) err(e.loc, 'duplicate hreflang values in <head>')
  const own = Object.fromEntries(tags)
  for (const [l, href] of tags) if (l !== 'x-default' && JSON.stringify(own[l]) && e.alts[l] && e.alts[l] !== href) err(e.loc, `head hreflang ${l} (${href}) != sitemap (${e.alts[l]})`)
  if (tags.length && !tags.some(([l, href]) => l !== 'x-default' && href === e.loc)) err(e.loc, 'hreflang set has no self-reference')
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]) } catch { err(e.loc, 'invalid JSON-LD') }
  }
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\balt=/.test(m[0])).length
  if (imgs) warn(e.loc, `${imgs} <img> without alt`)
}

// 4. robots + sitemap reachable
for (const p of ['/robots.txt', '/sitemap.xml']) { const r = await fetch(BASE + p); if (r.status !== 200) err(p, `HTTP ${r.status}`) }

console.log(`\nChecked ${entries.length} URLs on ${BASE}`)
if (warns.length) console.log(`\nWarnings (${warns.length}):\n` + warns.join('\n'))
if (errors.length) { console.log(`\nERRORS (${errors.length}):\n` + errors.join('\n')); process.exit(1) }
console.log('\n✓ Technical SEO check passed')
