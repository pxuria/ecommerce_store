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
import { Control, FieldValues, Path } from "react-hook-form";
import { toast } from "react-toastify";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  url: string;
  label: string;
  toastErrorText: string;
}

interface Option {
  id: string;
  name: string;
}

const SelectField = <T extends FieldValues>({ control, label, name, url, toastErrorText }: SelectFieldProps<T>) => {
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/${url}`);
        setItems(data.categories);
      } catch (error) {
        toast.error(toastErrorText)
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [url, toastErrorText]);

  if (loading) return <p>loading</p>;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full sm:w-[calc(50%-8px)]">
          <FormLabel className="form_label">{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <SelectTrigger className="form_input">
                <SelectValue
                  placeholder={loading ? "در حال دریافت..." : "یک مورد انتخاب کنید"}
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {items.length > 0 ? (
                  items.map(item => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="hover:bg-light_muted cursor-pointer text-right flex justify-end"
                    >
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    موردی یافت نشد
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="form_item_error" dir="rtl" />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
