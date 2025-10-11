export const runtime = 'nodejs';

import { redisKeys } from '@/constants/redis-keys';
import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';
import { cachedData, cacheWithTTL, delCachedData } from '@/utils/serverCache';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const redisId = `${redisKeys.countries.byId}${id}`;

    const cachedCountry = await cachedData(redisId);
    if (cachedCountry) return { ...JSON.parse(cachedCountry) };

    const country = await prisma.productCountry.findUnique({ where: { id } });
    if (!country) throw new HttpError("Country not found", 404);

    await cacheWithTTL(redisKeys.countries.all, JSON.stringify(country), 300);
    return { data: country };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const country = await prisma.productCountry.update({ where: { id }, data });

    await delCachedData(`${redisKeys.countries.byId}${id}`);
    await delCachedData(redisKeys.countries.all);
    return { data: country };
}, { auth: true });

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productCountry.delete({ where: { id } });

    await delCachedData(`${redisKeys.countries.byId}${id}`);
    await delCachedData(redisKeys.countries.all);
    return { message: 'Country deleted' };
}, { auth: true });