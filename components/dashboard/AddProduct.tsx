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
import axiosInstance from "@/lib/axiosInstance";
import ImageUploading from "../ui/ImageUploading";
import InputField from "./InputField";
import ColorSection from "./ColorSection";
import { ProductFormValues } from "@/types";
import SelectField from "../ui/SelectField";
import { Switch } from "../ui/switch";

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
        <InputField
          name="stock"
          label="موجودی"
          placeholder="120"
          loading={loading}
          control={form.control}
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
          className="bg-secondary-600 text-white py-2 rounded-md w-full disabled:bg-secondary-400 disabled:cursor-not-allowed"
        >
          {loading ? "در حال ارسال ..." : "افزودن محصول"}
        </button>
      </form>
    </Form>
  );
};

export default AddProduct;
