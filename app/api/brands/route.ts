export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { asyncHandler, HttpError, toSlug } from '@/utils/helpers';

export const GET = async (req: Request) => asyncHandler(async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);

    const skip = (page - 1) * limit;
    const brands = await prisma.productBrand.findMany({ skip, take: limit, orderBy: { id: 'asc' } });

    const total = await prisma.productBrand.count();

    return {
        data: brands,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
});

export const POST = async (request: Request) => asyncHandler(async () => {
    const { name, slug } = await request.json();
    if (!name || !slug) throw new HttpError('brand name or slug is required', 400);

    const brand = await prisma.productBrand.create({ data: { name, slug: toSlug(slug) } });
    return { data: brand };
}, { successStatus: 201, auth: true });