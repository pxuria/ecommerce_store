'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ColorSchema, colorValues } from "@/utils/validations/color.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { IColor } from "@/types/model";
import InputField from "../InputField";

interface Props {
    item?: IColor;
    onClose: () => void;
    onUpdated?: () => void;
}

const ColorForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        name: item?.name || '',
        hex: item?.hex || ''
    }

    const form = useForm<colorValues>({
        resolver: zodResolver(ColorSchema),
        defaultValues
    });

    const submitHandler = async (values: colorValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            if (onUpdated) {
                const { data } = await axiosInstance.put(`color/${item?.id}`, {
                    name: values.name,
                    hex: values.hex
                });
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("color", {
                    name: values.name,
                    hex: values.hex
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
                {/* color name Field */}
                <InputField
                    name="name"
                    label="نام رنگ"
                    control={form.control}
                    loading={loading}
                />

                {/* color hex Field */}
                <InputField
                    name="hex"
                    label="کد رنگی"
                    control={form.control}
                    loading={loading}
                />

                <div className="flex_center gap-4 flex-wrap lg:flex-nowrap">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-secondary-500 text-white py-2 rounded-md w-full lg:w-[calc(50%-16px)] disabled:bg-secondary-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "در حال ارسال ..." : "افزودن رنگ"}
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

export default ColorForm;
