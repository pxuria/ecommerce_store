import { z } from "zod";

export const ColorSchema = z.object({
    name: z.string().min(1, "color is required"),
    hex: z.string().optional()
});

export type colorValues = z.infer<typeof ColorSchema>;