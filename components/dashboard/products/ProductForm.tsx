'use client';

import { useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { productSchema, productValues } from "@/utils/validations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ImageUploading from "@/components/ui/ImageUploading";
import SelectField from "@/components/ui/SelectField";
import { Button } from "@/components/ui/button";
import TextEditor from "@/components/ui/TextEditor";
import { Switch } from "@/components/ui/switch";
import { uploadImage } from "@/utils/helpers";
import axiosInstance from "@/lib/axiosInstance";
import { IProduct } from "@/types/model";
import { FileWithPreview } from "@/types";
import InputField from "../InputField";
import FormButtons from "../FormButtons";

interface Props {
    item?: IProduct;
    onClose: () => void;
    onUpdated?: () => void;
}

const ProductForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [images, setImages] = useState<FileWithPreview[] | null>(null);
    console.log(item);

    const defaultValues: productValues = {
        name: item?.name || '',
        slug: item?.slug || '',
        categoryId: item?.categoryId || '',
        brandId: item?.brandId || '',
        countryId: item?.countryId || '',
        description: item?.description || '',
        images: undefined,
        colorVariants: item?.colorVariants || [],
        attributes: item?.attributes || [],
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

    const { fields: attrFields, append: appendAttr, remove: removeAttr } = useFieldArray({
        control: form.control,
        name: "attributes"
    });

    const submitHandler = async (values: productValues) => {
        if (!(await form.trigger())) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }
        setLoading(true);
        try {
            let uploadedImages: string[] = [];
            if (images && images.length > 0) uploadedImages = await uploadImage(images as File[]);

            const payload = {
                ...values,
                categoryId: values.categoryId || null,
                brandId: values.brandId || null,
                countryId: values.countryId || null,
                images: uploadedImages,
                attributes: values.attributes ?? [],
                colorVariants: values.colorVariants ?? [],
            };

            if (onUpdated) {
                const { data } = await axiosInstance.put(`products/${item?.id}`, payload);
                console.log(data);
            }
            else {
                const { data } = await axiosInstance.post("products", payload);
                console.log(data);
            }

        } catch (error) {
            console.log(error);
        } finally {
            onUpdated?.();
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

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="w-full lg:w-[calc(50%-18px)]">
                            <FormLabel className="form_label">وضعیت محصول (فعال)</FormLabel>
                            <FormControl>
                                <Switch
                                    className="block"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={loading}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* <div className="w-0 lg:w-[calc(50%-16px)]" /> */}

                {/* 🔥 Color Variants */}
                <div className="flex flex-col gap-2 w-full">
                    <FormLabel htmlFor="colorvariants" className="form_label">رنگ‌ها و قیمت‌ها</FormLabel>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex gap-4 items-end border p-4 rounded-lg flex-wrap"
                        >
                            <SelectField
                                url="colors"
                                name={`colorVariants.${index}.colorId`}
                                label="رنگ"
                                control={form.control}
                                toastErrorText="رنگ یافت نشد"
                            />

                            <InputField
                                itemClass="w-full lg:w-[calc(50%-16px)]"
                                name={`colorVariants.${index}.pricePerMeter`}
                                label="قیمت هر متر"
                                control={form.control}
                                loading={loading}
                                isPrice
                            />

                            <InputField
                                itemClass="w-full lg:w-[calc(50%-16px)]"
                                name={`colorVariants.${index}.discountPercent`}
                                label="درصد تخفیف"
                                control={form.control}
                                loading={loading}
                                maxLength={3}
                                isPercent
                            />

                            <InputField
                                itemClass="w-full lg:w-[calc(50%-16px)]"
                                name={`colorVariants.${index}.stockMeters`}
                                label="موجودی (متر)"
                                control={form.control}
                                loading={loading}
                            />

                            <Button
                                type="button"
                                className="bg-red-500 text-white text-sm"
                                onClick={() => remove(index)}
                            >
                                حذف
                            </Button>
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
                    className="w-full"
                    setValue={(value) =>
                        form.setValue("images", value && Array.isArray(value) ? value : undefined, { shouldValidate: true })
                    }
                    files={images}
                    multiple={true}
                    disabled={loading}
                    setFiles={files => setImages(files && Array.isArray(files) ? files : null)}
                />

                {/* content */}
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="form_label">توضیحات</FormLabel>
                            <FormControl>
                                <TextEditor value={field.value || ''} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-2 w-full">
                    <FormLabel className="form_label">ویژگی‌ها</FormLabel>
                    {attrFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex gap-4 items-end border p-4 rounded-lg flex-wrap"
                        >
                            <InputField
                                itemClass="w-full lg:w-[calc(50%-16px)]"
                                name={`attributes.${index}.key`}
                                label="کلید"
                                control={form.control}
                                loading={loading}
                            />

                            <InputField
                                itemClass="w-full lg:w-[calc(50%-16px)]"
                                name={`attributes.${index}.value`}
                                label="مقدار"
                                control={form.control}
                                loading={loading}
                            />

                            <Button
                                type="button"
                                className="bg-red-500 text-white text-sm"
                                onClick={() => removeAttr(index)}
                            >
                                حذف
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => appendAttr({ key: "", value: "" })}
                    >
                        افزودن ویژگی
                    </Button>
                </div>

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش محصول" : "افزودن محصول"} onClose={onClose} />
            </form>
        </Form>
    )
}

export default ProductForm



