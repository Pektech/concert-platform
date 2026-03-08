"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating?: number
  size?: "sm" | "md" | "lg"
  className?: string
  interactive?: boolean
  onChange?: (value: number) => void
  disabled?: boolean
}

export function StarRating({
  rating = 0,
  size = "md",
  className,
  interactive = false,
  onChange,
  disabled = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const currentRating = interactive ? (hoverRating || rating) : rating
  const validRating = Math.min(5, Math.max(0, currentRating))

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  if (!interactive) {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              star <= validRating
                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                : "fill-gray-600 text-gray-600"
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={cn(
            "transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded",
            disabled && "cursor-not-allowed"
          )}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-all duration-200",
              star <= validRating
                ? "fill-yellow-400 text-yellow-400 drop-shadow-lg drop-shadow-yellow-500/50"
                : "fill-gray-600 text-gray-600"
            )}
          />
        </button>
      ))}
      {validRating > 0 && (
        <span className="ml-2 text-purple-300 font-medium animate-fade-in">
          {validRating} {validRating === 1 ? "star" : "stars"}
        </span>
      )}
    </div>
  )
}
