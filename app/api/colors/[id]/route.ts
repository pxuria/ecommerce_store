export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const color = await prisma.productColor.findUnique({ where: { id: parseInt(params.id) } });
    if (!color) throw new HttpError("Color not found", 404);
    return { data: color };
});


export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const data = await req.json();
    const color = await prisma.productColor.update({ where: { id: parseInt(params.id) }, data });
    return { data: color };
});

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    await prisma.productColor.delete({ where: { id: parseInt(params.id) } });
    return { message: 'Color deleted' };
});