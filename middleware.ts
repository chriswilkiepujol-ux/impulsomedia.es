import { NextRequest, NextResponse } from 'next/server'

// Staging hosts (qa.impulsomedia.es) are private: HTTP Basic auth + noindex.
// Credentials come from env (QA_USER / QA_PASSWORD); defaults keep staging
// closed even if the env vars are not set yet.
const STAGING_HOST_PREFIX = 'qa.'
const QA_USER = process.env.QA_USER || 'impulso'
const QA_PASSWORD = process.env.QA_PASSWORD || 'impulso2026'

function isStaging(request: NextRequest) {
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase()
  return host.startsWith(STAGING_HOST_PREFIX)
}

function isAuthorized(request: NextRequest) {
  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Basic ')) return false
  try {
    const [user, pass] = atob(auth.slice(6)).split(':')
    return user === QA_USER && pass === QA_PASSWORD
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- CRM privado: crm.impulsomedia.es sirve la app estática de /crm-app (sin cabecera, pie ni analítica de la web) ---
  const rawHost = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase()
  const isCrmHost = rawHost.startsWith('crm.')
  const isPublicSite = rawHost === 'impulsomedia.es' || rawHost === 'www.impulsomedia.es'
  // --- Free website audit: staging only (qa.impulsomedia.es) until launch. On the public site it does not exist. ---
  const isFreeAudit = pathname === '/auditoria-web-gratis' || pathname === '/en/free-website-audit' || pathname.startsWith('/api/free-audit')
  // Exception before launch: a report we shared from the CRM (id + k in the link) opens on the public domain, because QA is password-protected.
  // The API decides what is allowed (GET of a report, request/answer forms); new audits stay off the public site until launch.
  const sharedReport = pathname.startsWith('/api/free-audit') || (request.nextUrl.searchParams.has('id') && request.nextUrl.searchParams.has('k'))
  if (isFreeAudit && isPublicSite && process.env.NEXT_PUBLIC_FREE_AUDIT_LIVE !== '1' && !sharedReport) return new NextResponse('Not found', { status: 404, headers: { 'x-robots-tag': 'noindex' } })
  if (isFreeAudit && isPublicSite && sharedReport) { const h = new Headers(request.headers); h.set('x-locale', pathname.startsWith('/en/') ? 'en' : 'es'); const r = NextResponse.next({ request: { headers: h } }); r.headers.set('x-robots-tag', 'noindex, nofollow'); r.headers.set('cache-control', 'no-store'); return r }
  if (isCrmHost) {
    const noindex = { 'x-robots-tag': 'noindex, nofollow, noarchive', 'cache-control': 'no-store' }
    if (pathname === '/robots.txt') return new NextResponse('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain', ...noindex } })
    // Service worker and manifest must live at the root so the installed app (scope "/") is controlled by them.
    if (pathname === '/sw.js' || pathname === '/manifest.webmanifest') return NextResponse.rewrite(new URL('/crm-app' + pathname, request.url))
    const res = pathname.startsWith('/crm-app/') || pathname.startsWith('/api/crm/')
      ? NextResponse.next()
      : NextResponse.rewrite(new URL('/crm-app/index.html', request.url))
    Object.entries(noindex).forEach(([k, v]) => res.headers.set(k, v))
    return res
  }
  if (isPublicSite && pathname.startsWith('/crm-app')) return new NextResponse('Not found', { status: 404 })
  // --- fin CRM ---
  const staging = isStaging(request)

  if (staging) {
    if (pathname === '/robots.txt') {
      return new NextResponse('User-agent: *\nDisallow: /\n', {
        headers: { 'content-type': 'text/plain', 'x-robots-tag': 'noindex, nofollow' },
      })
    }
    if (!isAuthorized(request)) {
      return new NextResponse('Staging privado. Introduce usuario y contraseña.', {
        status: 401,
        headers: {
          'www-authenticate': 'Basic realm="ImpulsoMedia QA", charset="UTF-8"',
          'x-robots-tag': 'noindex, nofollow',
          'cache-control': 'no-store',
        },
      })
    }
  }

  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (staging) {
    response.headers.set('x-robots-tag', 'noindex, nofollow, noarchive')
    response.headers.set('cache-control', 'no-store')
  }
  return response
}

export const config = {
  // Staging protection must cover everything (including images and static files),
  // so the matcher is broad; the locale header is harmless on static paths.
  matcher: ['/((?!_next/static|_next/image).*)'],
}
