import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function PUT(req: Request) {
    try {
        const { userId } = await req.json();

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
        if (!user) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });

        const newRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;

        const updatedUser = await prisma.user.update({ where: { id: userId }, data: { role: newRole } });

        return NextResponse.json(
            { message: `User role updated to ${newRole}`, user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to promote user" },
            { status: 500 }
        );
    }
}
