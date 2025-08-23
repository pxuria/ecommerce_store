import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth/next";

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return false;
  }

  return true;
}

export async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  return {
    id: session.user.id,
    role: session.user.role || "user",
  };
}
