import { NextRequest, NextResponse } from "next/server"

const protectedPrefixes = ["/dashboard", "/configuracoes", "/produtos", "/acoes", "/dividendos"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // NextAuth v5 seta "authjs.session-token" (dev) ou "__Secure-authjs.session-token" (prod)
  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token")

  if (pathname === "/" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (protectedPrefixes.some(p => pathname.startsWith(p)) && !hasSession) {
    return NextResponse.redirect(new URL("/", req.url))
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/configuracoes/:path*",
    "/produtos/:path*",
    "/acoes/:path*",
    "/dividendos/:path*",
  ],
}
