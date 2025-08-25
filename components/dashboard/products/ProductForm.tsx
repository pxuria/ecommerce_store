'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { productSchema, productValues } from "@/utils/validations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { IProduct } from "@/types/model";
import InputField from "../InputField";
import FormButtons from "../FormButtons";
import ImageUploading from "@/components/ui/ImageUploading";

interface Props {
    item?: IProduct;
    onClose: () => void;
    onUpdated?: () => void;
}

const ProductForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        name: item?.name || '',
        image: item?.image || '',
    }

    const form = useForm<productValues>({
        resolver: zodResolver(productSchema),
        defaultValues
    });

    const submitHandler = async (values: productValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            if (onUpdated) {
                const { data } = await axiosInstance.put(`countries/${item?.id}`, {
                    name: values.name
                });
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("countries", {
                    name: values.name
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
                {/* product name Field */}
                <InputField
                    name="name"
                    label="نام محصول"
                    control={form.control}
                    loading={loading}
                />

                <ImageUploading
                    setValue={(value) =>
                        form.setValue("image", value, { shouldValidate: true })
                    }
                    disabled={loading}
                />

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش کشور" : "افزودن کشور"} onClose={onClose} />
            </form>
        </Form>
    )
}

export default ProductForm



