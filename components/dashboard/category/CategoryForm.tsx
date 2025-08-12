'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySchema, categoryValues } from "@/utils/validations/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { ICategory } from "@/types/model";
import InputField from "../InputField";

interface Props {
    item?: ICategory;
    onClose: () => void;
    onUpdated?: () => void;
}

const CategoryForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        name: item?.name || '',
        slug: item?.slug || ''
    }

    const form = useForm<categoryValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues
    });

    const submitHandler = async (values: categoryValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            if (onUpdated) {
                const { data } = await axiosInstance.put(`category/${item?.id}`, {
                    name: values.name,
                    slug: values.slug
                });
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("category", {
                    name: values.name,
                    slug: values.slug
                });
                console.log(data);
            }
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

                {/* category slug Field */}
                <InputField
                    name="slug"
                    label="slug"
                    control={form.control}
                    loading={loading}
                />

                <div className="flex_center gap-4 flex-wrap lg:flex-nowrap">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-secondary-500 text-white py-2 rounded-md w-full lg:w-[calc(50%-16px)] disabled:bg-secondary-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "در حال ارسال ..." : "افزودن دسته بندی"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="bg-red-700 text-white py-2 rounded-md w-full lg:w-[calc(50%-16px)] disabled:bg-red-400 disabled:cursor-not-allowed"
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </Form>
    );
};

export default CategoryForm;
