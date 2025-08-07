"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { ICategory } from "@/types";
import { ControllerRenderProps } from "react-hook-form";

interface FormValues {
  category: string;
}

interface SelectFieldProps {
  field: ControllerRenderProps<FormValues, "category">;
}

const SelectField = ({ field }: SelectFieldProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data } = await axiosInstance.get("/category"); // Adjust API endpoint
        setCategories(data.categories); // Assuming the response is { categories: [{ id, name }] }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  if (loadingCategories) return <p>loading</p>;
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value}
      disabled={loadingCategories}
    >
      <SelectTrigger className="form_input">
        <SelectValue
          placeholder={
            loadingCategories ? "در حال دریافت..." : "یک دسته انتخاب کنید"
          }
        />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {categories.length > 0 ? (
          categories.map((category) => (
            <SelectItem
              key={category._id}
              value={category._id}
              className="hover:bg-light_muted cursor-pointer text-right flex justify-end"
            >
              {category.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            دسته‌ای یافت نشد
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SelectField;
