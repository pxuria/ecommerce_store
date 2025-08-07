"use client";
import { SessionProvider } from "next-auth/react";
import { childrenProp } from "@/types";

const AuthProvider = ({ children }: childrenProp) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
