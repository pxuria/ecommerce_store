export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const country = await prisma.productCountry.findUnique({ where: { id } });
    if (!country) throw new HttpError("Country not found", 404);
    return { data: country };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const country = await prisma.productCountry.update({ where: { id }, data });
    return { data: country };
}, { auth: true });

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productCountry.delete({ where: { id } });
    return { message: 'Country deleted' };
}, { auth: true });