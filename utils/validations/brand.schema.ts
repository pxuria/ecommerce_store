import { z } from "zod";

export const BrandSchema = z.object({
    name: z.string().min(1, "name is required"),
    slug: z.string().min(1, "slug is required")
});

export type brandValues = z.infer<typeof BrandSchema>;