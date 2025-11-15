export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { asyncHandler, HttpError, parseFilters, toSlug } from '@/utils/helpers';

export const GET = async (req: Request) => asyncHandler(async () => {
    const filters = [{ name: "isPublished", type: "boolean" as const }];
    const { searchParams } = new URL(req.url);

    const { where, orderBy, page, limit, skip } = parseFilters(req.url, filters, {
        defaultSortBy: "id",
        defaultSortOrder: "asc",
        allowedSorts: {
            id: { id: "asc" },
            createdAt: { createdAt: "asc" }
        }
    });

    let search = searchParams.get("search")?.trim() || "";
    search = search.normalize("NFC").replace(/\u200c/g, "");

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } }
        ];
    }

    const blogs = await prisma.blog.findMany({ where, skip, take: limit, orderBy });
    // console.log('BLOGS', blogs)
    const total = await prisma.blog.count();

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

    return { data: blog };
}, { successStatus: 201, auth: true });