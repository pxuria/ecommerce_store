export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { ParamsType } from '@/types';
import { asyncHandler, HttpError } from '@/utils/helpers';

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
    const category = await prisma.productCategory.findUnique({ where: { id: parseInt(params.id) } });
    if (!category) throw new HttpError("Category not found", 404);
    return { data: category };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
    const data = await req.json();
    const category = await prisma.productCategory.update({ where: { id: parseInt(params.id) }, data });
    return { data: category };
}, { auth: true });

export const DELETE = async (_req: Request, { params }: ParamsType) => asyncHandler(async () => {
    await prisma.productCategory.delete({ where: { id: parseInt(params.id) } });
    return { message: 'Category deleted' };
}, { auth: true });