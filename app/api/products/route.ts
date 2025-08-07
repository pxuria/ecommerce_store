import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Product from "@/models/Products.model";
import Category from "@/models/Category.model";
import ConnectDB from "@/config/db";
import { isAdmin } from "@/lib/auth";
import { ProductFilter } from "@/types";

export const GET = async (req: Request) => {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 12;
    const searchQuery = (searchParams.get("search") || "").trim();
    const stockQuery = (searchParams.get("stock") || "").trim();
    const categoryName = (searchParams.get("category") || "").trim();
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "20000000");

    const filter: ProductFilter = {};

    if (searchQuery) filter.name = { $regex: searchQuery, $options: "i" };

    if (stockQuery) filter.stock = stockQuery;

    if (categoryName) {
      const category = await Category.findOne({
        name: decodeURIComponent(categoryName),
      });

      if (category) {
        console.log("Categoty :" + category);
        filter.category = new Types.ObjectId(category._id).toHexString();
      } else {
        return NextResponse.json(
          {
            success: true,
            message: "no product found",
            pagination: {
              totalProducts: 0,
              totalPages: 0,
              currentPage: page,
            },
          },
          { status: 404 }
        );
      }
    }

    if (minPrice >= 0 || maxPrice >= 0) {
      filter.basePrice = {};
      if (minPrice >= 0) filter.basePrice.$gte = minPrice;
      if (maxPrice >= 0) filter.basePrice.$lte = maxPrice;
    }

    console.log("FILTER :", filter);
    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: {
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
};

export async function POST(req: Request) {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
