export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedPrefix } from '@/utils/serverCache';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const redisId = `${redisKeys.blogs.byId}${id}`;

    const cachedBlog = await cachedData(redisId);
    if (cachedBlog) return { ...JSON.parse(cachedBlog) };

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new HttpError('Blog not found', 404);

    await cacheWithTTL(redisId, JSON.stringify(blog), 300);

    return { data: blog };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const body = await req.json();

    const brand = await prisma.blog.update({
        where: { id },
        data: {
            title: body.title,
            slug: body.slug,
            content: body.content,
            coverImage: body.coverImage,
            estimatedTimeToRead: body.estimatedTimeToRead,
            metaTitle: body.metaTitle,
            metaDescription: body.metaDescription,
            metaKeywords: body.metaKeywords,
            isPublished: body.isPublished
        }
    });

    await delCachedPrefix(redisKeys.blogs.base);
    return { data: brand };
}, { auth: true });

export const DELETE = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.blog.delete({ where: { id } });
    await delCachedPrefix(redisKeys.blogs.base);
    return { message: 'Blog deleted' };
}, { auth: true });