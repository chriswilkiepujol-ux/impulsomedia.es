"use client"
import { useEffect, useState } from 'react'

// The free audit is only switched on for the staging host until launch.
// At launch set NEXT_PUBLIC_FREE_AUDIT_LIVE=1 in Vercel (and remove the 404 rule in middleware.ts).
export function useFreeAuditLive() {
  const [live, setLive] = useState(process.env.NEXT_PUBLIC_FREE_AUDIT_LIVE === '1')
  useEffect(() => {
    if (live) return
    const h = location.hostname
    if (h !== 'impulsomedia.es' && h !== 'www.impulsomedia.es') setLive(true)
  }, [live])
  return live
}
export const auditHref = (en: boolean) => (en ? '/en/free-website-audit' : '/auditoria-web-gratis')
