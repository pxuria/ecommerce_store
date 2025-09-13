import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import prisma, { connectDB } from '@/lib/db';
import { ParamsType } from "@/types";
import { asyncHandler, HttpError } from "@/utils/helpers";

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      images: true,
      attributes: true,
      colorVariants: { include: { color: true } },
      category: true,
      brand: true,
      country: true,
    }
  });

  if (!product) throw new HttpError("Product not found", 404);
  return product;
});

export async function PUT(req: Request, { params }: ParamsType) {
  await connectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const body = await req.json();
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        categoryId: body.categoryId,
        brandId: body.brandId,
        countryId: body.countryId,
        isActive: body.isActive,

        images: body.images ? {
          deleteMany: {},
          create: body.images?.map((url: string, index: number) => ({
            url,
            alt: `${body.name}-${index + 1}`
          }))
        } : undefined,
        attributes: body.attributes ? {
          deleteMany: {},
          create: body.attributes?.map((attr: { key: string; value: string }) => ({
            key: attr.key,
            value: attr.value,
          }))
        } : undefined,
        colorVariants: body.colorVariants
          ? {
            deleteMany: {},
            create: body.colorVariants?.map((cv: { colorId: string; pricePerMeter: number; discountPercent: number; stockMeters: number }) => ({
              colorId: parseInt(cv.colorId),
              pricePerMeter: cv.pricePerMeter,
              discountPercent: cv.discountPercent,
              stockMeters: cv.stockMeters,
            }))
          }
          : undefined
      },
      include: {
        images: true,
        attributes: true,
        colorVariants: { include: { color: true } },
        category: true,
        brand: true,
        country: true,
      }
    });

    if (!updatedProduct) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ data: updatedProduct });
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

export async function DELETE(req: Request, { params }: ParamsType) {
  await connectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    await prisma.product.delete({ where: { id: parseInt(params.id) } });

    return NextResponse.json({ message: "Product deleted successfully" });
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
