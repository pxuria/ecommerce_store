import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/config/db";
import Order from "@/models/Order.model";
import Product from "@/models/Products.model";
import Category from "@/models/Category.model";

// Get Single Order by ID (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await ConnectDB();
    const { orderId } = params;

    const order = await Order.findById(orderId)
      .populate({
        path: "items.product",
        model: Product,
        populate: {
          path: "category",
          model: Category,
          select: "name",
        },
      })
      .lean();

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch order", error },
      { status: 500 }
    );
  }
}

// Update Order Status (PUT)
export async function PUT(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    await ConnectDB();
    const { orderId } = params;
    const updates = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update order status", error },
      { status: 500 }
    );
  }
}

// Delete an Order (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await ConnectDB();
    const { orderId } = params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete order", error },
      { status: 500 }
    );
  }
}
