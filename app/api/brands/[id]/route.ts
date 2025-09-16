export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const brand = await prisma.productBrand.findUnique({ where: { id } });
    if (!brand) throw new HttpError("Brand not found", 404);
    return { data: brand };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const brand = await prisma.productBrand.update({ where: { id }, data });
    return { data: brand };
}, { auth: true })

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productBrand.delete({ where: { id } });
    return { message: 'Brand deleted' };
}, { auth: true });