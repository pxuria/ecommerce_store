'use client';

import { useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { productSchema, productValues } from "@/utils/validations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form } from "@/components/ui/form";
import { IProduct } from "@/types/model";
import ImageUploading from "@/components/ui/ImageUploading";
import InputField from "../InputField";
import FormButtons from "../FormButtons";
import SelectField from "@/components/ui/SelectField";
import { Button } from "@/components/ui/button";
import { FileWithPreview } from "@/types";

interface Props {
    item?: IProduct;
    onClose: () => void;
    onUpdated?: () => void;
}

const ProductForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState<FileWithPreview | null>(null);

    const defaultValues: productValues = {
        name: item?.name || '',
        slug: item?.slug || '',
        categoryId: item?.categoryId || '',
        brandId: item?.brandId || '',
        countryId: item?.countryId || '',
        images: undefined,
        colorVariants: item?.colorVariants || [],
        isActive: item?.isActive || false

    }

    const form = useForm<productValues>({
        resolver: zodResolver(productSchema) as Resolver<productValues>,
        defaultValues
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "colorVariants"
    });

    const submitHandler = async (values: productValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            if (onUpdated) {
                const { data } = await axiosInstance.put(`products/${item?.id}`, values);
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("products", values);
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

                {/* 🔥 Color Variants */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg">رنگ‌ها و قیمت‌ها</h3>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-4 gap-4 items-end border p-4 rounded-lg"
                        >
                            <SelectField
                                url="colors"
                                name={`colorVariants.${index}.colorId`}
                                label="رنگ"
                                control={form.control}
                                toastErrorText="رنگ یافت نشد"
                            />

                            <InputField
                                name={`colorVariants.${index}.pricePerMeter`}
                                label="قیمت هر متر"
                                control={form.control}
                                loading={loading}
                            />

                            <InputField
                                name={`colorVariants.${index}.discountPercent`}
                                label="درصد تخفیف"
                                control={form.control}
                                loading={loading}
                            />

                            <InputField
                                name={`colorVariants.${index}.stockMeters`}
                                label="موجودی (متر)"
                                control={form.control}
                                loading={loading}
                            />

                            <button
                                type="button"
                                className="text-red-500 text-sm"
                                onClick={() => remove(index)}
                            >
                                حذف
                            </button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() =>
                            append({ colorId: "", pricePerMeter: 0, discountPercent: 0, stockMeters: 0 })
                        }
                    >
                        افزودن رنگ
                    </Button>
                </div>

                <ImageUploading
                    setValue={(value) =>
                        form.setValue("images", value as FileWithPreview, { shouldValidate: true })
                    }
                    file={image}
                    multiple={true}
                    setFile={setImage}
                    disabled={loading}
                />

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش محصول" : "افزودن محصول"} onClose={onClose} />
            </form>
        </Form>
    )
}

export default ProductForm



