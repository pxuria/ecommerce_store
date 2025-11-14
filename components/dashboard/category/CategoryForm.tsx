'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySchema, categoryValues } from "@/utils/validations/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { ICategory } from "@/types/model";
import InputField from "../InputField";
import FormButtons from "../FormButtons";
import { handleShowToast } from "@/lib/toast";

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
            const payload = {
                name: values.name,
                slug: values.slug
            };

            const { data } = onUpdated
                ? await axiosInstance.put(`categories/${item?.id}`, payload)
                : await axiosInstance.post("categories", payload);

            console.log(data);
            handleShowToast(onUpdated ? 'دسته بندی با موفقیت ویرایش شد' : 'دسته بندی با موفقیت ساخته شد');
        } catch (error) {
            console.log(error);
        } finally {
            form.reset();
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
                    label="دسته بندی (نشانی کوتاه)"
                    control={form.control}
                    loading={loading}
                />

                <FormButtons
                    loading={loading}
                    onClose={onClose}
                    submitTitle={onUpdated ? "ویرایش دسته بندی" : "افزودن دسته بندی"}
                />
            </form>
        </Form>
    );
};

export default CategoryForm;
