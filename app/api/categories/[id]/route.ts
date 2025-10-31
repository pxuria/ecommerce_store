export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedPrefix } from '@/utils/serverCache';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const redisId = `${redisKeys.categories.byId}${id}`;

    const cachedCategory = await cachedData(redisId);
    if (cachedCategory) return { ...JSON.parse(cachedCategory) };

    const category = await prisma.productCategory.findUnique({ where: { id } });
    if (!category) throw new HttpError("Category not found", 404);

    await cacheWithTTL(redisId, JSON.stringify(category), 300);
    return { data: category };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const category = await prisma.productCategory.update({ where: { id }, data });

    await delCachedPrefix(redisKeys.categories.base);
    return { data: category };
}, { auth: true });

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productCategory.delete({ where: { id } });

    await delCachedPrefix(redisKeys.categories.base);
    return { message: 'Category deleted' };
}, { auth: true });