import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type InputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  itemClass?: string;
  label: string;
  type?: string;
  placeholder?: string;
  loading?: boolean;
};

const InputField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  itemClass = "w-full sm:w-[calc(50%-8px)]",
  control,
  loading,
}: InputFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={itemClass}>
        <FormLabel className="form_label">{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder || label}
            {...field}
            value={
              typeof field.value === "string" || typeof field.value === "number"
                ? field.value
                : ""
            }
            className="form_input"
            disabled={loading}
          />
        </FormControl>
        <FormMessage className="form_item_error" dir="rtl" />
      </FormItem>
    )}
  />
);

export default InputField;
