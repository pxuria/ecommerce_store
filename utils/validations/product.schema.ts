import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    description: z.string().optional(),
    pricePerMeter: z.union([z.string(), z.number()], {
        required_error: "Price per meter is required",
    }),
    discountPercent: z.union([z.string(), z.number()]).optional(),
    stockMeters: z.union([z.string(), z.number()], {
        required_error: "Stock in meters is required",
    }),
    countryOfOrigin: z.string().optional(),
    categoryId: z.number({ required_error: "Category is required" }),
    countryId: z.number().optional(),
    brandId: z.number().optional(),
    images: z
        .array(
            z.object({
                url: z.string().url("Invalid image URL"),
                alt: z.string().optional(),
            })
        )
        .optional(),
    attributes: z
        .array(
            z.object({
                key: z.string(),
                value: z.string(),
            })
        )
        .optional(),
    colors: z.array(z.number()).optional(),
    isActive: z.boolean().default(true)
});

export type productValues = z.infer<typeof productSchema>;