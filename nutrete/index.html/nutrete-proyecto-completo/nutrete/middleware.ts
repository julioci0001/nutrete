import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) return NextResponse.next()
  const country = (
    request.headers.get("x-vercel-ip-country") ||
    request.cookies.get("nutrete_country")?.value ||
    "AR"
  ).toUpperCase()
  const response = NextResponse.next()
  response.headers.set("x-geo-country", country)
  if (!request.cookies.get("nutrete_country")) {
    response.cookies.set("nutrete_country", country, { maxAge: 60*60*24*30, sameSite: "lax", path: "/" })
  }
  const sessionId = request.cookies.get("nutrete_session")?.value || `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
  if (!request.cookies.get("nutrete_session")) {
    response.cookies.set("nutrete_session", sessionId, { maxAge: 60*60*24, sameSite: "lax", path: "/" })
  }
  return response
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] }