export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { asyncHandler, HttpError } from '@/utils/helpers';

export const GET = async (req: Request) => asyncHandler(async () => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);

    const skip = (page - 1) * limit;

    const colors = await prisma.productColor.findMany({ skip, take: limit, orderBy: { id: 'asc' } });

    const total = await prisma.productColor.count();

    return {
        data: colors,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }
});


export const POST = async (request: Request) => asyncHandler(async () => {
    const { name, hex } = await request.json();
    if (!name) throw new HttpError('Color name is required', 400);
    const color = await prisma.productColor.create({ data: { name, hex: hex ?? null } });

    return { data: color };
}, { auth: true });