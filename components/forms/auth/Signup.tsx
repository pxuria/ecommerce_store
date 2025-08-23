"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, signupValues } from "@/utils/validations/user.schema";
import { toasterOptions } from "@/constants";
import { toast } from "react-toastify";
import PasswordField from "@/components/ui/PasswordField";
import InputField from "@/components/dashboard/InputField";

interface Props {
  setOpen: (val: boolean) => void;
}

const Signup = ({ setOpen }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<signupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const submitHandler = async (data: signupValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Signup failed");

      const loginRes = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) throw new Error(loginRes.error);
      toast.success("ثبت نام با موفقیت انجام شد.", toasterOptions);
      setOpen(false);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message || "خطایی رخ داد.", toasterOptions);
      } else {
        toast.error("خطایی رخ داد.", toasterOptions);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        id="signup"
        className="flex-column gap-3"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <div className="flex_center gap-4 w-full">
          {/* first_name */}
          <InputField
            name='first_name'
            loading={loading}
            itemClass='w-full'
            label='نام'
            control={form.control}
          />

          {/* last_name */}
          <InputField
            name='last_name'
            loading={loading}
            itemClass='w-full'
            label='نام خانوادگی'
            control={form.control}
          />
        </div>

        {/* phone */}
        <InputField
          name='phone'
          loading={loading}
          itemClass='w-full'
          label='شماره همراه'
          control={form.control}
        />

        {/* email */}
        <InputField
          name='email'
          type='email'
          label='ایمیل'
          loading={loading}
          itemClass='w-full'
          control={form.control}
        />

        <PasswordField
          name="password"
          loading={loading}
          control={form.control}
        />
      </form>
    </Form>
  );
};

export default Signup;
