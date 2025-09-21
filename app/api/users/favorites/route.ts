export const runtime = 'nodejs';

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { asyncHandler, HttpError } from "@/utils/helpers";
import { authOptions } from "@/utils/authOptions";

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