export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, generateFilterKeyPart, generateOrderKeyPart, HttpError, parseFilters } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const filters = [
        { name: "name", type: "string" as const },
        { name: "hex", type: "string" as const }
    ];

    const { where, orderBy, page, limit, skip } = parseFilters(req.url, filters, {
        defaultSortBy: "name",
        defaultSortOrder: "asc",
        allowedSorts: {
            id: { id: "asc" },
            name: { name: "asc" }
        }
    });

    const filterKeyPart = generateFilterKeyPart(where);
    const orderKeyPart = generateOrderKeyPart(orderBy);
    const cacheKey = `${redisKeys.colors.all}:page=${page}:limit=${limit}:${filterKeyPart}:${orderKeyPart}`;

    const cachedColor = await cachedData(cacheKey);
    if (cachedColor) return { ...JSON.parse(cachedColor) };

    const colors = await prisma.productColor.findMany({ where, skip, take: limit, orderBy });
    const total = await prisma.productColor.count();

    await cacheWithTTL(cacheKey, JSON.stringify({
        data: colors,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }), 300);

    return {
        data: colors,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }
});


export const POST = async (request: Request) => asyncHandler(async () => {
    const { name, hex } = await request.json();
    if (!name) throw new HttpError('Color name is required', 400);
    const color = await prisma.productColor.create({ data: { name, hex: hex ?? null } });

    await delCachedData(redisKeys.colors.all);
    return { data: color };
}, { auth: true, successStatus: 201 });