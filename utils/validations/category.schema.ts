import { z } from "zod";

export const CategorySchema = z.object({
    name: z.string().min(1, "name is required"),
    slug: z.string().min(1, "slug is required")
});

export type categoryValues = z.infer<typeof CategorySchema>;