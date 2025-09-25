import { NextResponse } from "next/server";
import mongoose from "mongoose";
// import Category from "@/models/Category.model";
// import Product from "@/models/Products.model";
// import Order from "@/models/Order.model";
import { isAdmin } from "@/lib/auth";
// import { IColor, ISize } from "@/types";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, items, totalPrice } = await req.json();

    if (
      !userId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalPrice <= 0
    ) {
      return NextResponse.json(
        { message: "id کاربر، آرایه آیتم ها، و مبلغ کل الزامی است." },
        { status: 400 }
      );
    }

    // const user = await User.findById(userId);
    // if (!user) {
    if (!true) {
      await session.abortTransaction();
      return NextResponse.json({ message: "کاربر یافت نشد." }, { status: 404 });
    }

    // const uniqueItems = Array.from(
    //   new Set(items.map((item) => item.productId))
    // ).map((productId) => items.find((item) => item.productId === productId));

    // const productIds = uniqueItems.map((item) => item.productId);
    // const products = await Product.find({ _id: { $in: productIds } });

    // Check if all products exist
    // if (products.length !== productIds.length) {
    //   await session.abortTransaction();
    //   return NextResponse.json(
    //     { message: "تعدادی از محصولات یافت نشد." },
    //     { status: 400 }
    //   );
    // }

    // Check stock availability
    // for (const item of items) {
    // const product = products.find((p) => p._id.toString() === item.productId);

    // if (!product || !product.colors || product.colors.length === 0) {
    //   await session.abortTransaction();
    //   return NextResponse.json(
    //     { message: `محصول ${item.name} یافت نشد.` },
    //     { status: 400 }
    //   );
    // }

    // Find the matching color
    // const colorVariant = product.colors.find(
    //   (c: IColor) => c.name === item.color
    // );
    // if (!colorVariant || !colorVariant.sizes) {
    //   await session.abortTransaction();
    //   return NextResponse.json(
    //     { message: `رنگ ${item.color} یافت نشد برای ${item.name}.` },
    //     { status: 400 }
    //   );
    // }

    // Find the matching size
    // const sizeVariant = colorVariant.sizes.find(
    //   (s: ISize) => s.name === item.size
    // );
    // if (!sizeVariant) {
    //   await session.abortTransaction();
    //   return NextResponse.json(
    //     { message: `سایز ${item.size} یافت نشد برای ${item.name}.` },
    //     { status: 400 }
    //   );
    // }

    // Check stock availability
    // if (sizeVariant.stockCount < item.quantity) {
    //   await session.abortTransaction();
    //   return NextResponse.json(
    //     {
    //       message: `موجودی کافی برای ${item.name} (رنگ: ${item.color}, سایز: ${item.size}) نیست. موجود: ${sizeVariant.stockCount}, درخواست شده: ${item.quantity}`,
    //     },
    //     { status: 400 }
    //   );
    // }
    // }

    // const newOrder = new Order({
    //   userId,
    //   items,
    //   totalPrice,
    // });
    // await newOrder.save({ session });
    console.log("NEW ORDER:", 1);

    await session.commitTransaction();
    return NextResponse.json(1, { status: 201 });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return NextResponse.json(
      { message: "شکست در ساخت سفارش جدید.", error },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

// 🟡 Get All Orders(GET)
export async function GET() {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json("Access denied: Unauthorized", { status: 403 });
    }

    // const orders = await Order.find({})
    //   .populate({
    //     path: "items.product",
    //     // model: Product,
    //     select: "name category image",
    //     populate: {
    //       path: "category",
    //       // model: Category,
    //       select: "name",
    //     },
    //   })
    //   .lean();

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error },
      { status: 500 }
    );
  }
}
