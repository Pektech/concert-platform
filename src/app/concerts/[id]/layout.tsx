import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concert Details",
  description: "View concert details, setlist, and reviews",
  openGraph: {
    title: "Concert Details | Concert Platform",
    description: "View concert details, setlist, and reviews",
  },
};

export default function ConcertDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
