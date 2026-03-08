"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { Pencil, Trash2 } from "lucide-react"

interface Review {
  id: string
  rating: number
  text: string | null
  setlistHighlights: string | null
  attended: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
  }
}

interface ReviewCardProps {
  review: Review
  currentUserId?: string
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
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
      {review.attended && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-emerald-500/10 to-transparent px-3 py-1.5">
            <Badge
              variant="secondary"
              className="bg-emerald-500/90 text-emerald-950 hover:bg-emerald-500/90 font-semibold text-xs shadow-sm"
            >
              ✓ Attended
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground font-medium">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {review.user.name || "Anonymous"}
            </p>
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

      <CardFooter className="pt-0">
        <div className="w-full h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      </CardFooter>
    </Card>
  )
}
