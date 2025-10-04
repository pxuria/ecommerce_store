"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginValues } from "@/utils/validations/user.schema";
import PasswordField from "@/components/ui/PasswordField";
import InputField from "@/components/dashboard/InputField";
import { handleShowToast } from "@/lib/toast";

interface Props {
  setOpen: (val: boolean) => void;
  setForm: (val: "login" | "signup") => void;
}

const Login = ({ setOpen, setForm }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<loginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const submitHandler = async (data: loginValues) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        handleShowToast('ایمیل یا رمز عبور اشتباه است', 'error');
      } else {
        handleShowToast('با موفقیت وارد شدید');
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        handleShowToast(error.message || 'خطایی رخ داد', 'error');
      } else {
        handleShowToast('خطایی رخ داد', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        id="login"
        className="flex-column gap-3"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        {/* phone */}
        <InputField
          name='phone'
          loading={loading}
          itemClass='w-full'
          label='شماره همراه'
          control={form.control}
        />

        {/* Password Field */}
        <PasswordField
          name="password"
          loading={loading}
          control={form.control}
        />

        <div className="flex items-center justify-start gap-2 mt-3">
          <span className="font-medium text-milky text-sm">حساب کاربری ندارید؟</span>
          <span onClick={() => setForm('signup')} className="font-bold text-[#00a5f0] text-sm cursor-pointer">
            ثبت نام
          </span>
        </div>
      </form>
    </Form>
  );
};

export default Login;
