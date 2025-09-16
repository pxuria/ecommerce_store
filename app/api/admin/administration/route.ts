import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { asyncHandler, HttpError } from "@/utils/helpers";

export const PUT = async (req: Request) => asyncHandler(async () => {
    const { userId } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) throw new HttpError("کاربر یافت نشد", 404);
    const newRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;

    const updatedUser = await prisma.user.update({ where: { id: userId }, data: { role: newRole } });

    return { message: `User role updated to ${newRole}`, user: updatedUser };
});
