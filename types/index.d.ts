import { Prisma } from "@prisma/client";

export type ParamsType = { params: { id: string } };
export type FileWithPreview = File & { preview: string };

export interface childrenProp {
  children: React.ReactNode;
}

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

export interface CartItem {
  id: string;
  name: string;
  productId: string;
  quantity: number;
  color: string;
  discount: number;
  discountedPrice: number;
  unitPrice: number;
  coverImage: string;
  total: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}

export interface ISideBlogs {
  id: string;
  wallpaper: string;
  title: string;
  author: { _id: string; first_name: string; last_name: string };
  createdAt: string;
}