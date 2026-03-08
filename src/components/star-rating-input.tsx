"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function StarRatingInput({
  value,
  onChange,
  size = "lg",
  className,
  disabled = false,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered || value;
  const validRating = Math.min(5, Math.max(0, displayRating));

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= validRating;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
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
                isFilled
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-lg drop-shadow-yellow-500/50"
                  : "fill-gray-600 text-gray-600"
              )}
            />
          </button>
        );
      })}
      {validRating > 0 && (
        <span className="ml-2 text-purple-300 font-medium animate-fade-in">
          {validRating} {validRating === 1 ? "star" : "stars"}
        </span>
      )}
    </div>
  );
}
