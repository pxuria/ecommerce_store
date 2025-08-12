'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BrandSchema, brandValues } from "@/utils/validations/brand.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import axiosInstance from "@/lib/axiosInstance";
import { IBrand } from "@/types/model";
import InputField from "../InputField";

interface Props {
    item?: IBrand;
    onClose: () => void;
    onUpdated?: () => void;
}

const BrandForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        name: item?.name || '',
        slug: item?.slug || ''
    }

    const form = useForm<brandValues>({
        resolver: zodResolver(BrandSchema),
        defaultValues
    });

    const submitHandler = async (values: brandValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            if (onUpdated) {
                const { data } = await axiosInstance.put(`brand/${item?.id}`, {
                    name: values.name,
                    slug: values.slug
                });
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("brand", {
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
                {/* brand name Field */}
                <InputField
                    name="name"
                    label="نام برند"
                    control={form.control}
                    loading={loading}
                />

                {/* brand slug Field */}
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
                        {loading ? "در حال ارسال ..." : "افزودن برند"}
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

export default BrandForm;
