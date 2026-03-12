"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { LikeButton } from "@/components/like-button"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

interface Review {
  id: string
  rating: number
  title: string | null
  text: string | null
  setlistHighlights: string | null
  createdAt: string | Date
  user: {
    id: string
    name: string | null
  }
  likeCount?: number
  isLikedByUser?: boolean
}

interface ReviewCardProps {
  review: Review
  currentUserId?: string
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
}

function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function ReviewCard({ review, currentUserId, onEdit, onDelete }: ReviewCardProps) {
  const isOwner = currentUserId === review.user.id
  const hasHighlights = review.setlistHighlights && review.setlistHighlights.trim() !== ""

  return (
    <Card className="group/review relative overflow-hidden border-l-4 border-l-primary/30 hover:border-l-primary transition-colors duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground font-medium">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.title && (
              <p className="text-base font-semibold text-foreground mb-1">
                {review.title}
              </p>
            )}
            <Link
              href={`/profile/${review.user.id}`}
              className="text-sm font-semibold text-foreground truncate hover:text-purple-400 transition-colors inline-block"
            >
              {review.user.name || "Anonymous"}
            </Link>
          </div>

          {isOwner && (onEdit || onDelete) && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover/review:opacity-100 transition-opacity duration-200">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                  onClick={() => onEdit(review.id)}
                  aria-label="Edit review"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(review.id)}
                  aria-label="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {review.text && review.text.trim() !== "" && (
          <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
        )}

        {hasHighlights && (
          <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-lg p-3 border border-indigo-500/20">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wide">
              Setlist Highlights
            </p>
            <div className="text-sm text-indigo-900 dark:text-indigo-200 whitespace-pre-wrap leading-relaxed">
              {review.setlistHighlights}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3">
        <div className="w-full flex items-center justify-between">
          <LikeButton
            reviewId={review.id}
            initialLiked={review.isLikedByUser ?? false}
            initialCount={review.likeCount ?? 0}
            currentUserId={currentUserId}
          />
          <span className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
