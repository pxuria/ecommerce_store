export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, generateFilterKeyPart, generateOrderKeyPart, HttpError, parseFilters, toSlug } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedPrefix } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const filters = [
        { name: "name", type: "string" as const },
        { name: "slug", type: "string" as const }
    ];

    const { where, orderBy, page, limit, skip } = parseFilters(req.url, filters, {
        defaultSortBy: "name",
        defaultSortOrder: "asc",
        allowedSorts: {
            id: { id: "asc" },
            name: { name: "asc" },
            slug: { slug: "asc" }
        }
    });

    const filterKeyPart = generateFilterKeyPart(where);
    const orderKeyPart = generateOrderKeyPart(orderBy);
    const cacheKey = `${redisKeys.categories.all}:page=${page}:limit=${limit}:${filterKeyPart}:${orderKeyPart}`;

    const cachedCategory = await cachedData(cacheKey);
    if (cachedCategory) return { ...JSON.parse(cachedCategory) };


    const categories = await prisma.productCategory.findMany({ where, skip, take: limit, orderBy });
    const total = await prisma.productCategory.count();

    await cacheWithTTL(cacheKey, JSON.stringify({
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

    await delCachedPrefix(redisKeys.categories.base);
    return { data: category }
}, { auth: true, successStatus: 201 });