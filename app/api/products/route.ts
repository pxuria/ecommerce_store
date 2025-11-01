export const runtime = 'nodejs';

import { getServerSession } from 'next-auth';
import { asyncHandler, attachBaseProductData, toSlug } from "@/utils/helpers";
import { authOptions } from '@/utils/authOptions';
import prisma from '@/lib/db';

export const GET = async (req: Request) => asyncHandler(async () => {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 20);
  const skip = (page - 1) * limit;


  const name = searchParams.get('name')?.trim();
  const category = searchParams.get('category_name')?.trim();
  const brand = searchParams.get('brand_name')?.trim();
  const country = searchParams.get('country_name')?.trim();

  const isActive = searchParams.get('isActive') != null
    ? searchParams.get('isActive') === 'true'
    : undefined;

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("dir") === "asc" ? "asc" : "desc";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (category) where.category = { name: { contains: category, mode: 'insensitive' } };
  if (brand) where.brand = { name: { contains: brand, mode: 'insensitive' } };
  if (country) where.country = { name: { contains: country, mode: 'insensitive' } };
  if (isActive !== undefined) where.isActive = isActive;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: sortOrder };

  if (sortBy === "price" && sortOrder === "asc") {
    orderBy = { colorVariants: { _min: { pricePerMeter: "asc" } } };
  } else if (sortBy === "price" && sortOrder === "desc") {
    orderBy = { colorVariants: { _max: { pricePerMeter: "desc" } } };
  } else if (sortBy === "createdAt") {
    orderBy = { createdAt: sortOrder };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      orderBy,
      take: limit,
      include: {
        brand: true,
        category: true,
        country: true,
        images: true,
        attributes: true,
        colorVariants: { include: { color: true } },
        favoredBy:
          session?.user?.id
            ? { where: { id: Number(session.user.id) }, select: { id: true } }
            : false,
      }
    }),
    prisma.product.count({ where })
  ]);

  const attachedData = attachBaseProductData(products, session);

  // Apply price filtering after calculating final prices
  const filteredData = attachedData.filter(p => {
    if (minPrice && p.finalPrice < Number(minPrice)) return false;
    if (maxPrice && p.finalPrice > Number(maxPrice)) return false;
    return true;
  });

  // Adjust total count for price filtering
  const filteredTotal = (minPrice || maxPrice) ? filteredData.length : total;

  return {
    data: filteredData,
    pagination: {
      total: filteredTotal,
      page,
      limit,
      pages: Math.ceil(filteredTotal / limit),
    }
  };
});

export const POST = async (req: Request) => asyncHandler(async () => {
  const body = await req.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: toSlug(body.slug),
      description: body.description,
      categoryId: parseInt(body.categoryId),
      brandId: parseInt(body.brandId),
      countryId: parseInt(body.countryId),
      isActive: body.isActive ?? true,
      images: {
        create: body.images?.map((url: string, index: number) => ({
          url,
          alt: `${body.name}-${index + 1}`
        })),
      },
      attributes: {
        create: body.attributes?.map((attr: { key: string; value: string }) => ({
          key: attr.key,
          value: attr.value,
        }))
      },
      colorVariants: {
        create: body.colorVariants?.map((cv: { colorId: string; pricePerMeter: number; discountPercent: number; }) => ({
          colorId: parseInt(cv.colorId),
          pricePerMeter: cv.pricePerMeter,
          discountPercent: cv.discountPercent
        })),
      },
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

  return { data: product };
}, { auth: true, successStatus: 201 });