export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, HttpError, toSlug } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const cachedCategory = await cachedData(redisKeys.categories.all);
    if (cachedCategory) return { data: JSON.parse(cachedCategory) };

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);

    const skip = (page - 1) * limit;
    const categories = await prisma.productCategory.findMany({ skip, take: limit, orderBy: { id: 'asc' } });
    const total = await prisma.productCategory.count();

    await cacheWithTTL(redisKeys.categories.all, JSON.stringify({
        data: categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }), 300);

    return {
        data: categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
});

export const POST = async (req: Request) => asyncHandler(async () => {
    const { name, slug } = await req.json();
    if (!name || !slug) throw new HttpError('category name or slug is required', 400);

    const category = await prisma.productCategory.create({ data: { name, slug: toSlug(slug) } });

    await delCachedData(redisKeys.categories.all);
    return { data: category }
}, { auth: true, successStatus: 201 });