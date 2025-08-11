import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import ConnectDB from "@/config/db";
import User from "@/models/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        first_name: { label: "First Name", type: "text" },
        last_name: { label: "Last Name", type: "text" },
        phone: { label: "Phone", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await ConnectDB();
        if (!credentials?.email || !credentials?.password) {
          throw new Error("ایمیل و رمز عبور الزامی است");
        }

        try {
          let user = await User.findOne({
            email: credentials?.email,
          }).select("+password");

          if (!user) {
            user = await User.create({
              email: credentials?.email,
              first_name: credentials.first_name || "User",
              last_name: credentials.last_name || "User",
              password: credentials?.password,
            });
          } else {
            const isMatch = await user.comparePassword(credentials?.password);
            if (!isMatch) {
              throw new Error("Invalid email or password");
            }
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn() {
      try {
        await ConnectDB();

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (!token?.id) return session;

      await ConnectDB();
      const dbUser = await User.findById(token.id).lean();

      if (dbUser) {
        session.user = {
          id: dbUser._id.toString(),
          email: dbUser.email,
          first_name: dbUser.first_name,
          last_name: dbUser.last_name,
          role: dbUser.role,
        };
      }
      const payload = {
        id: dbUser._id.toString(),
        email: dbUser.email,
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        role: dbUser.role,
      };
      session.accessToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: "7d" });

      return session;

      // if (session.user && token.id) {
      //   session.user.id = token.id as string;
      //   session.user.first_name = token.first_name as string;
      //   session.user.last_name = token.last_name as string;
      //   session.user.role = token.role as string;
      // }

      // const payload = {
      //   id: token.id,
      //   email: token.email,
      //   first_name: token.first_name,
      //   last_name: token.last_name,
      //   role: token.role
      // };

      // const signedToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
      //   expiresIn: "7d",
      // });

      // session.accessToken = signedToken;
      // return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.first_name = token.first_name as string;
        token.last_name = token.last_name as string;
        token.role = user.role || "user";
      }

      if (!token.role) {
        await ConnectDB();
        const dbUser = await User.findById(token.id);
        token.role = dbUser?.role || "user";
      }

      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
