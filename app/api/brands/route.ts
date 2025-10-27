export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, HttpError, toSlug } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const cachedBrand = await cachedData(redisKeys.brands.all);
    console.log('CACHEDBRAND::', cachedBrand)
    if (cachedBrand) return { ...JSON.parse(cachedBrand) };

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);

    const skip = (page - 1) * limit;
    const brands = await prisma.productBrand.findMany({ skip, take: limit, orderBy: { id: 'asc' } });
    const total = await prisma.productBrand.count();

    await cacheWithTTL(redisKeys.brands.all, JSON.stringify({
        data: brands,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }), 300);

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

    await delCachedData(redisKeys.brands.all);
    return { data: brand };
}, { successStatus: 201, auth: true });