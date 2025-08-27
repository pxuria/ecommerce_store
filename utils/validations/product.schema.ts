import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    pricePerMeter: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
    discountPercent: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid discount").optional(),
    // discountPercent: z.union([z.string(), z.number()]).optional(),
    stockMeters: z.string().regex(/^\d+(\.\d{1,3})?$/, "Invalid stock").default("0"),
    // stockMeters: z.union([z.string(), z.number()], {
    //     required_error: "Stock in meters is required",
    // }),

    categoryId: z.number({ required_error: "Category is required" }),
    brandId: z.number().optional(),
    countryId: z.number().optional(),
    colors: z.array(z.number()).optional(),

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
    isActive: z.boolean().default(true)
});

export type productValues = z.infer<typeof productSchema>;