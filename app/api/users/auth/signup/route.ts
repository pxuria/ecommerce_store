import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { first_name, last_name, phone, email, password } = await req.json();

        if (!first_name || !last_name || !email || !phone || !password)
            return NextResponse.json({ error: "اطلاعات ارسالی ناقص است." }, { status: 400 })

        const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } })
        if (existing) return NextResponse.json({ error: "اطلاعات وارد شده تکراری است." }, { status: 409 })

        const hashed = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                firstName: first_name,
                lastName: last_name,
                email,
                phone,
                password: hashed,
            },
        })

        return NextResponse.json({ success: true, user }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}