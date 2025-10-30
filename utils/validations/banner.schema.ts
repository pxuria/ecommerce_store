import { z } from "zod";

export const bannerSchema = z.object({
    image: z.union([
        z.instanceof(File),
        z.string().url("Invalid image URL"),
    ]),
    alt: z.string().optional(),
    displayOrder: z.coerce.number().optional(),
    isActive: z.boolean().default(true)
});

export type bannerValues = z.infer<typeof bannerSchema>;