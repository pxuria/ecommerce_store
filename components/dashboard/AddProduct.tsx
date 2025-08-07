"use client";

import { useState } from "react";
import { productSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import ImageUploading from "../ui/ImageUploading";
import InputField from "./InputField";
import ColorSection from "./ColorSection";
import { ProductFormValues } from "@/types";
import SelectField from "../ui/SelectField";

const AddProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      basePrice: "0",
      stock: true,
      category: "",
      colors: [],
      image: [],
    },
  });

  const {
    fields: colorFields,
    append: addColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: "colors",
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data);
    if (!(await form.trigger())) {
      console.error("Validation failed:", form.formState.errors);
      return;
    }

    setLoading(true);

    try {
      const uploadedImages = await uploadImages(data.image);
      const { data: productData } = await axiosInstance.post("products", {
        ...data,
        image: uploadedImages,
      });
      console.log(productData);
    } catch (error) {
      console.error(error);
    } finally {
      // form.reset();
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    console.log("IMAGES", files);
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file-${index + 1}`, file);
    });

    try {
      const { data } = await axiosInstance.post("storage/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data.urls;
    } catch (error) {
      console.error("Image upload failed:", error);
      return [];
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex items-start justify-center flex-wrap gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* product name Field */}
        <InputField
          name="name"
          label="نام محصول"
          control={form.control}
          loading={loading}
        />

        {/* base price Field */}
        <InputField
          name="basePrice"
          label="قیمت پایه"
          control={form.control}
          loading={loading}
        />

        {/* Colors & Sizes */}
        <ColorSection
          colorFields={colorFields}
          control={form.control}
          addColor={addColor}
          removeColor={removeColor}
          loading={loading}
        />

        {/* category Field */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[calc(50%-8px)]">
              <FormLabel className="form_label">دسته بندی</FormLabel>
              <FormControl>
                <SelectField field={field} />
              </FormControl>
              <FormMessage className="form_item_error" dir="rtl" />
            </FormItem>
          )}
        />

        {/* stock Field */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[calc(50%-8px)]">
              <FormLabel className="form_label block">موجود</FormLabel>
              <FormControl>
                <label className="relative inline-flex items-center cursor-pointer">
                  <Input
                    type="checkbox"
                    className="sr-only peer"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                  <div className="group peer ring-0 bg-rose-400 rounded-full outline-none duration-300 after:duration-300 w-16 h-8 shadow-md peer-checked:bg-emerald-500 peer-focus:outline-none after:content-['✖️'] after:rounded-full after:absolute after:bg-white after:outline-none after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-checked:after:content-['✔️'] peer-hover:after:scale-95" />
                </label>
              </FormControl>
              <FormMessage className="form_item_error" dir="rtl" />
            </FormItem>
          )}
        />

        <ImageUploading
          setValue={(value) =>
            form.setValue("image", value, { shouldValidate: true })
          }
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-md w-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "در حال ارسال ..." : "افزودن محصول"}
        </button>
      </form>
    </Form>
  );
};

export default AddProduct;
