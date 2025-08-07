import { DefaultSession } from "next-auth";

// Declare module to extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      email?: string | null;
      role: string;
      phone?: string;
    } & DefaultSession["user"]; // Merge with the default user properties
    accessToken: string;
  }
}
