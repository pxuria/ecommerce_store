export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, cachedData, cacheWithTTL, delCachedData, HttpError, parseId } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const redisId = `${redisKeys.brands.byId}${id}`;

    const cachedBrand = await cachedData(redisId);
    if (cachedBrand) return { data: JSON.parse(cachedBrand) };

    const brand = await prisma.productBrand.findUnique({ where: { id } });
    if (!brand) throw new HttpError("Brand not found", 404);

    await cacheWithTTL(redisId, JSON.stringify(brand), 300);
    return { data: brand };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const brand = await prisma.productBrand.update({ where: { id }, data });

    await delCachedData(`${redisKeys.brands.byId}${id}`);
    await delCachedData(redisKeys.brands.all);
    return { data: brand };
}, { auth: true })

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productBrand.delete({ where: { id } });
    await delCachedData(`${redisKeys.brands.byId}${id}`);
    await delCachedData(redisKeys.brands.all);
    return { message: 'Brand deleted' };
}, { auth: true });