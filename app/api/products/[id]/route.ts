export const runtime = 'nodejs';

import prisma from '@/lib/db';
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
  return { data: product };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
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

  if (!updatedProduct) throw new HttpError('Product not found', 404);

  return { data: updatedProduct };
}, { auth: true });

export const DELETE = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  await prisma.product.delete({ where: { id: parseInt(params.id) } });
  return { message: "Product deleted successfully" };
}, { auth: true });