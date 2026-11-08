// Temporary: checks which outside data sources respond from Vercel. Removed after testing.
import { NextResponse } from 'next/server'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
async function t(name: string, f: () => Promise<Response>) {
  try { const r = await f(); const x = await r.text(); return { name, status: r.status, len: x.length, head: x.slice(0, 900) } } catch (e: any) { return { name, error: String(e?.message || e).slice(0, 200) } }
}
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no' }, { status: 401 })
  const q = `[out:json][timeout:25];(nwr["office"~"lawyer|estate_agent|accountant"](36.20,-5.45,36.35,-5.20););out center tags 5;`
  const res = await Promise.all([
    t('overpass', () => fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: new URLSearchParams({ data: q }), signal: AbortSignal.timeout(30000), headers: { 'user-agent': 'ImpulsoMediaCRM/1.0' } })),
    t('ads_suggest', () => fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchSuggestions?authuser=0', { method: 'POST', body: new URLSearchParams({ 'f.req': JSON.stringify({ '1': 'sotogrande', '2': 10, '3': 10 }) }), headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': UA, origin: 'https://adstransparency.google.com', referer: 'https://adstransparency.google.com/' }, signal: AbortSignal.timeout(15000) })),
    t('borme_sumario', () => fetch('https://www.boe.es/datosabiertos/api/borme/sumario/20261106', { headers: { accept: 'application/json', 'user-agent': UA }, signal: AbortSignal.timeout(15000) })),
  ])
  return NextResponse.json(res)
}
