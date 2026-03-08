"use client"

import { useSession } from "@/components/auth-provider"
import { ReactNode } from "react"

/**
 * ProtectedRoute component for client-side route protection
 * Shows loading state during session check
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useSession({ redirectToLogin: true })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
