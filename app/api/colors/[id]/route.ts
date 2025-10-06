export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, cachedData, cacheWithTTL, delCachedData, HttpError, parseId } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const redisId = `${redisKeys.colors.byId}${id}`;

    const cachedColor = await cachedData(redisId);
    if (cachedColor) return { data: JSON.parse(cachedColor) };

    const color = await prisma.productColor.findUnique({ where: { id } });
    if (!color) throw new HttpError("Color not found", 404);

    await cacheWithTTL(redisId, JSON.stringify(color), 300);
    return { data: color };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const color = await prisma.productColor.update({ where: { id }, data });

    await delCachedData(`${redisKeys.colors.byId}${id}`);
    await delCachedData(redisKeys.colors.all);
    return { data: color };
}, { auth: true });

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productColor.delete({ where: { id } });
    await delCachedData(`${redisKeys.colors.byId}${id}`);
    await delCachedData(redisKeys.colors.all);
    return { message: 'Color deleted' };
}, { auth: true });