import ConnectDB from "@/config/db";
import { isAdmin } from "@/lib/auth";
import Category from "@/models/Category.model";
import { NextResponse } from "next/server";

export async function GET() {
  await ConnectDB();

  try {
    const categories = await Category.find({});
    return NextResponse.json(
      { length: categories.length, categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const { name, enName } = await request.json();

    if (!name || !enName) {
      return NextResponse.json(
        { message: "Category name and english name is required" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({ enName });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 400 }
      );
    }

    const category = await Category.create({ name, enName });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error creating user", { status: 500 });
  }
}
