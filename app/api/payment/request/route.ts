import { NextResponse } from "next/server";
import ZarinPal from "zarinpal-node-sdk";
import Order from "@/models/Order.model";

const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHANT_ID! as string,
  sandbox: true,
  //   accessToken: process.env.ZARINPAL_ACESS_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { amount, mobile, email, orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Amount and Order ID are required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order || order.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid or already processed order." },
        { status: 400 }
      );
    }

    const response = await zarinpal.payments.create({
      amount,
      callback_url:
        `${process.env.ZARINPAL_CALLBACK_URL}?orderId=${orderId}` ||
        `http://localhost:3000/payment?orderId=${orderId}`,
      description: `Payment for order #${orderId}`,
      mobile,
      email,
    });

    if (!response.data?.authority) {
      console.error("ZarinPal payment creation failed:", response);
      return NextResponse.json(
        { error: "Invalid response from ZarinPal" },
        { status: 500 }
      );
    }

    const authority = response.data.authority;

    // Store authority in DB to prevent URL tampering
    order.paymentAuthority = authority;
    await order.save();

    const url = zarinpal.payments.getRedirectUrl(response.data?.authority);
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("ZarinPal Error:", error);

    return NextResponse.json(
      { error: "Payment request failed" },
      { status: 500 }
    );
  }
}
