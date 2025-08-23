import { NextResponse } from "next/server";
import ConnectDB from "@/config/db";
import User from "@/models/User.model";
import { isAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await ConnectDB();

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }
}

export async function POST(req: Request) {
  await ConnectDB();

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
