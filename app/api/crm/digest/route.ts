import { NextResponse } from 'next/server'
import { crmAnonClient } from '@/lib/crm-supabase'
import { runDigest } from '@/lib/digest'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Manual trigger for the morning digest (the daily run happens at the end of /api/crm/cron).
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  const sb = crmAnonClient()
  const { error } = await sb.auth.signInWithPassword({ email: process.env.CRM_BOT_EMAIL!, password: process.env.CRM_BOT_PASSWORD! })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, ...(await runDigest(sb)) })
}
