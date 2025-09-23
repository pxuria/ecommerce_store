export const runtime = 'nodejs';

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { asyncHandler, HttpError } from "@/utils/helpers";
import { authOptions } from "@/utils/authOptions";

export const GET = async () => asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new HttpError("ابتدا وارد حساب کاربری شوید", 401);

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            favorites: {
                include: {
                    images: true,
                    brand: true,
                    category: true,
                    country: true,
                    colorVariants: true
                },
            },
        },
    });

    if (!user) throw new HttpError("کاربر یافت نشد", 404);

    const withBasePrice = user.favorites.map(p => {
        const basePrice = Math.min(...p.colorVariants.map(cv => cv.pricePerMeter.toNumber()));
        const variant = p.colorVariants.find(cv => cv.pricePerMeter.toNumber() === basePrice);

        let finalPrice = basePrice;
        let discountPercent = 0;

        if (variant?.discountPercent) {
            discountPercent = variant.discountPercent.toNumber();
            finalPrice = Math.round(basePrice * (1 - discountPercent / 100));
        }

        return {
            ...p,
            basePrice,
            finalPrice,
            discountPercent,
        };
    });

    return { data: withBasePrice };
});

export const POST = async (req: Request) => asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new HttpError("ابتدا وارد حساب کاربری شوید", 401);

    const { productId } = await req.json();

    if (!productId) throw new HttpError("شناسه محصول الزامی است", 400);

    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            favorites: {
                connect: { id: productId },
            },
        },
        include: { favorites: true },
    });

    return { data: updatedUser.favorites };
});

export const DELETE = async (req: Request) => asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new HttpError("ابتدا وارد حساب کاربری شوید", 401);

    const { productId } = await req.json();

    if (!productId) throw new HttpError("شناسه محصول الزامی است", 400);

    const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
            favorites: {
                disconnect: { id: productId },
            },
        },
        include: { favorites: true },
    });

    return { data: updatedUser.favorites };
});