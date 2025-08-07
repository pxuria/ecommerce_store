import { NextResponse } from "next/server";
import ConnectDB from "@/config/db";
import User from "@/models/User.model";
import { isAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

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

  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const { first_name, last_name, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error creating user", { status: 500 });
  }
}
