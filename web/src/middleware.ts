import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname === "/" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const protectedPrefixes = [
          "/dashboard",
          "/configuracoes",
          "/produtos",
          "/acoes",
        ];
        if (protectedPrefixes.some(p => pathname.startsWith(p))) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/configuracoes/:path*",
    "/produtos/:path*",
    "/acoes/:path*",
  ],
};
