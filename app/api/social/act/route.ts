// The feed's buttons. "like" is the approval: it puts the post in the queue at the next free slot.
import { NextResponse } from 'next/server'
import { ownerFromRequest, getSettings, freeSlots, slotForPlanDate, takenDays, publishPost, log } from '@/lib/social/core'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: Request) {
  const sb = await ownerFromRequest(req)
  if (!sb) return NextResponse.json({ error: 'no_auth' }, { status: 401 })
  const { action, id, when } = await req.json().catch(() => ({}))
  if (!id || !action) return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  const now = new Date()
  const one = async (patch: any, from: string[]) => {
    const { data, error } = await sb.from('social_posts').update(patch).eq('id', id).in('status', from).select('*')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data?.length) return NextResponse.json({ error: 'This post changed in the meantime. Pull to refresh.' }, { status: 409 })
    return NextResponse.json({ ok: true, post: data[0] })
  }
  if (action === 'like') {
    const s = await getSettings(sb)
    const taken = await takenDays(sb, id)
    const { data: cur } = await sb.from('social_posts').select('plan_date').eq('id', id).maybeSingle()
    const slot = slotForPlanDate(s.slots, cur?.plan_date || null, taken, now) || freeSlots(s.slots, taken, now, 1)[0]
    if (!slot) return NextResponse.json({ error: 'No free slot found. Check the posting days in Settings.' }, { status: 400 })
    await log(sb, 'liked', id, { slot })
    return one({ status: 'approved', liked_at: now.toISOString(), scheduled_at: slot.toISOString(), error: null }, ['draft', 'rejected', 'failed'])
  }
  if (action === 'unlike') return one({ status: 'draft', scheduled_at: null, liked_at: null, error: null }, ['approved', 'failed'])
  if (action === 'reject') return one({ status: 'rejected', scheduled_at: null }, ['draft', 'approved', 'failed'])
  if (action === 'restore') return one({ status: 'draft', scheduled_at: null, error: null }, ['rejected', 'failed'])
  if (action === 'reschedule') {
    const d = new Date(when)
    if (isNaN(d.getTime()) || d.getTime() < now.getTime() - 60000) return NextResponse.json({ error: 'That time is already in the past.' }, { status: 400 })
    return one({ scheduled_at: d.toISOString(), status: 'approved', error: null }, ['approved', 'failed', 'draft'])
  }
  if (action === 'mark_published') return one({ status: 'published', published_at: now.toISOString(), error: null }, ['approved', 'failed', 'draft'])
  if (action === 'publish_now') {
    const r = await publishPost(sb, id)
    return NextResponse.json(r, { status: r.ok ? 200 : 400 })
  }
  return NextResponse.json({ error: 'bad_action' }, { status: 400 })
}
