import * as z from "zod";

export const contactUsFormSchema = z.object({
  name: z.string().min(2, "نام شما باید بیشتر از 2 حرف باشد."),
  phone: z.string().regex(/^(\+98|0)?9\d{9}$/, "شماره همراه نامعتبر است."),
  subject: z.string().min(3, "موضوع باید بیشتر از 3 حرف باشد"),
  description: z.string().min(10, "توضیحات باید بیشتر از 10 حرف باشد"),
});

const sizeSchema = z.object({
  name: z.string().min(1, "Product size is required"),
  stockCount: z.string().refine((val) => Number(val) >= 0, {
    message: "Stock count for size must be at least 0",
  }),
  price: z.string().refine((val) => Number(val) >= 0, {
    message: "Price for size must be at least 0",
  }),
});

// Define the color schema
const colorSchema = z.object({
  name: z.string().min(1, "Product color is required"),
  sizes: z
    .array(sizeSchema)
    .min(1, "At least one size is required for each color"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  basePrice: z.string().min(0, "Base product price must be at least 0"),
  stock: z.boolean().default(true),
  category: z.string().min(1, "Category is required"), // Assuming category is a string representing ObjectId
  colors: z.array(colorSchema).min(1, "At least one color is required"),
  image: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "category name is required"),
  enName: z.string().min(1, "category en-name is required"),
});
