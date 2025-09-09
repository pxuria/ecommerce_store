import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import prisma, { connectDB } from '@/lib/db';

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);
    const skip = (page - 1) * limit;

    const filters = {};

    if (searchParams.get("category")) filters.category = Number(searchParams.get("category")?.trim());
    if (searchParams.get("brand")) filters.brand = Number(searchParams.get("brand"));
    if (searchParams.get("name")) {
      filters.name = {
        contains: searchParams.get("name") || "",
        mode: "insensitive",
      };
    }
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const stock = searchParams.get("stock");
    const colorId = searchParams.get("colorId");

    const where = {
      ...filters,
      colorVariants: {
        some: {
          ...(minPrice ? { pricePerMeter: { gte: Number(minPrice) } } : {}),
          ...(maxPrice ? { pricePerMeter: { lte: Number(maxPrice) } } : {}),
          ...(stock ? { stockMeters: { gte: Number(stock) } } : {}),
          ...(colorId ? { colorId: Number(colorId) } : {}),
        },
      },
    };

    // const searchQuery = (searchParams.get("search") || "").trim();
    // const stockQuery = (searchParams.get("stock") || "").trim();
    // const categoryQuery = (searchParams.get("category") || "").trim();
    // const brandQuery = (searchParams.get("category") || "").trim();
    // const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    // const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000000");


    // const filter: ProductFilter = {};

    // if (searchQuery) filter.name = { $regex: searchQuery, $options: "i" };
    // if (stockQuery) filter.stock = stockQuery;
    // if (brandQuery) filter.brand = brandQuery;

    // if (categoryQuery) {
    //   const category = await Category.findOne({
    //     name: decodeURIComponent(categoryQuery),
    //   });

    //   if (category) {
    //     console.log("Categoty :" + category);
    //     filter.category = new Types.ObjectId(category._id).toHexString();
    //   } else {
    //     return NextResponse.json(
    //       {
    //         success: true,
    //         message: "no product found",
    //         pagination: {
    //           totalProducts: 0,
    //           totalPages: 0,
    //           currentPage: page,
    //         },
    //       },
    //       { status: 404 }
    //     );
    //   }
    // }

    // if (minPrice >= 0 || maxPrice >= 0) {
    //   filter.basePrice = {};
    //   if (minPrice >= 0) filter.basePrice.$gte = minPrice;
    //   if (maxPrice >= 0) filter.basePrice.$lte = maxPrice;
    // }

    // console.log("FILTER :", filter);
    // const totalProducts = await Product.countDocuments(filter);
    // const products = await Product.find(filter)
    //   .populate("category")
    //   .skip((page - 1) * limit)
    //   .limit(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          country: true,
          images: true,
          attributes: true,
          colorVariants: {
            include: {
              color: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        data: products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
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
  await connectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
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
          create: body.colorVariants?.map((cv: { colorId: string; pricePerMeter: number; discountPercent: number; stockMeters: number }) => ({
            colorId: parseInt(cv.colorId),
            pricePerMeter: cv.pricePerMeter,
            discountPercent: cv.discountPercent,
            stockMeters: cv.stockMeters,
          })),
        },
      },
    });

    // const product = await Product.create(body);
    return NextResponse.json({ data: product }, { status: 201 });
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
