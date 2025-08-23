import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ message: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });

    const id = parseInt(params.id);

    if (authUser.id !== id && authUser.role !== "ADMIN")
      return NextResponse.json({ message: "شما دسترسی به این کاربر ندارید" }, { status: 403 });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        city: true,
        postalCode: true,
        createdAt: true
      }
    });

    if (!user) return NextResponse.json({ message: "کاربر مورد نظر یافت نشد" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ message: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });

    const id = parseInt(params.id);

    if (authUser.id !== id && authUser.role !== "ADMIN")
      return NextResponse.json({ message: "شما اجازه ویرایش این کاربر را ندارید" }, { status: 403 });

    const { firstName, lastName, email, phone, password, role, address, city, postalCode } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (postalCode) updateData.postalCode = postalCode;

    if (role && authUser.role === "ADMIN") updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: "اطلاعات کاربر با موفقیت به‌روزرسانی شد", user }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ message: "ابتدا وارد حساب کاربری شوید" }, { status: 401 });


    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "تنها ادمین میتواند کاربر را حذف کند" },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json(
      { message: "کاربر با موفقیت حذف شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
