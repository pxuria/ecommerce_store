"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { profileFields } from "@/constants";
import { profileSchema, profileValues } from "@/utils/validations/user.schema";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import PasswordField from "../ui/PasswordField";

const Profile = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      password: "",
      confirm_password: "",
    },
  });

  const { reset } = form;

  const fetchUser = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const { data } = await axiosInstance.get(`users/${session.user.id}`);

      reset({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        postal_code: data.postal_code || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [session?.user?.id, reset]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const onSubmit = async (values: profileValues) => {
    if (!session?.user?.id) {
      alert("کاربر یافت نشد، لطفا دوباره وارد شوید.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`users/${session.user.id}`, {
        id: session.user.id, // Ensure the user ID is sent
        ...values,
      });

      console.log(data);

      alert("اطلاعات شما با موفقیت به‌روز شد.");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("مشکلی در بروزرسانی اطلاعات پیش آمد. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="">loading</p>;

  return (
    <div className="rounded-xl p-4">
      <h2 className="text-black font-bold text-2xl">حساب کاربری</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end flex-wrap gap-4 mt-4"
        >
          {profileFields.map((item, index) => (
            <FormField
              key={index}
              control={form.control}
              name={
                item.name as
                | "email"
                | "first_name"
                | "last_name"
                | "phone"
                | "address"
                | "city"
                | "postal_code"
              }
              render={({ field }) => (
                <FormItem className="w-full lg:w-[calc(50%-8px)]">
                  <Label htmlFor={item.name} className="form_label">{item.label}</Label>
                  <FormControl>
                    <Input
                      id={item.name}
                      type={item.type}
                      placeholder={item.label}
                      {...field}
                      className="form_input !bg-white !ring-0 outline-none font-medium"
                    />
                  </FormControl>
                  <FormMessage className="form_item_error" dir="rtl" />
                </FormItem>
              )}
            />
          ))}
          <div className="hidden lg:block w-[calc(50%-8px)]" />

          <PasswordField
            name="password"
            loading={loading}
            control={form.control}
            itemClass="lg:w-[calc(50%-8px)]"
          />
          <PasswordField
            name="confirm_password"
            loading={loading}
            control={form.control}
            label="تکرار رمز عبور"
            itemClass="lg:w-[calc(50%-8px)]"
          />

          <button
            type="submit"
            className="w-full flex_center bg-purple_900 rounded-md text-white h-fit py-2 primary_transition mt-4"
          >
            ذخیره تغییرات
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
