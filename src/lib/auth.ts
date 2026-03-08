import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { z } from "zod"
import bcrypt from "bcrypt"
import { prisma } from "./prisma"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••"
        }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          throw new Error("Invalid credentials")
        }

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
})

/**
 * Get the current server session from request headers
 * Use in Server Components and Server Actions
 */
export { auth as getServerSession }
