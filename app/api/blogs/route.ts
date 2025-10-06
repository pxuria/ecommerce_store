export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, cachedData, cacheWithTTL, delCachedData, HttpError, toSlug } from '@/utils/helpers';

export const GET = async (req: Request) => asyncHandler(async () => {
    const cachedBlogs = await cachedData(redisKeys.blogs.all);
    if (cachedBlogs) return { data: JSON.parse(cachedBlogs) };

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);
    const skip = (page - 1) * limit;

    const blogs = await prisma.blog.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } });
    const total = await prisma.blog.count();

    await cacheWithTTL(redisKeys.blogs.all, JSON.stringify(blogs), 300);

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
    const { title, slug, content, coverImage, estimatedTimeToRead, metaTitle, metaDescription, metaKeywords, isPublished } = await req.json();
    if (!title || !slug || !content || !coverImage || !estimatedTimeToRead) throw new HttpError('some fields are required', 400);

    const blog = await prisma.blog.create({
        data: {
            title: title,
            slug: toSlug(slug),
            content: content,
            coverImage: coverImage,
            estimatedTimeToRead: estimatedTimeToRead,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            metaKeywords: metaKeywords,
            isPublished: isPublished ?? false
        }
    });

    await delCachedData(redisKeys.blogs.all);
    return { data: blog };
}, { successStatus: 201, auth: true });