'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CountrySchema, countryValues } from "@/utils/validations/country.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { ICountry } from "@/types/model";
import InputField from "../InputField";
import FormButtons from "../FormButtons";

interface Props {
    item?: ICountry;
    onClose: () => void;
    onUpdated?: () => void;
}

const CoutnryForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        name: item?.name || '',
        slug: item?.slug || ''
    }

    const form = useForm<countryValues>({
        resolver: zodResolver(CountrySchema),
        defaultValues
    });

    const submitHandler = async (values: countryValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            if (onUpdated) {
                const { data } = await axiosInstance.put(`countries/${item?.id}`, {
                    name: values.name,
                    slug: values.slug
                });
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("countries", {
                    name: values.name,
                    slug: values.slug
                });
                console.log(data);
            }
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
                    label="نام کشور"
                    control={form.control}
                    loading={loading}
                />

                {/* brand slug Field */}
                <InputField
                    name="slug"
                    label="کشور (نشانی کوتاه)"
                    control={form.control}
                    loading={loading}
                />

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش کشور" : "افزودن کشور"} onClose={onClose} />
            </form>
        </Form>
    );
};

export default CoutnryForm;
