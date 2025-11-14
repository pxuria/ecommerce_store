'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BrandSchema, brandValues } from "@/utils/validations/brand.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { Form } from "@/components/ui/form";
import { IBrand } from "@/types/model";
import InputField from "../InputField";
import FormButtons from "../FormButtons";

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
            const payload = {
                name: values.name,
                slug: values.slug
            };

            const { data } = onUpdated
                ? await axiosInstance.put(`brands/${item?.id}`, payload)
                : await axiosInstance.post("brands", payload);

            console.log(data);
            handleShowToast(onUpdated ? 'برند با موفقیت ویرایش شد' : 'برند با موفقیت ساخته شد');

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
                    label="برند (نشانی کوتاه)"
                    control={form.control}
                    loading={loading}
                />

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش برند" : "افزودن برند"} onClose={onClose} />
            </form>
        </Form>
    );
};

export default BrandForm;
