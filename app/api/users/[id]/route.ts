export const runtime = 'nodejs';

import { hash } from "bcryptjs";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { asyncHandler, HttpError } from "@/utils/helpers";
import { ParamsType } from "@/types";
import { UserRole } from "@prisma/client";

export const GET = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const authUser = await getAuthUser();
  if (!authUser) throw new HttpError("ابتدا وارد حساب کاربری شوید", 401);

  const id = parseInt(params.id);
  if (authUser.id !== id && authUser.role !== UserRole.ADMIN) throw new HttpError("شما دسترسی به این کاربر ندارید", 403);

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

  if (!user) throw new HttpError("کاربر مورد نظر یافت نشد", 404);
  return { data: user };
});

export const PUT = async (req: Request, { params }: ParamsType) => asyncHandler(async () => {
  const authUser = await getAuthUser();
  if (!authUser) throw new HttpError("ابتدا وارد حساب کاربری شوید", 401);

  const id = parseInt(params.id);
  if (authUser.id !== id && authUser.role !== "ADMIN") throw new HttpError("شما دسترسی به این کاربر ندارید", 403);

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

  if (role && authUser.role === UserRole.ADMIN) updateData.role = role;
  if (password) updateData.password = await hash(password, 12);

  const user = await prisma.user.update({
    where: { id },
    data: updateData
  });

  return { dara: user };
});

export const DELETE = async (_: Request, { params }: ParamsType) => asyncHandler(async () => {
  const authUser = await getAuthUser();
  if (!authUser) throw new HttpError("ابتدا وارد حساب کاربری شوید", 401);

  const id = parseInt(params.id);
  if (authUser.id !== id && authUser.role !== UserRole.ADMIN) throw new HttpError("شما دسترسی به این کاربر ندارید", 403);

  await prisma.user.delete({ where: { id: parseInt(params.id) } });
  return { message: "کاربر با موفقیت حذف شد" }
});