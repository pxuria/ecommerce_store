import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const credentialsSchema = z.object({
  phone: z.string().min(5),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Phone & Password',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        const parsed = credentialsSchema.safeParse(creds)
        if (!parsed.success) return null

        const phone = parsed.data.phone.trim()

        const user = await prisma.user.findUnique({
          where: { phone },
        })
        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        // remove password before returning
        const { password, ...userSafe } = user
        return userSafe
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // First login → attach full user
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        // expose whole user object
        session.user = token.user as any
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  }
}