export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 20);

        const skip = (page - 1) * limit;

        const blogs = await prisma.blog.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        });

        const total = await prisma.blog.count();

        return NextResponse.json({
            data: blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectDB();

    try {
        const { title, slug, content, coverImage, estimatedTimeToRead, metaTitle, metaDescription, metaKeywords, isPublished } = await req.json();

        if (!title || !slug || !content || !coverImage || !estimatedTimeToRead) {
            return NextResponse.json({ error: 'some fields are required' }, { status: 400 });
        }

        const blog = await prisma.blog.create({
            data: {
                title: title,
                slug: slug,
                content: content,
                coverImage: coverImage,
                estimatedTimeToRead: estimatedTimeToRead,
                metaTitle: metaTitle,
                metaDescription: metaDescription,
                metaKeywords: metaKeywords,
                isPublished: isPublished ?? false
            }
        });

        return NextResponse.json({ data: blog }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}