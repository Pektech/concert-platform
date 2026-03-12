"use client"

import { useState } from "react"
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

export function LikeButton({
  reviewId,
  initialLiked,
  initialCount,
  currentUserId,
  showCount = true,
  className
}: LikeButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)

  if (!currentUserId) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex items-center gap-1 text-muted-foreground", className)}
        onClick={() => window.location.href = "/login"}
      >
        <Heart className="w-4 h-4" />
        {showCount && <span className="text-xs font-medium">{count}</span>}
      </Button>
    )
  }

  const handleToggle = async () => {
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(prev => newLiked ? prev + 1 : prev - 1);
    setIsPending(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, { method: "POST" })
      if (!response.ok) {
        // Rollback on failure
        setLiked(!newLiked);
        setCount(prev => !newLiked ? prev + 1 : prev - 1);
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
        liked
          ? "text-rose-500 hover:text-rose-600"
          : "text-muted-foreground hover:text-rose-500",
        className
      )}
      onClick={handleToggle}
      disabled={isPending}
      title={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all duration-200",
          liked && "fill-current scale-110"
        )}
      />
      {showCount && (
        <span className="text-xs font-medium tabular-nums">
          {count}
        </span>
      )}
    </Button>
  )
}
