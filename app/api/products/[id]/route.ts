export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from "@/types";
import { authOptions } from '@/utils/authOptions';
import { asyncHandler, HttpError, parseId } from "@/utils/helpers";
import { ProductColorVariant } from '@prisma/client';
import { getServerSession } from 'next-auth';

export const defaultIncludes = {
  images: true,
  attributes: true,
  colorVariants: { include: { color: true } },
  category: true,
  brand: true,
  country: true,
};

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  const id = parseId(params);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      ...defaultIncludes,
      favoredBy: session
        ? { where: { id: session.user.id }, select: { id: true } }
        : false,
    }
  });

  if (!product) throw new HttpError("Product not found", 404);

  const basePrice = Math.min(
    ...product.colorVariants.map((cv) => cv.pricePerMeter.toNumber())
  );
  const variant = product.colorVariants.find(
    (cv) => cv.pricePerMeter.toNumber() === basePrice
  );

  let finalPrice = basePrice;
  let discountPercent = 0;

  if (variant?.discountPercent) {
    discountPercent = variant.discountPercent.toNumber();
    finalPrice = Math.round(basePrice * (1 - discountPercent / 100));
  }
  return {
    data: {
      ...product,
      basePrice,
      finalPrice,
      discountPercent,
      isBookmarked: !!product.favoredBy?.length
    }
  };
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
    const existingVariants = await prisma.productColorVariant.findMany({
      where: { productId: id },
    });
    const incomingIds = body.colorVariants.map((cv: ProductColorVariant) => cv.id).filter(Boolean);

    const deletableVariants = existingVariants.filter(v =>
      !incomingIds.includes(v.id)
    );

    for (const v of deletableVariants) {
      // check if variant is used in any order
      const orderCount = await prisma.orderItem.count({
        where: { productColorVariantId: v.id },
      });
      if (orderCount === 0) {
        await prisma.productColorVariant.delete({ where: { id: v.id } });
      }
    }

    for (const cv of body.colorVariants) {
      const existingVariant = await prisma.productColorVariant.findFirst({
        where: {
          productId: id,
          colorId: Number(cv.colorId),
        },
      });

      if (existingVariant) {
        await prisma.productColorVariant.update({
          where: { id: existingVariant.id },
          data: {
            pricePerMeter: cv.pricePerMeter,
            discountPercent: cv.discountPercent,
            stockMeters: cv.stockMeters,
          },
        });
      } else {
        await prisma.productColorVariant.create({
          data: {
            productId: id,
            colorId: Number(cv.colorId),
            pricePerMeter: cv.pricePerMeter,
            discountPercent: cv.discountPercent,
            stockMeters: cv.stockMeters,
          },
        });
      }
    }
  }

  const updatedProduct = await prisma.product.findUnique({ where: { id }, include: defaultIncludes });
  if (!updatedProduct) throw new HttpError("Product not found", 404);
  return { data: updatedProduct };
}, { auth: true });

export const DELETE = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const id = parseId(params);
  await prisma.product.delete({ where: { id } });
  return { message: "Product deleted successfully" };
}, { auth: true });