'use client';

import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { IBanner } from "@/types/model";
import InputField from "../InputField";
import FormButtons from "../FormButtons";
import { bannerSchema, bannerValues } from "@/utils/validations/banner.schema";
import ImageUploading from "@/components/ui/ImageUploading";
import { FileWithPreview } from "@/types";
import { Switch } from "@/components/ui/switch";
import { uploadImage } from "@/utils/helpers";
import { handleShowToast } from "@/lib/toast";

interface Props {
    item?: IBanner;
    onClose: () => void;
    onUpdated?: () => void;
}

const BannerForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState<FileWithPreview | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>(item?.image || '');

    const defaultValues: bannerValues = {
        image: item?.image || "",
        alt: item?.alt || "",
        displayOrder: item?.displayOrder ?? undefined,
        isActive: item?.isActive ?? true,
    };

    const form = useForm<bannerValues>({
        resolver: zodResolver(bannerSchema) as Resolver<bannerValues>,
        defaultValues,
    });

    const submitHandler = async (values: bannerValues) => {
        const valid = await form.trigger();
        if (!valid) {
            console.error("Validation failed:", form.formState.errors);
            return;
        }

        setLoading(true);
        try {
            let finalImageUrl: string | null = null;
            if (image) {
                const uploaded = await uploadImage([image as FileWithPreview]);
                finalImageUrl = uploaded[0];
            } else {
                finalImageUrl = existingImageUrl || null;
            }

            if (!finalImageUrl) throw new Error('تصویر بنر الزامی است.');

            const payload = {
                image: finalImageUrl,
                alt: values.alt,
                displayOrder: values.displayOrder,
                isActive: values.isActive,
            };

            const { data } = onUpdated
                ? await axiosInstance.put(`banners/${item?.id}`, payload)
                : await axiosInstance.post("banners", payload);

            handleShowToast(onUpdated ? 'بنر با موفقیت ویرایش شد' : 'بنر با موفقیت ساخته شد');

            console.log(data);
            onUpdated?.();
            form.reset();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="flex items-start justify-center flex-wrap gap-4"
                onSubmit={form.handleSubmit(submitHandler)}
            >
                {/* banner image Field */}
                <div className="w-full mt-8">
                    <FormLabel className="form_label">عکس بلاگ</FormLabel>
                    <ImageUploading
                        setValue={(value) => form.setValue("image", value as unknown as File | string, { shouldValidate: true })
                        }
                        files={image}
                        setFiles={file => setImage(file && !Array.isArray(file) ? file : null)}
                        existingImageUrls={existingImageUrl ? [existingImageUrl] : null}
                        setExistingImageUrls={(urls) => {
                            const url = Array.isArray(urls) ? urls[0] ?? null : urls ?? null;
                            setExistingImageUrl(url || '');
                            form.setValue("image", url || "");
                        }}

                        disabled={loading}
                    />
                </div>

                {/* banner alt Field */}
                <InputField
                    name="alt"
                    label="متن عکس"
                    control={form.control}
                    loading={loading}
                />

                {/* banner displayOrder Field */}
                <InputField
                    name="displayOrder"
                    label="ترتیب نمایش"
                    control={form.control}
                    loading={loading}
                    type="number"
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="form_label">وضعیت بنر</FormLabel>
                            <FormControl>
                                <Switch
                                    className="block"
                                    checked={field.value}
                                    onCheckedChange={checked => field.onChange(checked)}
                                    disabled={loading}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormButtons
                    loading={loading}
                    submitTitle={onUpdated ? "ویرایش بنر" : "افزودن بنر"}
                    onClose={onClose} />
            </form>
        </Form>
    );
};

export default BannerForm;
