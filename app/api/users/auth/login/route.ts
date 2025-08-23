import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { phone, password } = await req.json();

        if (!phone || !password) return NextResponse.json({ error: "تلفن همراه و رمز عبور الزامی است" }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return NextResponse.json({ error: "تلفن همراه و رمز عبور نامعتبر است" }, { status: 401 });

        const isValid = await compare(password, user.password);
        if (!isValid) return NextResponse.json({ error: "رمز عبور نامعتبر است" }, { status: 401 });

        return NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}