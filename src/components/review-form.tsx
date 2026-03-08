"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StarRatingInput } from "@/components/star-rating-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5, "Rating must be 5 or less"),
  text: z.string().optional(),
  setlistHighlights: z.string().optional(),
  attended: z.boolean().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  defaultValues?: Partial<ReviewFormValues>;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  submitLabel: string;
  isPending: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export function ReviewForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isPending,
  error,
  onCancel,
}: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: defaultValues?.rating ?? 0,
      text: defaultValues?.text ?? "",
      setlistHighlights: defaultValues?.setlistHighlights ?? "",
      attended: defaultValues?.attended ?? false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-200">Rating</FormLabel>
              <FormControl>
                <StarRatingInput
                  value={field.value}
                  onChange={field.onChange}
                  size="lg"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-200">Your Review</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Share your experience at this concert..."
                  disabled={isPending}
                  rows={5}
                  className="flex min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="setlistHighlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-200">Setlist Highlights</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Any standout songs or moments from the setlist?"
                  disabled={isPending}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attended"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 cursor-pointer"
                />
              </FormControl>
              <FormLabel className="text-purple-200 font-normal cursor-pointer">
                I attended this concert
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 shadow-lg shadow-purple-500/25 transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
