export const runtime = 'nodejs';

import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/utils/helpers";

export const GET = async (req: Request) => asyncHandler(async () => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 20);
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  const total = await prisma.productColor.count();

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
}, { auth: true });