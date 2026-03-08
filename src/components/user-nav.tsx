"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UserNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return null
  }

  if (!session) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/login")}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/profile">
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
        >
          Profile
        </Button>
      </Link>
      <span className="text-sm text-muted-foreground">
        {session.user?.name || session.user?.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </div>
  )
}
