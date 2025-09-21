"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Bookmark, ShoppingBag } from "lucide-react";
import { IProductWithBasePrice } from "@/types/model";
// import { enBrandName } from "@/constants";

const ProductCard = ({ product }: { product: IProductWithBasePrice }) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBookmark = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);

      const method = bookmarked ? "DELETE" : "POST";

      const res = await fetch("/api/users/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (res.status === 401) {
        toast.success("خروج از حساب با موفقیت انجام شد.")
        alert("ابتدا وارد حساب کاربری شوید");
        return;
      }

      if (!res.ok) {
        const error = await res.json();
        alert(error?.message || "خطا در ذخیره محصول");
        return;
      }

      // Toggle on success
      setBookmarked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("خطایی رخ داد، دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex-column items-center`}>
      <div className="rounded-2xl overflow-hidden pb-2 px-2 pt-2 border border-muted bg-[#fff] shadow-md">
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative">
            <button
              className="absolute right-3 top-3 bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
              onClick={handleBookmark}
              aria-label="save product"
              disabled={loading}
              type="button"
              name="save"
            >
              <Bookmark size={20} fill={bookmarked ? '' : "#000"} />
            </button>
            <div className="group relative z-0">
              <div className="carousel_item_img flex_center">
                <h4 className="font-bold text-white md:text-black">Arshianbaft</h4>
                {/* <Image
                  src="/assets/images/outlined_logo.png"
                  alt={enBrandName}
                  width={435}
                  height={142}
                  className="w-16 h-5"
                /> */}
              </div>

              {product.discountPercent > 0 &&
                <span className="absolute bottom-3 right-3 z-30 bg-secondary-600 text-white text-xs font-medium py-1 px-2 rounded-lg">
                  {product.discountPercent}% تخفیف
                </span>
              }

              <Image
                unoptimized
                src={product.images[0].url}
                alt={product.images[0].alt}
                width={1500}
                height={900}
                className="object-cover h-[15.5rem] rounded-3xl group-hover:rounded-2xl w-[20rem] transition-all ease-in duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap mt-2">
          <Link href={`products/${product.id}`}>
            <h4 className="text-black text-base font-medium text-right mt-2">
              {product.name}
            </h4>
          </Link>

          <span
            className={`text-xs font-medium text-nowrap border-2 px-3 py-[2px] flex_center rounded-md ${product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {product.isActive ? "موجود" : "ناموجود"}
          </span>
        </div>

        <div className="flex items-center justify-end mt-3">
          {product.discountPercent > 0 ? (
            <div className="flex flex-col items-end">
              <div className="flex items-end gap-1">
                <span className="text-sm text-gray-500 line-through">
                  {product.basePrice.toLocaleString("en-US")}
                </span>
                <span className="text-black text-sm">تومان</span>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-lg font-bold text-red-600">
                  {product.finalPrice.toLocaleString("en-US")}
                </span>
                <span className="text-black text-base font-bold">تومان</span>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-1">
              <span className="text-lg font-bold">
                {product.basePrice.toLocaleString("en-US")}
              </span>
              <span className="text-black text-base font-bold">تومان</span>
            </div>
          )}
        </div>

        <Link
          href={`products/${product.id}`}
          className="block rounded-lg overflow-hidden w-full h-10 text-sm font-medium bg-secondary-600 hover:bg-secondary-700 transition-all ease-in text-white mt-2 flex_center gap-2"
        >
          <ShoppingBag className="text-white w-5 h-5" />
          مشاهده محصول
        </Link>
      </div>
    </div>
  );
};

export default memo(ProductCard);
