export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, HttpError } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);
    const isActiveParam = searchParams.get("isActive");
    const displayOrderParam = searchParams.get("displayOrder") || null;

    const cacheKey = `${redisKeys.banners.all}:${page}:${limit}:${isActiveParam ?? "all"}:${displayOrderParam ?? ''}`;
    const cachedBanner = await cachedData(cacheKey);
    if (cachedBanner) return { ...JSON.parse(cachedBanner) };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (isActiveParam !== null) {
        where.isActive = isActiveParam === "true";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: Record<string, any> = [];
    if (displayOrderParam && ["asc", "desc"].includes(displayOrderParam)) {
        orderBy.push({ displayOrder: displayOrderParam });
    } else {
        orderBy.push({ id: "asc" });
    }

    const skip = (page - 1) * limit;
    const banners = await prisma.banner.findMany({
        where,
        skip,
        take: limit,
        orderBy
    });

    const total = await prisma.banner.count({ where });

    await cacheWithTTL(cacheKey, JSON.stringify({
        data: banners,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }), 300);

    return {
        data: banners,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
});

export const POST = async (request: Request) => asyncHandler(async () => {
    const { image, alt, displayOrder, isActive } = await request.json();
    if (!image || !alt?.trim() || displayOrder == null || isActive == null) throw new HttpError('some fields are required', 400);

    const banner = await prisma.banner.create({ data: { image, alt, displayOrder, isActive } });

    await delCachedData(redisKeys.banners.all);
    return { data: banner };
}, { successStatus: 201, auth: true });