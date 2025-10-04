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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Skeleton } from "./skeleton";
import { handleShowToast } from "@/lib/toast";

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  url: string;
  label: string;
  toastErrorText: string;
  itemClass?: string;
}

interface Option {
  id: string;
  name: string;
}

const SelectField = <T extends FieldValues>({ control, label, name, url, itemClass = "w-full sm:w-[calc(50%-8px)]", toastErrorText }: SelectFieldProps<T>) => {
  const [items, setItems] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/${url}`);
        setItems(data.data);
      } catch (error) {
        handleShowToast(toastErrorText, 'error');
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, toastErrorText]);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={itemClass}>
          <FormLabel className="form_label">{label}</FormLabel>
          <FormControl>
            {loading ? <Skeleton className="h-10 w-full rounded-md" /> :
              (<Select
                value={field.value ?? " "}
                onValueChange={field.onChange}
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
                        value={item.id.toString()}
                        className="hover:bg-light_muted cursor-pointer text-right flex justify-end"
                      >
                        {item.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__no_data__" disabled>
                      موردی یافت نشد
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>)}
          </FormControl>
          <FormMessage className="form_item_error" dir="rtl" />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
