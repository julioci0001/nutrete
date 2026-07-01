// ══════════════════════════════════════════════════════════════
// middleware.ts — Geolocation & Routing
// ══════════════════════════════════════════════════════════════
// Runs on Vercel Edge — detects country from IP and injects
// geo headers so every page knows where the visitor is from.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that skip middleware
const PUBLIC_PATHS = [
  '/_next',
  '/favicon',
  '/robots.txt',
  '/sitemap',
  '/api/geo',
  '/static',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static/public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // ── Geo detection via Vercel headers ─────────────────────────
  // Vercel automatically injects x-vercel-ip-country
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.cookies.get('nutrete_country')?.value ||
    'AR'                                          // Default: Argentina

  const city    = request.headers.get('x-vercel-ip-city')    || ''
  const region  = request.headers.get('x-vercel-ip-country-region') || ''
  const lat     = request.headers.get('x-vercel-ip-latitude')  || ''
  const lon     = request.headers.get('x-vercel-ip-longitude') || ''

  // ── Build response with geo injected ─────────────────────────
  const response = NextResponse.next()

  // Inject geo into request headers for server components
  response.headers.set('x-geo-country', country.toUpperCase())
  response.headers.set('x-geo-city',    city)
  response.headers.set('x-geo-region',  region)
  response.headers.set('x-geo-lat',     lat)
  response.headers.set('x-geo-lon',     lon)

  // Persist country in cookie (30 days) — allows manual override
  const existingCountryCookie = request.cookies.get('nutrete_country')
  if (!existingCountryCookie) {
    response.cookies.set('nutrete_country', country.toUpperCase(), {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
  }

  // Session ID for analytics
  const sessionId = request.cookies.get('nutrete_session')?.value || generateSessionId()
  if (!request.cookies.get('nutrete_session')) {
    response.cookies.set('nutrete_session', sessionId, {
      maxAge: 60 * 60 * 24,  // 24h session
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
  }

  return response
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api routes that don't need geo (handled internally)
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
