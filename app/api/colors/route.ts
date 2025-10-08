export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { asyncHandler, HttpError } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

export const GET = async (req: Request) => asyncHandler(async () => {
    const cachedColor = await cachedData(redisKeys.colors.all);
    if (cachedColor) return { data: JSON.parse(cachedColor) };

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 20);

    const skip = (page - 1) * limit;
    const colors = await prisma.productColor.findMany({ skip, take: limit, orderBy: { id: 'asc' } });
    const total = await prisma.productColor.count();

    await cacheWithTTL(redisKeys.colors.all, JSON.stringify(colors), 300);

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

    await delCachedData(redisKeys.colors.all);
    return { data: color };
}, { auth: true, successStatus: 201 });