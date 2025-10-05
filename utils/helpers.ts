import Decimal from "decimal.js";
import moment from "moment-jalaali";
import axiosInstance from "@/lib/axiosInstance";
import { CartItem, ParamsType } from "@/types";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import slugify from "slugify";

type ActionFn<T> = () => Promise<T> | T;
interface AsyncHandlerOptions {
  auth?: boolean;
  successStatus?: number;
  errorMsg?: string;
}

export const getCartItemQuantity = (
  cartItems: CartItem[],
  itemId: string
): number => {
  return cartItems.find((cartItem) => cartItem.id === itemId)?.quantity ?? 0;
};

export const getCartItem = (cartItems: CartItem[], itemId: string) => {
  return cartItems.find((cartItem) => cartItem.id === itemId);
};

export const paymentHandler = async (
  orderId: string,
  amount: number,
  email?: string,
  mobile?: string,
) => {
  try {
    const { data } = await axiosInstance.post("payment/request", {
      amount,
      email,
      orderId,
      mobile
    });
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

export async function asyncHandler<T>(
  actionFn: ActionFn<T>,
  options: AsyncHandlerOptions = {}
): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    await connectDB();

    if (options.auth) {
      if (!(await isAdmin())) {
        return NextResponse.json({ success: false, error: "Access denied: Unauthorized" }, { status: 403 });
      }
    }

    const data = await actionFn();

    return NextResponse.json({ success: true, ...data }, { status: options.successStatus || 200 });
  } catch (error: unknown) {
    console.error(options.errorMsg ?? "Server Error:", error);

    let message = options.errorMsg ?? "Unknown error";
    let status = 500;

    if (error instanceof HttpError) {
      message = error.message;
      status = error.status;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function parseId(params: ParamsType["params"]) {
  const id = Number(params.id);
  if (isNaN(id)) throw new HttpError("Invalid product ID", 400);
  return id;
}

export function getChangedFields(original: { [x: string]: unknown; }, updated: { [x: string]: unknown; }) {
  const changes: Record<string, unknown> = {};

  for (const key in updated) {
    const originalValue = original?.[key];
    const updatedValue = updated[key];

    // ✅ Handle arrays (e.g., images, colorVariants, attributes)
    if (Array.isArray(originalValue) || Array.isArray(updatedValue)) {
      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes[key] = updatedValue;
      }
    }
    // ✅ Handle objects (deep compare if needed)
    else if (typeof originalValue === "object" && typeof updatedValue === "object") {
      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes[key] = updatedValue;
      }
    }
    // ✅ Handle primitives
    else if (originalValue !== updatedValue) {
      changes[key] = updatedValue;
    }
  }

  return changes;
}


export async function asyncHandler2<T>(actionFn: ActionFn<T>, errorMsg: string): Promise<T | { error: string }> {
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

export const uploadImage = async (files: (File | Blob)[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file, i) => {
    formData.append(`file-${i + 1}`, file);
  });

  try {
    const { data } = await axiosInstance.post("storage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(data)
    return data.urls || [];
  } catch (error) {
    console.error("Image upload failed:", error);
    return [""];
  }
};

export const toJalaliDate = (
  isoDate: string | Date,
  format: string = "jYYYY/jMM/jDD HH:mm"
): string => {
  if (!isoDate) return "";
  return moment(isoDate).format(format);
};

export const toSlug = (slug: string) => slugify(slug, { lower: true, strict: true });