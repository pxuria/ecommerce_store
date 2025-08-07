import { productSchema } from "@/utils/validations";
import { Document } from "mongoose";

export interface childrenProp {
  children: React.ReactNode;
}

export type ProductFilter = {
  name?: { $regex: string; $options: string };
  stock?: string;
  category?: mongoose.Types.ObjectId;
  basePrice?: { $gte?: number; $lte?: number };
};

export interface CartItem {
  _id: string;
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

export interface IColor extends Document {
  name: string;
  sizes: ISize[];
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  basePrice: number;
  stock: boolean;
  category: Schema.Types.ObjectId;
  colors: IColor[];
  image: string[];
}

export interface ITransaction extends Document {
  _id?: string;
  userId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  amount: number;
  status: "Pending" | "Success" | "Failed";
  transactionId: string;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  enName: string;
}

export interface IOrder extends Document {
  _id?: string;
  userId: Types.ObjectId;
  items: {
    productId: string;
    name: string;
    color?: string;
    size?: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "pending" | "paid" | "failed";
  tracking_code: string;
  paymentAuthority: string;
  isVerified: boolean;
}

export interface IUser extends Document {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
  bookmarks: Schema.Types.ObjectId[];
  address: string;
  city: string;
  postal_code: string;
  instagram: string;
  comparePassword(password: string): Promise<boolean>;
}

export type ProductFormValues = z.infer<typeof productSchema>;

export interface FileWithPreview extends File {
  preview: string;
}

export interface IBlog extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  wallpaper: string;
  estimatedTimeToRead: number;
  metaTitle: string;
  metaDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogUser {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; first_name: string; last_name: string };
  wallpaper: string;
  estimatedTimeToRead: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISideBlogs {
  _id: string;
  wallpaper: string;
  title: string;
  author: { _id: string; first_name: string; last_name: string };
  createdAt: string;
}