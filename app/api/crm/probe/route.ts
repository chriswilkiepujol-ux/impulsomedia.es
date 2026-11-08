// Temporary probe (removed after testing).
import { NextResponse } from 'next/server'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
const H = { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': UA, origin: 'https://adstransparency.google.com', referer: 'https://adstransparency.google.com/' }
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no' }, { status: 401 })
  const s = await (await fetch('https://www.boe.es/datosabiertos/api/borme/sumario/20261106', { headers: { accept: 'application/json', 'user-agent': UA } })).json()
  const secs = s.data.sumario.diario[0].seccion
  const secA = (Array.isArray(secs) ? secs : [secs]).map((x: any) => ({ codigo: x.codigo, nombre: x.nombre, keys: Object.keys(x), items: JSON.stringify(x).slice(0, 1500) }))
  const cr = await (await fetch('https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0', { method: 'POST', headers: H, body: new URLSearchParams({ 'f.req': JSON.stringify({ '2': 3, '3': { '8': [2724], '13': { '1': ['AR06156975806548541441'] } }, '7': { '1': 1 } }) }) })).text()
  return NextResponse.json({ secA, cr: cr.slice(0, 2500) })
}
