// Tracked link: impulsomedia.es/r/<slug> → logs the click for the lead it was sent to, then redirects.
// First-party: only links Chris sent count. Link-preview robots (WhatsApp, Facebook, Slack…) are ignored.
import { NextResponse } from 'next/server'
import { crmBot } from '@/lib/crm-supabase'
import { sendPush } from '@/lib/push'
export const dynamic = 'force-dynamic'
const BOT = /bot|crawler|spider|preview|whatsapp|facebookexternalhit|facebot|telegram|slack|discord|skype|linkedin|twitter|embedly|curl|wget|python|node-fetch|headless|lighthouse|google-inspectiontool|bingpreview|outlook|msnbot|safelinks|barracuda|proofpoint|mimecast/i

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const home = 'https://impulsomedia.es/'
  // impulsomedia.es/r/me marks this browser as Chris's own: his clicks on tracked links are never counted.
  if (slug === 'me') {
    const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Device marked</title></head><body style="font-family:system-ui,sans-serif;max-width:420px;margin:15vh auto;padding:0 20px;text-align:center;color:#111418"><div style="font-size:44px">✓</div><h1 style="font-size:22px">This browser is marked as yours</h1><p style="color:#5b6270;line-height:1.5">Clicks on your tracked links from this browser won't count as a client click in the CRM. Do this once in each browser you use (Safari, Chrome, and the WhatsApp or Instagram in-app browser).</p></body></html>`
    const res = new NextResponse(page, { headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex', 'cache-control': 'no-store' } })
    res.headers.append('set-cookie', 'im_owner=1; Domain=.impulsomedia.es; Path=/; Max-Age=63072000; Secure; SameSite=Lax')
    return res
  }
  const isOwner = /(?:^|;\s*)im_owner=1/.test(req.headers.get('cookie') || '')
  let target = home
  try {
    const sb = await crmBot()
    const { data: l } = await sb.from('crm_links').select('*').eq('slug', slug).single()
    if (!l) return NextResponse.redirect(home, 302)
    target = l.target
    if (new URL(req.url).searchParams.has('en') && /impulsomedia\.es\/proyectos\/?$/.test(target)) target = 'https://impulsomedia.es/en/work'
    const ua = req.headers.get('user-agent') || ''
    if (!isOwner && !BOT.test(ua) && req.method === 'GET') {
      const now = new Date(); const firstToday = !l.last_click_at || new Date(l.last_click_at).toDateString() !== now.toDateString()
      await sb.from('crm_link_hits').insert({ slug, ua: ua.slice(0, 200), referer: (req.headers.get('referer') || '').slice(0, 200) })
      await sb.from('crm_links').update({ clicks: (l.clicks || 0) + 1, first_click_at: l.first_click_at || now.toISOString(), last_click_at: now.toISOString() }).eq('slug', slug)
      if (l.lead_id) {
        const { data: lead } = await sb.from('crm_leads').select('name,clicks,relationship,status').eq('id', l.lead_id).single()
        await sb.from('crm_leads').update({ clicks: (lead?.clicks || 0) + 1, last_click_at: now.toISOString(), ...(lead?.relationship === 'lead' && !['ganado', 'descartado'].includes(lead?.status) ? { next_action_at: now.toISOString() } : {}) }).eq('id', l.lead_id)
        if (firstToday) {
          await sb.from('crm_activities').insert({ lead_id: l.lead_id, type: 'nota', body: `Clicked your link (${l.label || target}).` })
          try { await sendPush(sb, { type: 'clicks', title: `${lead?.name || 'A lead'} clicked your link`, body: `${l.label || 'Your link'} · good moment to follow up`, url: `/?lead=${l.lead_id}`, tag: `click-${slug}`, snoozeLead: l.lead_id }) } catch {}
        }
      }
    }
  } catch { /* never block the visitor */ }
  const r = NextResponse.redirect(target, 302); r.headers.set('x-robots-tag', 'noindex'); r.headers.set('cache-control', 'no-store'); return r
}
