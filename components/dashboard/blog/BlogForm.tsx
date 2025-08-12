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
    FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/lib/axiosInstance";
import { blogSchema, blogValues } from "@/utils/validations/blog.schema";
import { FileWithPreview } from "@/types";
import { Input } from "@/components/ui/input";
import ImageUploading from "@/components/ui/ImageUploading";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/utils/helpers";
import TextEditor from "@/components/ui/TextEditor";
import { handleShowToast } from "@/lib/toast";

const BlogForm = ({ userId }: { userId: string }) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<FileWithPreview | null>(null);

    const defaultValues = {
        title: "",
        content: "",
        wallpaper: undefined,
        estimatedTimeToRead: 0,
        metaTitle: "",
        metaDescription: "",
    };

    const form = useForm<blogValues>({
        resolver: zodResolver(blogSchema),
        defaultValues
    });

    const submitHandler = async (values: blogValues) => {
        if (!(await form.trigger())) {
            handleShowToast("اطلاعات فرم را تکمیل نمایید.", "error")
            console.error("Validation failed:", form.formState.errors);
            return;
        }

        setLoading(true);
        try {
            let uploadedImage = "";

            if (values.wallpaper) {
                uploadedImage = await uploadImage(image as File);
            }

            const { data } = await axiosInstance.post("blog", {
                ...values,
                author: userId,
                wallpaper: uploadedImage,
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            form.reset();
        }
    };

    return (
        <Form {...form}>
            <form
                id="blog"
                className="flex items-start flex-wrap gap-4"
                onSubmit={form.handleSubmit(submitHandler)}
            >
                {/* title */}
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="w-full md:w-[calc(50%-8px)]">
                            <FormLabel className="form_label">تیتر</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={loading}
                                    placeholder="تیتر"
                                    className="form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* estimatedTimeToRead */}
                <FormField
                    name="estimatedTimeToRead"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="w-full md:w-[calc(50%-8px)]">
                            <FormLabel className="form_label">
                                مدت زمان مطالعه (دقیقه)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="12"
                                    disabled={loading}
                                    className="form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* content */}
                <FormField
                    name="content"
                    control={form.control}
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

                {/* metaTitle */}
                <FormField
                    name="metaTitle"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="w-full md:w-[calc(50%-8px)]">
                            <FormLabel className="form_label">تیتر متا</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={loading}
                                    placeholder="تیتر متا"
                                    className="form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* metaDescription */}
                <FormField
                    name="metaDescription"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="w-full md:w-[calc(50%-8px)]">
                            <FormLabel className="form_label">توضیحات متا</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={loading}
                                    placeholder="توضیحات متا"
                                    className="form_input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="w-full mt-8">
                    <FormLabel className="form_label">عکس بلاگ</FormLabel>
                    <ImageUploading
                        setValue={(value) =>
                            form.setValue("wallpaper", value as FileWithPreview, {
                                shouldValidate: true,
                            })
                        }
                        file={image}
                        setFile={setImage}
                        disabled={loading}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-[calc(50%-8px)] text-white bg-lightPurple"
                >
                    {loading ? "در حال ارسال..." : "ثبت بلاگ"}
                </Button>

                <Button
                    type="reset"
                    disabled={loading}
                    onClick={() => form.reset()}
                    className="bg-red text-white w-[calc(50%-8px)]"
                >
                    انصراف
                </Button>
            </form>
        </Form>
    );
};

export default BlogForm;
