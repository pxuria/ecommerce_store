import { NextResponse } from "next/server";
import ZarinPal from "zarinpal-node-sdk";
import mongoose from "mongoose";
import Product from "@/models/Products.model";
import Order from "@/models/Order.model";
import { IColor, IOrder, ISize } from "@/types";

const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHANT_ID! as string,
  sandbox: true,
  //   accessToken: process.env.ZARINPAL_ACESS_TOKEN,
});

async function updateOrderStatus(order: IOrder, status: "paid" | "failed") {
  order.status = status;
  await order.save();
}

export async function POST(req: Request) {
  const session = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const { authority, status, orderId } = await req.json();
    if (!authority || !status || !orderId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (status !== "OK") {
      await updateOrderStatus(order, "failed");
      return NextResponse.json(
        { success: false, message: "Transaction was cancelled or failed." },
        { status: 400 }
      );
    }

    const response = await zarinpal.verifications.verify({
      amount: order.totalPrice,
      authority,
    });

    if (response.data.code === 100) {
      await session.startTransaction();
      transactionStarted = true;

      // ✅ Payment is successful, now reduce stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        // Find color variant
        const colorVariant = product.colors.find(
          (c: IColor) => c.name === item.color
        );

        if (!colorVariant)
          throw new Error(
            `Color ${item.color} not found for ${item.productId}`
          );

        // Find size variant
        const sizeVariant = colorVariant.sizes.find(
          (s: ISize) => s.name === item.size
        );

        if (!sizeVariant)
          throw new Error(`Size ${item.size} not found for ${item.productId}`);

        // Reduce stock count
        if (sizeVariant.stockCount < item.quantity) {
          throw new Error(
            `Not enough stock for ${item.productId} (Color: ${item.color}, Size: ${item.size})`
          );
        }

        sizeVariant.stockCount -= item.quantity;
        product.markModified("colors");
        await product.save({ session });
      }

      await updateOrderStatus(order, "paid");
      await session.commitTransaction();

      return NextResponse.json(
        { success: true, ref_id: response.data.ref_id },
        { status: 200 }
      );
    } else {
      await updateOrderStatus(order, "failed");
      return NextResponse.json(
        {
          success: false,
          message: `Transaction failed with code: ${response.data.code}`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    if (transactionStarted) await session.abortTransaction();

    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
