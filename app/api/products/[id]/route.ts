export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from "@/types";
import { asyncHandler, HttpError, parseId } from "@/utils/helpers";

const defaultIncludes = {
  images: true,
  attributes: true,
  colorVariants: { include: { color: true } },
  category: true,
  brand: true,
  country: true,
};

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const id = parseId(params);
  const product = await prisma.product.findUnique({ where: { id }, include: defaultIncludes });
  if (!product) throw new HttpError("Product not found", 404);
  return { data: product };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
  const id = parseId(params);
  const body = await req.json();

  await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      brandId: body.brandId ? Number(body.brandId) : undefined,
      countryId: body.countryId ? Number(body.countryId) : undefined,
      isActive: body.isActive,
    },
  });

  // Replace images (if provided)
  if (body.images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: body.images.map((url: string, index: number) => ({
        productId: id,
        url,
        alt: `${body.name}-${index + 1}`,
      })),
    });
  }

  // Replace attributes (if provided)
  if (body.attributes) {
    await prisma.productAttribute.deleteMany({ where: { productId: id } });
    await prisma.productAttribute.createMany({
      data: body.attributes.map((attr: { key: string; value: string }) => ({
        productId: id,
        ...attr,
      })),
    });
  }

  if (body.colorVariants) {
    await prisma.productColorVariant.deleteMany({ where: { productId: id } });
    await prisma.productColorVariant.createMany({
      data: body.colorVariants.map((cv: { colorId: string; pricePerMeter: number; discountPercent: number; stockMeters: number; }) => ({
        productId: id,
        colorId: Number(cv.colorId),
        pricePerMeter: cv.pricePerMeter,
        discountPercent: cv.discountPercent,
        stockMeters: cv.stockMeters,
      })),
    });
  }

  const updatedProduct = await prisma.product.findUnique({ where: { id }, include: defaultIncludes });
  if (!updatedProduct) throw new HttpError("Product not found", 404);
  return { data: updatedProduct };
}, { auth: true });

export const DELETE = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const id = parseId(params);
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date() }, });
  return { message: "Product deleted successfully" };
}, { auth: true });