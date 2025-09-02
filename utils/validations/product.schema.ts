import { z } from "zod";

export const productColorVariantSchema = z.object({
    colorId: z
        .union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== null, {
            message: "انتخاب رنگ الزامی است",
        }),
    pricePerMeter: z.coerce.number().positive({
        message: "قیمت هر متر باید بزرگ‌تر از ۰ باشد",
    }),
    discountPercent: z.coerce
        .number()
        .min(0, { message: "نمی‌تواند منفی باشد" })
        .max(100, { message: "حداکثر 100%" })
        .optional(),
    stockMeters: z.coerce
        .number()
        .min(0, { message: "موجودی نمی‌تواند منفی باشد" }),
});

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    categoryId: z.union([z.string(), z.number()]).optional(),
    brandId: z.union([z.string(), z.number()]).optional(),
    countryId: z.union([z.string(), z.number()]).optional(),

    images: z
        .array(
            z.object({
                url: z.string().url("Invalid image URL"),
                alt: z.string().optional()
            })
        )
        .optional(),
    attributes: z
        .array(
            z.object({
                key: z.string().min(1),
                value: z.string().min(1),
            })
        )
        .optional(),
    colorVariants: z
        .array(productColorVariantSchema)
        .min(1, "حداقل یک رنگ و قیمت باید ثبت شود"),
    isActive: z.boolean().default(true)
});

export type productValues = z.infer<typeof productSchema>;