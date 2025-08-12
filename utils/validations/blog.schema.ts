import { z } from "zod";

export const blogSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title must be at most 100 characters")
        .trim(),
    content: z.string().min(20, "Content must be at least 20 characters long"),
    wallpaper: z.instanceof(File),
    estimatedTimeToRead: z.coerce
        .number()
        .min(1, "Estimated time to read must be at least 1 minute"),
    metaTitle: z
        .string()
        .max(60, "Meta title must be at most 60 characters")
        .optional(),
    metaDescription: z
        .string()
        .max(160, "Meta description must be at most 160 characters")
        .optional(),
});

export type blogValues = z.infer<typeof blogSchema>;
