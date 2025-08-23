import * as z from "zod";

export const signupSchema = z.object({
    first_name: z
        .string()
        .min(2, "نام باید حداقل ۲ حرف باشد")
        .nonempty("نام الزامی است"),
    last_name: z
        .string()
        .min(2, "نام خانوادگی باید حداقل ۲ حرف باشد")
        .nonempty("نام خانوادگی الزامی است"),
    email: z
        .string()
        .email("ایمیل معتبر وارد کنید")
        .nonempty("ایمیل الزامی است"),
    phone: z
        .string()
        .min(10, "شماره تلفن معتبر نیست")
        .nonempty("شماره تلفن الزامی است"),
    password: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
});

export const loginSchema = z.object({
    phone: z
        .string()
        .min(10, "شماره تلفن معتبر نیست")
        .nonempty("شماره تلفن الزامی است"),
    password: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
});

export const profileSchema = z.object({
    first_name: z
        .string()
        .min(2, "نام باید حداقل ۲ حرف باشد")
        .nonempty("نام الزامی است"),
    last_name: z
        .string()
        .min(2, "نام خانوادگی باید حداقل ۲ حرف باشد")
        .nonempty("نام خانوادگی الزامی است"),
    email: z.string().email("ایمیل معتبر وارد کنید").nonempty("ایمیل الزامی است"),
    phone: z
        .string()
        .min(10, "شماره تلفن معتبر نیست")
        .nonempty("شماره تلفن الزامی است"),
    address: z
        .string()
        .min(10, "آدرس باید بیشتر از 10 کاراکتر باشد")
        .max(180, "آدرس باید کمتر از 180 کاراکتر باشد")
        .nonempty("آدرس الزامی است"),
    city: z.string().min(2, "شهر معتبر نیست").nonempty("شهر الزامی است"),
    postal_code: z.string().min(10, "کد پستی معتبر نیست").optional(),
    password: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
    confirm_password: z
        .string()
        .min(8, "تأیید رمز عبور باید حداقل ۸ کاراکتر باشد")
});

export type signupValues = z.infer<typeof signupSchema>
export type loginValues = z.infer<typeof loginSchema>
export type profileValues = z.infer<typeof profileSchema>