export const runtime = 'nodejs';

import { prisma } from "@/lib/prisma";
import { asyncHandler, parseFilters } from "@/utils/helpers";

export const GET = async (req: Request) => asyncHandler(async () => {
  const filters = [
    { name: "firstName", type: "string" as const },
    { name: "lastName", type: "string" as const },
    { name: "email", type: "string" as const },
    { name: "phone", type: "string" as const },
    { name: "role", type: "string" as const },
    { name: "address", type: "string" as const },
    { name: "city", type: "string" as const },
    { name: "postalCode", type: "string" as const }
  ];

  const { where, orderBy, page, limit, skip } = parseFilters(req.url, filters, {
    defaultSortBy: "id",
    defaultSortOrder: "asc",
    allowedSorts: { id: { id: "asc" } }
  });

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy,
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