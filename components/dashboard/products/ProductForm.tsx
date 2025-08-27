'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { productSchema, productValues } from "@/utils/validations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { IProduct } from "@/types/model";
import ImageUploading from "@/components/ui/ImageUploading";
import InputField from "../InputField";
import FormButtons from "../FormButtons";
import SelectField from "@/components/ui/SelectField";

interface Props {
    item?: IProduct;
    onClose: () => void;
    onUpdated?: () => void;
}

const ProductForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);

    const defaultValues = {
        name: item?.name || '',
        slug: item?.slug || '',
        pricePerMeter: item?.pricePerMeter || '',
        discountPercent: item?.discountPercent || '',
        stockMeters: item?.stockMeters || '',
        categoryId: item?.categoryId || '',
        brandId: item?.brandId || '',
        countryId: item?.countryId || '',
        images: item?.images || '',

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
                    loading={loading}
                    label="نام محصول"
                    control={form.control}
                />

                {/* product slug Field */}
                <InputField
                    name="slug"
                    label="محصول (نشانی کوتاه)"
                    loading={loading}
                    control={form.control}
                />

                {/* product pricePerMeter Field */}
                <InputField
                    name="pricePerMeter"
                    label="قیمت هر متر"
                    loading={loading}
                    control={form.control}
                />

                {/* product discountPercent Field */}
                <InputField
                    name="discountPercent"
                    label="درصد تخفیف"
                    loading={loading}
                    control={form.control}
                />

                {/* product stockMeters Field */}
                <InputField
                    name="stockMeters"
                    label="موجودی براساس متر"
                    loading={loading}
                    control={form.control}
                />


                {/* category Field */}
                <SelectField
                    url="categories"
                    name="categoryId"
                    label="دسته بندی"
                    control={form.control}
                    toastErrorText="دسته بندی یافت نشد"
                />

                {/* brand Field */}
                <SelectField
                    url="brands"
                    name="brandId"
                    label="برند"
                    control={form.control}
                    toastErrorText="برندی یافت نشد"
                />

                {/* country Field */}
                <SelectField
                    url="countries"
                    name="countryId"
                    label="کشور ساخت"
                    control={form.control}
                    toastErrorText="کشوری یافت نشد"
                />

                <ImageUploading
                    setValue={(value) =>
                        form.setValue("images", value, { shouldValidate: true })
                    }
                    disabled={loading}
                />

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش محصول" : "افزودن محصول"} onClose={onClose} />
            </form>
        </Form>
    )
}

export default ProductForm



