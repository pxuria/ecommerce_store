import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import InputField from "./InputField";
import { Control, Path, useFieldArray } from "react-hook-form";
import { ProductFormValues } from "@/types";

const SizeField = ({
  colorIndex,
  control,
}: {
  colorIndex: number;
  control: Control<ProductFormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `colors.${colorIndex}.sizes`,
  });

  return (
    <div>
      <h4 className="mt-2 font-semibold">اندازه‌ها</h4>
      {fields.map((size, sizeIndex) => (
        <div key={size.id} className="flex items-end gap-2 mt-2 w-full">
          <div className="flex_center gap-2 ">
            {/* Size Name */}
            <InputField
              name={
                `colors.${colorIndex}.sizes.${sizeIndex}.name` as Path<ProductFormValues>
              }
              label="اندازه"
              control={control}
            />

            {/* Stock Count */}
            <InputField
              name={
                `colors.${colorIndex}.sizes.${sizeIndex}.stockCount` as Path<ProductFormValues>
              }
              label="موجودی"
              type="number"
              control={control}
            />

            {/* Price */}
            <InputField
              name={
                `colors.${colorIndex}.sizes.${sizeIndex}.price` as Path<ProductFormValues>
              }
              label="قیمت"
              type="number"
              control={control}
            />
          </div>

          <button
            type="button"
            className="bg-[#EC2E5E] hover:bg-red-600 text-white flex_center rounded p-3 h-[70%]"
            onClick={() => remove(sizeIndex)}
          >
            <RiDeleteBin6Line className="w-5 h-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        className="mt-2 bg-purple_700 text-white px-4 py-1 rounded text-center"
        onClick={() => append({ name: "", stockCount: "0", price: "0" })}
      >
        افزودن اندازه
      </button>
    </div>
  );
};

export default SizeField;
