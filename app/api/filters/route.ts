export const runtime = 'nodejs';

import prisma from '@/lib/db';
import { asyncHandler } from '@/utils/helpers';

export const GET = async () => asyncHandler(async () => {
    const [brands, categories, countries, colors] = await Promise.all([
        prisma.productBrand.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { id: "asc" }
        }),
        prisma.productCategory.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { id: "asc" }
        }),
        prisma.productCountry.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { id: "asc" }
        }),
        prisma.productColor.findMany({
            select: { id: true, name: true, hex: true },
            orderBy: { id: "asc" }
        })
    ]);

    return { brands, categories, countries, colors };
});