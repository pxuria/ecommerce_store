export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new HttpError('Blog not found', 404);
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
    return { data: brand };
}, { auth: true });

export const DELETE = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted' };
}, { auth: true });