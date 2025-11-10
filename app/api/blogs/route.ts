export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, generateFilterKeyPart, generateOrderKeyPart, HttpError, parseFilters, toSlug } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedPrefix } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const filters = [{ name: "isPublished", type: "boolean" as const }];

    const { where, orderBy, page, limit, skip } = parseFilters(req.url, filters, {
        defaultSortBy: "name",
        defaultSortOrder: "asc",
        allowedSorts: {
            id: { id: "asc" },
            createdAt: { createdAt: "asc" }
        }
    });

    console.log({ where, orderBy, page, limit, skip })

    const filterKeyPart = generateFilterKeyPart(where);
    const orderKeyPart = generateOrderKeyPart(orderBy);
    const cacheKey = `${redisKeys.blogs.all}:page=${page}:limit=${limit}:${filterKeyPart}:${orderKeyPart}`;

    console.log(cacheKey)
    const cachedBlogs = await cachedData(cacheKey);
    if (cachedBlogs) return { ...JSON.parse(cachedBlogs) };

    const blogs = await prisma.blog.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } });
    const total = await prisma.blog.count();

    await cacheWithTTL(cacheKey, JSON.stringify({
        data: blogs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }), 300);

    return {
        data: blogs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
});

export const POST = async (req: Request) => asyncHandler(async () => {
    const { title, content, coverImage, estimatedTimeToRead, metaTitle, metaDescription, metaKeywords, isPublished } = await req.json();
    if (!title || !content || !coverImage || !estimatedTimeToRead) throw new HttpError('some fields are required', 400);

    const slug = await toSlug(title, prisma.blog);
    const blog = await prisma.blog.create({
        data: {
            title,
            slug,
            content,
            coverImage,
            estimatedTimeToRead,
            metaTitle,
            metaDescription,
            metaKeywords,
            isPublished: isPublished ?? false
        }
    });

    await delCachedPrefix(redisKeys.blogs.base);
    return { data: blog };
}, { successStatus: 201, auth: true });