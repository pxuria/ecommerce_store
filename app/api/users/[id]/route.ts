import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import ConnectDB from "@/config/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User.model";
import { IUser } from "@/types";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await ConnectDB();

  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (authUser.id !== Number(params.id) && authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

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
  await ConnectDB();

  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const updateFields = await req.json();

    if (authUser.id !== Number(params.id) && authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const allowedFields: (keyof IUser)[] = [
      "email",
      "first_name",
      "last_name",
      "phone",
      "password",
      "bookmarks",
      "address",
      "instagram",
      "city",
      "postal_code",
    ];

    const filteredUpdates: Partial<IUser> = {};

    for (const key in updateFields) {
      if (allowedFields.includes(key as keyof IUser)) {
        filteredUpdates[key as keyof IUser] = updateFields[key];
      }
    }

    if (filteredUpdates.password) {
      const salt = await bcrypt.genSalt(12);
      filteredUpdates.password = await bcrypt.hash(
        filteredUpdates.password,
        salt
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, filteredUpdates, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json("User not found", { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
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
  await ConnectDB();

  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Only admins can delete users" },
        { status: 403 }
      );
    }

    const { id } = params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
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
