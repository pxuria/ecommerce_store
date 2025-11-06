'use client';

import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import axiosInstance from "@/lib/axiosInstance";
import { blogSchema, blogValues } from "@/utils/validations/blog.schema";
import { FileWithPreview } from "@/types";
import ImageUploading from "@/components/ui/ImageUploading";
import { uploadImage } from "@/utils/helpers";
import TextEditor from "@/components/ui/TextEditor";
import { handleShowToast } from "@/lib/toast";
import { IBlog } from "@/types/model";
import FormButtons from "../FormButtons";
import InputField from "../InputField";

interface Props {
    item?: IBlog;
    onClose: () => void;
    onUpdated?: () => void;
}

const BlogForm = ({ item, onClose, onUpdated }: Props) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<FileWithPreview | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>(item?.coverImage || '');

    const defaultValues = {
        title: item?.title || "",
        slug: item?.slug || "",
        content: item?.content || "",
        coverImage: item?.coverImage || '',
        estimatedTimeToRead: item?.estimatedTimeToRead || 1,
        metaTitle: item?.metaTitle || "",
        metaDescription: item?.metaDescription || "",
        metaKeywords: item?.metaKeywords || "",
        isPublished: item?.isPublished ?? false
    };

    const form = useForm<blogValues>({
        resolver: zodResolver(blogSchema) as Resolver<blogValues>,
        defaultValues
    });

    const { control, reset, handleSubmit, formState, setValue, trigger } = form;

    const submitHandler = async (values: blogValues) => {
        if (!(await trigger())) {
            handleShowToast("اطلاعات فرم را تکمیل نمایید.", "error")
            console.error("Validation failed:", formState.errors);
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

            if (!finalImageUrl) throw new Error('تصویر بلاگ الزامی است.');

            const payload = {
                ...values,
                coverImage: finalImageUrl
            };


            const { data } = onUpdated
                ? await axiosInstance.put(`blogs/${item?.id}`, payload)
                : await axiosInstance.post("blogs", payload);

            console.log(data);
            onUpdated?.();
            reset();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                id="blog"
                className="flex items-start flex-wrap gap-4"
                onSubmit={handleSubmit(submitHandler)}
            >
                {/* title */}
                <InputField
                    name="title"
                    label="تیتر"
                    loading={loading}
                    control={control}
                />

                {/* slug */}
                <InputField
                    name="slug"
                    label="بلاگ (نشانی کوتاه)"
                    loading={loading}
                    control={control}
                />

                {/* estimatedTimeToRead */}
                <InputField
                    label="مدت زمان مطالعه (دقیقه)"
                    name="estimatedTimeToRead"
                    placeholder="12"
                    type="number"
                    loading={loading}
                    control={control}
                />

                {/* metaTitle */}
                <InputField
                    name="metaTitle"
                    label="تیتر متا"
                    loading={loading}
                    control={control}
                />

                {/* metaDescription */}
                <InputField
                    name="metaDescription"
                    label="توضیحات متا"
                    loading={loading}
                    control={control}
                />

                {/* metaKeywords */}
                <InputField
                    name="metaKeywords"
                    label="کلمات کلیدی متا"
                    loading={loading}
                    control={control}
                />

                <div className="w-full mt-8">
                    <FormLabel className="form_label">عکس بلاگ</FormLabel>
                    <ImageUploading
                        setValue={(value) => setValue("coverImage", value as unknown as File | string, { shouldValidate: true })}
                        files={image}
                        setFiles={file => setImage(file && !Array.isArray(file) ? file : null)}
                        existingImageUrls={existingImageUrl ? [existingImageUrl] : null}
                        setExistingImageUrls={(urls) => {
                            const url = Array.isArray(urls) ? urls[0] ?? null : urls ?? null;
                            setExistingImageUrl(url || '');
                            form.setValue("coverImage", url || "");
                        }}

                        disabled={loading}
                    />
                </div>

                {/* content */}
                <FormField
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="form_label">متن</FormLabel>
                            <FormControl dir="ltr">
                                <TextEditor value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormButtons loading={loading} submitTitle={onUpdated ? "ویرایش بلاگ" : "افزودن بلاگ"} onClose={onClose} />
            </form>
        </Form>
    );
};

export default BlogForm;
