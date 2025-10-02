export const runtime = 'nodejs';

import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { OrderItem } from '@prisma/client';
import { authOptions } from '@/utils/authOptions';
import { asyncHandler, HttpError } from "@/utils/helpers";

export const GET = async (req: Request) => asyncHandler(async () => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 20);

  const skip = (page - 1) * limit;

  const orders = await prisma.order.findMany({
    skip,
    take: limit,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      items: {
        include: {
          productColorVariant: {
            include: {
              product: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.order.count();


  return {
    data: orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
}, { auth: true });

export const POST = async (req: Request) => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new HttpError('Unauthorized', 401);

  const userId = session.user.id;
  const { items, shippingAddress, city, postalCode, trackId } = await req.json();

  if (!items || items.length === 0) throw new HttpError('Order must contain items', 400);

  // Calculate totals
  let totalAmount = 0;
  const orderItemsData = items.map((item: OrderItem) => {
    const total = (Number(item.unitPrice) - (Number(item.discount) || 0)) * Number(item.quantity);
    totalAmount += total;
    return {
      productColorVariantId: item.productColorVariantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount || null,
      total,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId,
      trackId,
      shippingAddress,
      city,
      postalCode,
      totalAmount,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: {
        include: {
          productColorVariant: {
            include: { product: true, color: true },
          },
        },
      },
    },
  });

  return { data: order };
}, { successStatus: 201 });