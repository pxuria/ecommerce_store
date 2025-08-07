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
import { signupSchema } from "@/utils/validations/authentication";
import { toasterOptions } from "@/constants";
import { toast } from "react-toastify";

interface Props {
  setOpen: (val: boolean) => void;
}

const Signup = ({ setOpen }: Props) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log(result);

      if (result?.error) throw new Error(result.error);

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
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="form_label">نام</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="form_input"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="form_item_error" dir="rtl" />
              </FormItem>
            )}
          />

          {/* last_name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="form_label">نام خانوادگی</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="form_input"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="form_item_error" dir="rtl" />
              </FormItem>
            )}
          />
        </div>

        {/* email */}
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

        {/* password */}
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

export default Signup;
