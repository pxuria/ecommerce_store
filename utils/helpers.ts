import Decimal from "decimal.js";
import axiosInstance from "@/lib/axiosInstance";
import { CartItem } from "@/types";

type ActionFn<T> = () => Promise<T>;

export const getCartItemQuantity = (
  cartItems: CartItem[],
  itemId: string
): number => {
  return cartItems.find((cartItem) => cartItem._id === itemId)?.quantity ?? 0;
};

export const getCartItem = (cartItems: CartItem[], itemId: string) => {
  return cartItems.find((cartItem) => cartItem._id === itemId);
};

export const paymentHandler = async (
  orderId: string,
  amount: number,
  email?: string
) => {
  try {
    const { data } = await axiosInstance.post("payment/request", {
      amount,
      email,
      orderId,
    });
    console.log(data);
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.log(error);
  }
};

export function formatDate(dateString: string, fx?: boolean) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  if (fx) return `${year}-${month}-${day}`;

  return `${year}/${month}/${day}`;
}

export async function asyncHandler<T>(actionFn: ActionFn<T>, errorMsg: string): Promise<T | { error: string }> {
  try {
    return await actionFn();
  } catch (error) {
    console.error(errorMsg, error);
    return { error: errorMsg };
  }
}

export function getFinalPrice(pricePerMeter: Decimal, discountPercent?: Decimal) {
  if (!discountPercent || discountPercent.equals(0)) {
    return pricePerMeter;
  }
  const discountMultiplier = new Decimal(1).minus(discountPercent.div(100));
  return pricePerMeter.mul(discountMultiplier);
}

export const uploadImage = async (file: File | Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await axiosInstance.post("storage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return "";
  }
};