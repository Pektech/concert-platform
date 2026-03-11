"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function login(formData: FormData) {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Invalid credentials",
      }
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    })

    return { success: true }
  } catch (error) {
    // Re-throw redirect errors so Next.js can handle the navigation
    if (isRedirectError(error)) {
      throw error
    }

    if (error instanceof AuthError) {
      return {
        error: "Invalid credentials",
      }
    }

    return {
      error: "An error occurred. Please try again.",
    }
  }
}
