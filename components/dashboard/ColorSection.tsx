import {
  Control,
  FieldArrayWithId,
  Path,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import SizeField from "./SizeField";
import { ProductFormValues } from "@/types";
import InputField from "./InputField";

interface ColorSectionProps {
  colorFields: FieldArrayWithId<ProductFormValues, "colors", "id">[];
  control: Control<ProductFormValues>;
  addColor: UseFieldArrayAppend<ProductFormValues, "colors">;
  removeColor: UseFieldArrayRemove;
  loading: boolean;
}

const ColorSection = ({
  colorFields,
  control,
  addColor,
  removeColor,
  loading,
}: ColorSectionProps) => (
  <div className="w-full">
    <h3 className="font-semibold">رنگ ها</h3>
    {colorFields.map((color, index: number) => (
      <div
        key={color.id}
        className="border border-purple_700 p-2 rounded-md mt-2"
      >
        <InputField
          name={`colors.${index}.name` as Path<ProductFormValues>}
          label="نام رنگ"
          itemClass="w-full"
          control={control}
          loading={loading}
        />
        <SizeField colorIndex={index} control={control} />
        <button
          type="button"
          className="mt-2 w-full bg-red-500 text-white py-2 rounded-md"
          onClick={() => removeColor(index)}
        >
          حذف رنگ
        </button>
      </div>
    ))}
    <button
      type="button"
      className="mt-2 bg-purple_700 text-white px-4 py-2 rounded"
      onClick={() => addColor({ name: "", sizes: [] })}
    >
      افزودن رنگ
    </button>
  </div>
);

export default ColorSection;
