import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname
  
  const isAuthPage = pathname === "/login"
  const isSignupPage = pathname === "/signup"
  const isConcertDetailPage = pathname.match(/^\/concerts\/[^/]+$/) !== null
  const isPublicPage = 
    pathname === "/" ||
    pathname.startsWith("/reviews") && !pathname.includes("/edit") ||
    isConcertDetailPage
  
  if (!session && !isAuthPage && !isSignupPage && !isPublicPage) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (session && (isAuthPage || isSignupPage)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: 'nodejs',
}
