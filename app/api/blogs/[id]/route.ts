export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const blog = await prisma.blog.findUnique({ where: { id: parseInt(params.id) } });
    if (!blog) throw new HttpError('Blog not found', 404);
    return { data: blog };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const body = await req.json();
    const brand = await prisma.blog.update({
        where: { id: parseInt(params.id) },
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
    await prisma.blog.delete({ where: { id: parseInt(params.id) } });
    return { message: 'Blog deleted' };
}, { auth: true });