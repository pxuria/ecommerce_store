'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
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

    const defaultValues = {
        title: item?.title || "",
        slug: item?.slug || "",
        content: item?.content || "",
        coverImage: item?.coverImage || undefined,
        estimatedTimeToRead: item?.estimatedTimeToRead || 0,
        metaTitle: item?.metaTitle || "",
        metaDescription: item?.metaDescription || "",
        metaKeywords: item?.metaKeywords || "",
        isPublished: item?.isPublished || false
    };

    const form = useForm<blogValues>({
        resolver: zodResolver(blogSchema),
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
            let uploadedImage = "";
            if (values.coverImage) uploadedImage = await uploadImage(image as File);

            const { data } = await axiosInstance.post("blogs", {
                ...values,
                wallpaper: uploadedImage,
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            reset();
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
                        setValue={(value) =>
                            setValue("coverImage", value as FileWithPreview, {
                                shouldValidate: true,
                            })
                        }
                        file={image}
                        setFile={setImage}
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
                            <FormControl>
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
