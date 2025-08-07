import ConnectDB from "@/config/db";
import { isAdmin } from "@/lib/auth";
import Product from "@/models/Products.model";
import { NextResponse } from "next/server";

export const GET = async (
  _: Request,
  { params }: { params: { id: string } }
) => {
  await ConnectDB();
  try {
    const product = await Product.findById(params.id).populate("category");
    if (!product)
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, data: product },
      {
        status: 200,
      }
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedProduct)
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedProduct });
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct)
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
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
