export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError, parseId } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const color = await prisma.productColor.findUnique({ where: { id } });
    if (!color) throw new HttpError("Color not found", 404);
    return { data: color };
});


export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    const data = await req.json();
    const color = await prisma.productColor.update({ where: { id }, data });
    return { data: color };
}, { auth: true });

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const id = parseId(params);
    await prisma.productColor.delete({ where: { id } });
    return { message: 'Color deleted' };
}, { auth: true });