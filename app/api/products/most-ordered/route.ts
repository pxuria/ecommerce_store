import prisma from '@/lib/db';
import { authOptions } from '@/utils/authOptions';
import { asyncHandler, attachBaseProductData } from "@/utils/helpers";
import { getServerSession } from 'next-auth';

export const GET = async () => asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    const orderedProducts = await prisma.orderItem.groupBy({
        by: ["productColorVariantId"],
        _sum: {
            quantity: true,
        },
    });

    const productTotals: Record<number, number> = {};
    const variantIds = orderedProducts.map(o => o.productColorVariantId);

    const variants = await prisma.productColorVariant.findMany({
        where: { id: { in: variantIds } },
        select: { id: true, productId: true },
    });

    for (const item of orderedProducts) {
        const variant = variants.find(v => v.id === item.productColorVariantId);
        if (!variant) continue;
        productTotals[variant.productId] =
            (productTotals[variant.productId] ?? 0) + Number(item._sum.quantity ?? 0);
    }

    const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            images: true,
            brand: true,
            category: true,
            country: true,
            colorVariants: true,
        },
    });

    const attachedData = attachBaseProductData(products, session);

    const sortedProducts = attachedData
        .map(p => ({ ...p, totalOrdered: productTotals[p.id] ?? 0 }))
        .sort((a, b) => b.totalOrdered - a.totalOrdered)
        .slice(0, 16);

    return { data: sortedProducts };
});