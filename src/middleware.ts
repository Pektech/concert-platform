import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * Middleware to protect routes requiring authentication
 * Redirects unauthenticated users to /login
 */
export async function middleware(request: NextRequest) {
  const session = await auth()
  const isAuthPage = request.nextUrl.pathname === "/login"
  const isSignupPage = request.nextUrl.pathname === "/signup"

  // If not authenticated and trying to access protected route
  if (!session && !isAuthPage && !isSignupPage) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access login/signup, redirect to home
  if (session && (isAuthPage || isSignupPage)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (root level)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  runtime: 'nodejs', // Use Node.js runtime to avoid Edge Function size limit
}
