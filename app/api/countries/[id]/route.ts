export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const country = await prisma.productCountry.findUnique({ where: { id: parseInt(params.id) } });
    if (!country) throw new HttpError("Country not found", 404);
    return { data: country };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const data = await req.json();
    const country = await prisma.productCountry.update({ where: { id: parseInt(params.id) }, data });
    return { data: country };
});

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    await prisma.productCountry.delete({ where: { id: parseInt(params.id) } });
    return { message: 'Country deleted' };
});