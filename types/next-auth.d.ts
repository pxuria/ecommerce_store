import { DefaultSession } from "next-auth";
import { User } from '@prisma/client'

// Declare module to extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: Omit<User, 'password'> & DefaultSession['user']
  }
  interface JWT {
    user?: Omit<User, 'password'>
  }
}
