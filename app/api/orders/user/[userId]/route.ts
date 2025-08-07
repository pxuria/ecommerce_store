import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import ConnectDB from "@/config/db";
import Order from "@/models/Order.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await ConnectDB();
    const { userId } = params;

    if (!userId || !Types.ObjectId.isValid(userId))
      return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
    
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return NextResponse.json(
        { message: "No orders found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error },
      { status: 500 }
    );
  }
}
