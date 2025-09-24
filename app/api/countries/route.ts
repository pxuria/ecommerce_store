export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { asyncHandler, HttpError, toSlug } from '@/utils/helpers';

export const GET = async (req: Request) => asyncHandler(async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);

    const skip = (page - 1) * limit;

    const countries = await prisma.productCountry.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' }
    });

    const total = await prisma.productColor.count();

    return {
        data: countries,
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
    if (!name || !slug) throw new HttpError('country name or slug is required', 400);
    const country = await prisma.productCountry.create({ data: { name, slug: toSlug(slug) } });
    return { data: country };
}, { auth: true });