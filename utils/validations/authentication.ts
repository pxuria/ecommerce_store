import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "یک ایمیل معتبر استفاده نمایید." })
    .min(1, { message: "ایمیل الزامی است." }),
  password: z.string().min(8, "رمز عبور باید بیشتر از 8 کارکتر باشد."),
});

export const signupSchema = z.object({
  first_name: z.string().min(1, { message: "نام الزامی است." }),
  last_name: z.string().min(1, { message: "نام خانوادگی الزامی است." }),
  email: z
    .string()
    .email({ message: "یک ایمیل معتبر استفاده نمایید." })
    .min(1, { message: "ایمیل الزامی است." }),
  password: z.string().min(8, "رمز عبور باید بیشتر از 8 کارکتر باشد."),
});
