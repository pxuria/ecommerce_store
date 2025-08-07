import { NextResponse } from "next/server";
import Product from "@/models/Products.model";
import Order from "@/models/Order.model";
import ConnectDB from "@/config/db";

export async function GET() {
  try {
    await ConnectDB();

    const bestSelling = await Order.aggregate([
      { $unwind: "$items" }, // Split items array
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" }, // Sum sold quantities
        },
      },
      { $sort: { totalSold: -1 } }, // Sort by most sold
      { $limit: 10 }, // Limit results
    ]);

    const productIds = bestSelling.map((item) => item._id);

    const products = await Product.find({
      _id: { $in: productIds },
      stock: true,
    })
      .select("name image basePrice colors stock")
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
