export const runtime = 'nodejs';

import { asyncHandler, HttpError } from "@/utils/helpers";
import prisma from '@/lib/db';
import { zarinpal } from "@/utils/zarinpal";
import { OrderStatus } from "@prisma/client";

export const POST = async (req: Request) => asyncHandler(async () => {
  const { amount, mobile, email, orderId } = await req.json();
  if (!amount || !orderId) throw new HttpError("Amount and Order ID are required", 400);

  const order = await prisma.order.findUnique({ where: { id: Number(orderId) } });
  if (!order) throw new HttpError("Order not found", 404);
  if (order.status !== OrderStatus.PENDING) throw new HttpError("Invalid or already processed order", 400);

  const callbackUrl =
    process.env.ZARINPAL_CALLBACK_URL ??
    `http://localhost:3000/payment`;

  const response = await zarinpal.payments.create({
    amount: Number(amount),
    callback_url: `${callbackUrl}?orderId=${orderId}`,
    description: `Payment for order #${orderId}`,
    mobile,
    email
  });

  const authority = response.data?.authority;
  if (!authority) {
    console.error("ZarinPal payment creation failed:", response);
    throw new HttpError("Invalid response from ZarinPal", 500);
  }

  await prisma.order.update({
    where: { id: Number(orderId) },
    data: { trackId: authority },
  });

  const url = zarinpal.payments.getRedirectUrl(authority);
  return { data: url };
});
