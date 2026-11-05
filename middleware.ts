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
