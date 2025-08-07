import { NextResponse } from "next/server";
import Product from "@/models/Products.model";
import ConnectDB from "@/config/db";

export async function GET() {
  try {
    await ConnectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(12)
      .select("name image basePrice colors createdAt")
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
