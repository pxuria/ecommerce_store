import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { asyncHandler, HttpError } from "@/utils/helpers";

export const POST = async (req: Request) => asyncHandler(async () => {
    const { first_name, last_name, phone, email, password } = await req.json();
    if (!first_name || !last_name || !email || !phone || !password) throw new HttpError("اطلاعات ارسالی ناقص است.", 400);

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } })
    if (existing) throw new HttpError("اطلاعات وارد شده تکراری است.", 409);

    const hashed = await hash(password, 12)
    const user = await prisma.user.create({
        data: {
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            password: hashed,
        },
    })

    return { data: user };
}, { successStatus: 201 });
