import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { asyncHandler, HttpError } from "@/utils/helpers";

export const POST = async (req: Request) => asyncHandler(async () => {
    const { phone, password } = await req.json();
    if (!phone || !password) throw new HttpError("تلفن همراه و رمز عبور الزامی است", 400);

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) throw new HttpError("تلفن همراه و رمز عبور نامعتبر است", 401);

    const isValid = await compare(password, user.password);
    if (!isValid) throw new HttpError("رمز عبور نامعتبر است", 401);

    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            role: user.role,
        }
    };
});