export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma, { connectDB } from '@/lib/db';
import { ParamsType } from '@/types';

export async function GET(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        const blog = await prisma.blog.findUnique({ where: { id: parseInt(params.id) } });
        if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        return NextResponse.json({ data: blog }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: ParamsType) {
    await connectDB();

    try {
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
                isPublished: body.isPublished,
            }
        });
        return NextResponse.json({ data: brand }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update blog" }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        await prisma.blog.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ data: true, message: 'Blog deleted' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
}