"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/utils/validations/authentication";
import { toast } from "react-toastify";
import { toasterOptions } from "@/constants";

interface Props {
  setOpen: (val: boolean) => void;
}

const Login = ({ setOpen }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      toast.error("ایمیل یا رمز عبور اشتباه است", toasterOptions);
    } else {
      toast.success("با موفقیت وارد شدید", toasterOptions);
      setOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        id="login"
        className="flex-column gap-3"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="form_label">ایمیل</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  className="form_input"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage className="form_item_error" dir="rtl" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="form_label">رمز عبور</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="form_input"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage className="form_item_error" dir="rtl" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default Login;
