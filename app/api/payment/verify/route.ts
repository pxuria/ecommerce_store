export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { zarinpal } from "@/utils/zarinpal";
import { asyncHandler, HttpError } from "@/utils/helpers";
import { OrderStatus } from '@prisma/client';

export const POST = async (req: Request) => asyncHandler(async () => {
  const { authority, status, orderId } = await req.json();
  if (!authority || !status || !orderId) throw new HttpError("Missing required parameters", 400);

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { items: true }
  });

  if (!order) throw new HttpError("Order not found", 404);
  if (order.trackId !== authority) throw new HttpError("Invalid payment authority", 400);

  if (status !== "OK") {
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: OrderStatus.CANCELED }
    });
    return { success: false, message: "Transaction was cancelled or failed." };
  }

  const response = await zarinpal.verifications.verify({
    amount: Number(order.totalAmount),
    authority,
  });

  if (response.data.code === 100) {
    const paidOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: OrderStatus.PAID, paymentRefId: response.data.ref_id },
      include: { items: true }
    });

    return {
      success: true,
      ref_id: response.data.ref_id,
      data: paidOrder,
    };
  } else {
    // 6. Payment failed
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: OrderStatus.CANCELED },
    });

    return {
      success: false,
      message: `Transaction failed with code: ${response.data.code}`,
    };
  }
});