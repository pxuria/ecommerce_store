export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { asyncHandler, HttpError } from "@/utils/helpers";
import { ParamsType } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { UserRole } from "@prisma/client";

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new HttpError('Unauthorized', 401);

  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      items: {
        include: {
          productColorVariant: {
            include: { product: true, color: true },
          },
        },
      },
    },
  });

  if (!order) throw new HttpError('Order not found', 404);

  // Users can only see their own orders
  if (session.user.role !== UserRole.ADMIN && order.userId !== session.user.id) throw new HttpError('Forbidden', 403);

  return { data: order };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) throw new HttpError('Unauthorized', 401);

  const { status } = await req.json();

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status }
  });

  return { data: order };
});

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new HttpError('Unauthorized', 401);

  const order = await prisma.order.findUnique({ where: { id: Number(params.id) } });
  if (!order) throw new HttpError('order not found', 404);

  if (session.user.role !== UserRole.ADMIN && order.userId !== session.user.id) throw new HttpError('Forbidden', 403);

  const canceledOrder = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status: "CANCELED" }
  });

  return { data: canceledOrder };
});