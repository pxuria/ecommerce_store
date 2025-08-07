import { Form } from "@/components/ui/form";
import { categorySchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "./InputField";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

type categoryFormValues = z.infer<typeof categorySchema>;

const AddCategory = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<categoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      enName: "",
    },
  });

  const submitHandler = async (values: categoryFormValues) => {
    if (!(await form.trigger())) {
      console.error("Validation failed:", form.formState.errors);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("category", {
        name: values.name,
        enName: values.enName,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      // form.reset();
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex items-start justify-center flex-wrap gap-4"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        {/* category name Field */}
        <InputField
          name="name"
          label="نام دسته بندی"
          control={form.control}
          loading={loading}
        />

        {/* category en-name Field */}
        <InputField
          name="enName"
          label="نام انگلیسی دسته بندی"
          control={form.control}
          loading={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-md w-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "در حال ارسال ..." : "افزودن دسته بندی"}
        </button>
      </form>
    </Form>
  );
};

export default AddCategory;
