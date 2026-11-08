// Temporary probe (removed after testing).
import { NextResponse } from 'next/server'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
const H = { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': UA, origin: 'https://adstransparency.google.com', referer: 'https://adstransparency.google.com/' }
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no' }, { status: 401 })
  const ids = ['AR06156975806548541441']
  const out: any = {}
  const sug = await (await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchSuggestions?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '1': 'clinica dental estepona', '2': 10, '3': 10 }) }) })).text()
  out.sug = sug.slice(0, 1500)
  for (const id of ids) {
    const t = await (await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '2': 40, '3': { '8': [2724], '13': { '1': [id] } }, '7': { '1': 1 } }) }) })).text()
    const j = JSON.parse(t); out[id] = { keys: (j['1'] || []).map((c: any) => Object.keys(c).join(',')).slice(0, 10), f14: (j['1'] || []).map((c: any) => c['14']).filter(Boolean).slice(0, 10) }
    const ad = await (await fetch('https://adstransparency.google.com/anji/_/rpc/LookupService/GetAdvertiserById?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '1': id, '3': { '1': 2724 } }) }) })).text()
    out[id].adv = ad.slice(0, 800)
  }
  return NextResponse.json(out)
}
