"use client"

import { useState } from "react"
import { UserPlus, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FollowButtonProps {
  userId: string
  initialFollowing: boolean
  currentUserId?: string
  isOwnProfile?: boolean
  onFollowToggle?: (following: boolean) => void
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline"
}

export function FollowButton({
  userId,
  initialFollowing,
  currentUserId,
  isOwnProfile,
  onFollowToggle,
  size = "default",
  variant = "default"
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isPending, setIsPending] = useState(false)

  if (isOwnProfile) return null

  if (!currentUserId) {
    return (
      <Button variant={variant} size={size} onClick={() => window.location.href = "/login"}>
        <UserPlus className="w-4 h-4 mr-1.5" />
        Follow
      </Button>
    )
  }

  const handleToggle = async () => {
    setIsPending(true)

    try {
      const response = await fetch(`/api/users/${userId}/follow`, { method: "POST" })

      if (!response.ok) {
        throw new Error("Failed to toggle follow")
      }

      const data = await response.json()
      setIsFollowing(data.following)
      onFollowToggle?.(data.following)
    } catch (error) {
      console.error("Follow toggle failed:", error)
      toast.error("Failed to update follow. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? "secondary" : variant}
      size={size}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "gap-1.5 min-w-[100px]",
        isFollowing && "group hover:bg-rose-500/10 hover:text-rose-500"
      )}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  )
}