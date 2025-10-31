export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedPrefix } from '@/utils/serverCache';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const redisId = `${redisKeys.banners.byId}${id}`;

    const cachedBanner = await cachedData(redisId);
    if (cachedBanner) return { ...JSON.parse(cachedBanner) };

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new HttpError("banner not found", 404);

    await cacheWithTTL(redisId, JSON.stringify(banner), 300);
    return { data: banner };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const banner = await prisma.banner.update({ where: { id }, data });

    await delCachedPrefix(redisKeys.banners.base);
    return { data: banner };
}, { auth: true })

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.banner.delete({ where: { id } });
    await delCachedPrefix(redisKeys.banners.base);
    return { message: 'Banner deleted' };
}, { auth: true });