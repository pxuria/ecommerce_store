import ConnectDB from "@/config/db";
import { isAdmin } from "@/lib/auth";
import Category from "@/models/Category.model";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ConnectDB();
  try {
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const { id } = params;
    const { name, enName } = await req.json();

    if (!name || !enName) {
      return NextResponse.json(
        { message: "Category name and english name is required" },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, enName },
      { new: true }
    );
    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json("Error updating category", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const { id } = params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
