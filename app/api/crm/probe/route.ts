// Temporary probe (removed after testing).
import { NextResponse } from 'next/server'
export const maxDuration = 60
export const dynamic = 'force-dynamic'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'no' }, { status: 401 })
  const s = await (await fetch('https://www.boe.es/datosabiertos/api/borme/sumario/20261106', { headers: { accept: 'application/json', 'user-agent': UA } })).json()
  const secA = s.data.sumario.diario[0].seccion.find((x: any) => x.codigo === 'A')
  const it = secA.item.filter((i: any) => /C[ÁA]DIZ|M[ÁA]LAGA/.test(i.titulo))
  const out: any[] = []
  for (const i of it) { const x = await (await fetch(i.url_xml, { headers: { 'user-agent': UA } })).text(); out.push({ t: i.titulo, len: x.length, sample: x.slice(0, 3500), san: (x.match(/SAN ROQUE|SOTOGRANDE|ESTEPONA|MANILVA|LINEA|ALGECIRAS/gi) || []).length }) }
  return NextResponse.json(out)
}
