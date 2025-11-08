export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, generateFilterKeyPart, generateOrderKeyPart, HttpError, parseFilters } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedPrefix } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const filters = [{ name: "isActive", type: "boolean" as const }];

    const { where, orderBy, page, limit, skip } = parseFilters(req.url, filters, {
        defaultSortBy: "displayOrder",
        defaultSortOrder: "asc",
        allowedSorts: {
            displayOrder: { displayOrder: "asc" },
            createdAt: { createdAt: "asc" }
        }
    });

    const filterKeyPart = generateFilterKeyPart(where);
    const orderKeyPart = generateOrderKeyPart(orderBy);
    const cacheKey = `${redisKeys.banners.all}:page=${page}:limit=${limit}:${filterKeyPart}:${orderKeyPart}`;

    const cachedBanner = await cachedData(cacheKey);
    if (cachedBanner) return { ...JSON.parse(cachedBanner) };

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

    await delCachedPrefix(redisKeys.banners.base);
    return { data: banner };
}, { successStatus: 201, auth: true });