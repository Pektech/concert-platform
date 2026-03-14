export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import EditReviewForm from "./EditReviewForm";

interface EditReviewPageProps {
  params: { id: string };
}

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: {
      concert: true,
    },
  });

  if (!review) {
    redirect("/");
  }

  if (review.userId !== session.user.id) {
    redirect(`/concerts/${review.concertId}`);
  }

  return (
    <EditReviewForm
      review={{
        id: review.id,
        rating: review.rating,
        title: review.title,
        text: review.text,
        setlistHighlights: review.setlistHighlights,
        concertId: review.concertId,
      }}
    />
  );
}
