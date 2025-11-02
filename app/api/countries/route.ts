export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, generateFilterKeyPart, generateOrderKeyPart, HttpError, parseFilters, toSlug } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

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
    console.log(filterKeyPart)
    const orderKeyPart = generateOrderKeyPart(orderBy);
    const cacheKey = `${redisKeys.countries.all}:page=${page}:limit=${limit}:${filterKeyPart}:${orderKeyPart}`;

    const cachedCountries = await cachedData(cacheKey);
    if (cachedCountries) return { ...JSON.parse(cachedCountries) };

    const countries = await prisma.productCountry.findMany({
        where,
        skip,
        take: limit,
        orderBy
    });

    const total = await prisma.productColor.count();

    await cacheWithTTL(cacheKey, JSON.stringify({
        data: countries,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }), 300);

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

    await delCachedData(redisKeys.countries.all);
    return { data: country };
}, { auth: true, successStatus: 201 });