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
import { handleShowToast } from "@/lib/toast";
import Loading from "../shared/Loading";

const Profile = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
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
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
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
      handleShowToast("کاربر یافت نشد، لطفا دوباره وارد شوید", "error");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`users/${session.user.id}`, {
        id: session.user.id,
        ...values
      });

      console.log(data);

      handleShowToast("اطلاعات شما با موفقیت به‌روز شد");
    } catch (error) {
      console.error("Error updating user:", error);
      handleShowToast("مشکلی در بروزرسانی اطلاعات پیش آمد. لطفا دوباره تلاش کنید", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex_center h-screen bg-white">
      <Loading />
    </div>
  );

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
                | "firstName"
                | "lastName"
                | "phone"
                | "address"
                | "city"
                | "postalCode"
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
