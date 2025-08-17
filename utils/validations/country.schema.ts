import { z } from "zod";

export const CountrySchema = z.object({
    name: z.string().min(1, "name is required"),
    slug: z.string().min(1, "slug is required")
});

export type countryValues = z.infer<typeof CountrySchema>;