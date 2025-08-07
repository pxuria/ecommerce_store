"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactUsFormSchema } from "@/utils/validations";
import { contactusFormFields } from "@/constants";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

interface IContactus {
  name: string;
  phone: string;
  description: string;
  subject: string;
}

const ContactusForm = () => {
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      subject: "",
      description: "",
    },
  });

  const onSubmit = async ({
    name,
    phone,
    description,
    subject,
  }: IContactus) => {
    if (!session?.user) throw new Error("قبل از ارسال پیام، ثبت نام کنید.");
    try {
      const { data } = await axiosInstance.post("contact-us", {
        name,
        phone,
        message: description,
        subject,
        email: session?.user.email,
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-6 border rounded-lg shadow flex items-start justify-start gap-2 flex-wrap w-full lg:w-2/5 min-h-[400px]"
      >
        {contactusFormFields.map((item, index) => (
          <FormField
            key={index}
            control={form.control}
            name={item.name as "name" | "phone" | "subject"}
            render={({ field }) => (
              <FormItem className="w-full md:w-[calc(50%-8px)] !mt-0">
                <FormLabel className="form_label">{item.label}</FormLabel>
                <FormControl>
                  <Input
                    className="!h-fit !bg-[#fff] file:!bg-[#fff]"
                    type={item.type}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full !mt-0">
              <FormLabel className="form_label">توضیحات</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px] !h-fit !bg-[#fff] file:!bg-[#fff]"
                  placeholder="توضیحات خود را بنویسید..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-white font-medium">
          ارسال پیام
        </Button>
      </form>
    </Form>
  );
};

export default ContactusForm;
