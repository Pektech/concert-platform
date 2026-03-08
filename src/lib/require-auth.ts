import { getServerSession } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Require authentication in a server component
 * Redirects to login page if not authenticated
 * 
 * @param callbackUrl - The URL to redirect back to after login (defaults to current path)
 */
export async function requireAuth(callbackUrl?: string) {
  const session = await getServerSession()

  if (!session?.user) {
    const loginUrl = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"
    redirect(loginUrl)
  }

  return session
}
