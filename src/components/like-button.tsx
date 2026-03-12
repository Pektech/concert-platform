"use client"

import { useState, useOptimistic, startTransition } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface LikeButtonProps {
  reviewId: string
  initialLiked: boolean
  initialCount: number
  currentUserId?: string
  showCount?: boolean
  className?: string
}

type OptimisticState = {
  liked: boolean
  count: number
}

export function LikeButton({
  reviewId,
  initialLiked,
  initialCount,
  currentUserId,
  showCount = true,
  className
}: LikeButtonProps) {
  const [isPending, setIsPending] = useState(false)
  
  const [optimisticState, setOptimisticState] = useOptimistic<OptimisticState, boolean>(
    { liked: initialLiked, count: initialCount },
    (state, newLiked) => ({
      liked: newLiked,
      count: state.liked === newLiked ? state.count : newLiked ? state.count + 1 : state.count - 1
    })
  )

  if (!currentUserId) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex items-center gap-1 text-muted-foreground", className)}
        onClick={() => window.location.href = "/login"}
      >
        <Heart className="w-4 h-4" />
        {showCount && <span className="text-xs font-medium">{initialCount}</span>}
      </Button>
    )
  }

  const handleToggle = async () => {
    const newLiked = !optimisticState.liked
    startTransition(() => {
      setOptimisticState(newLiked)
    })
    setIsPending(true)

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, { method: "POST" })
      if (!response.ok) {
        // Rollback on failure
        startTransition(() => {
          setOptimisticState(!newLiked)
        })
        throw new Error("Failed to toggle like")
      }
    } catch (error) {
      console.error("Like toggle failed:", error)
      toast.error("Failed to update like. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center gap-1 transition-colors",
        optimisticState.liked
          ? "text-rose-500 hover:text-rose-600"
          : "text-muted-foreground hover:text-rose-500",
        className
      )}
      onClick={handleToggle}
      disabled={isPending}
      title={optimisticState.liked ? "Unlike" : "Like"}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all duration-200",
          optimisticState.liked && "fill-current scale-110"
        )}
      />
      {showCount && (
        <span className="text-xs font-medium tabular-nums">
          {optimisticState.count}
        </span>
      )}
    </Button>
  )
}
