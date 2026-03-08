"use client"

import { SessionProvider, useSession as useNextAuthSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

/**
 * AuthProvider wrapper for client components
 * Must wrap the app in layout.tsx to make session available
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

/**
 * useSession hook with authentication redirect
 * Returns session data and loading state
 * Redirects to login when not authenticated (optional)
 */
export function useSession({ redirectToLogin = false }: { redirectToLogin?: boolean } = {}) {
  const { data: session, status, update } = useNextAuthSession()
  const router = useRouter()

  useEffect(() => {
    if (redirectToLogin && status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, redirectToLogin, router])

  return {
    session,
    status,
    update,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  }
}
