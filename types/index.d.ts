import { productSchema } from "@/utils/validations";

export interface childrenProp {
  children: React.ReactNode;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string[];
  quantity: number;
  price: number;
  color: string;
  size: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface ISize {
  name: string;
  stockCount: number;
  price: number;
}

export type ProductFormValues = z.infer<typeof productSchema>;

export type FileWithPreview = File & { preview: string };

export interface ISideBlogs {
  id: string;
  wallpaper: string;
  title: string;
  author: { _id: string; first_name: string; last_name: string };
  createdAt: string;
}

export type ParamsType = { params: { id: string } };