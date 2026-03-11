import { SignupForm } from "@/components/signup-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Concert Platform account",
  robots: {
    index: false,
  },
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <SignupForm />
    </div>
  )
}