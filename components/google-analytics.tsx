"use client"

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/**
 * Fires a GA4 event for contact CTAs anywhere on the site.
 * Any <a> whose href points to wa.me / api.whatsapp.com, tel: or mailto:
 * is tracked automatically, so new buttons need no extra code.
 * Events: whatsapp_click, phone_click, email_click
 */
function useContactClickTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null
      if (!anchor || !window.gtag) return

      const href = anchor.getAttribute('href') || ''
      let eventName: string | null = null

      if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) eventName = 'whatsapp_click'
      else if (/^tel:/i.test(href)) eventName = 'phone_click'
      else if (/^mailto:/i.test(href)) eventName = 'email_click'

      if (!eventName) return

      window.gtag('event', eventName, {
        link_url: href,
        link_text: (anchor.textContent || anchor.getAttribute('aria-label') || '').trim().slice(0, 100),
        page_path: window.location.pathname,
      })
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [])
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-TET569B619'

  useContactClickTracking()

  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
