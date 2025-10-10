"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, ShoppingBag } from "lucide-react";
import { IProductWithBasePrice } from "@/types/model";
import { handleShowToast } from "@/lib/toast";
// import { enBrandName } from "@/constants";

interface Props {
  product: IProductWithBasePrice;
  itemClass?: string;
}

const ProductCard = ({ product, itemClass = "" }: Props) => {
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
        handleShowToast('خروج از حساب با موفقیت انجام شد');
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

  const tags = [
    { label: product.brand?.name, key: "brandId", value: product.brand?.id },
    { label: product.category?.name, key: "categoryId", value: product.category?.id },
    { label: product.country?.name, key: "countryId", value: product.country?.id },
  ];

  return (
    <div className={itemClass}>
      <div className={`rounded-2xl overflow-hidden pb-2 px-2 pt-2 border border-muted bg-[#fff] shadow-none sm:shadow-md`}>
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
                <h4 className="font-bold text-white md:text-black hidden sm:block">Arshianbaft</h4>
                {/* <Image
                  src="/assets/images/outlined_logo.png"
                  alt={enBrandName}
                  width={435}
                  height={142}
                  className="w-16 h-5"
                /> */}
              </div>

              {product.discountPercent > 0 &&
                <span className="absolute bottom-3 right-3 z-30 bg-secondary-600 text-white text-[10px] sm:text-xs font-medium py-1 px-2 rounded-lg">
                  {product.discountPercent}% تخفیف
                </span>
              }

              <Image
                unoptimized
                src={product.images[0].url}
                alt={product.images[0].alt}
                width={900}
                height={900}
                className="object-cover h-[8rem] sm:h-[10rem] md:h-[15rem] rounded-3xl group-hover:rounded-2xl w-full transition-all ease-in duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start gap-1 md:gap-2 flex-wrap mt-2">
          {tags.filter(item => item.label && item.value)
            .map((item, idx) => (
              <Link
                key={idx}
                href={`/products?${item.key}=${item.value}&page=1`}
                className='text-white bg-secondary-500 font-semibold text-[10px] sm:text-xs px-2 md:px-3 py-1 rounded-lg'
              >
                {item.label}
              </Link>
            ))}
        </div>

        <div className="flex items-end justify-between gap-0 sm:gap-2 md:gap-4 flex-wrap mt-0 sm:mt-2">
          <Link href={`products/${product.id}`}>
            <h4 className="text-black text-sm sm:text-base font-medium text-right mt-2">
              {product.name}
            </h4>
          </Link>

          <span
            className={`text-[10px] sm:text-xs font-medium text-nowrap border-2 px-3 py-[2px] flex_center rounded-md ${product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {product.isActive ? "موجود" : "ناموجود"}
          </span>
        </div>

        <div className="flex items-center justify-end mt-3">
          {product.discountPercent > 0 ? (
            <div className="flex flex-col items-end">
              <div className="flex items-end gap-1">
                <span className="text-xs sm:text-sm text-red-400 line-through">
                  {product.basePrice.toLocaleString("en-US")}
                </span>
                <span className="text-black text-sm">تومان</span>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-base sm:text-lg font-bold text-secondary-700">
                  {product.finalPrice.toLocaleString("en-US")}
                </span>
                <span className="text-black text-sm sm:text-base font-bold">تومان</span>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-1">
              <span className="text-base sm:text-lg font-bold">
                {product.basePrice.toLocaleString("en-US")}
              </span>
              <span className="text-black text-sm sm:text-base font-bold">تومان</span>
            </div>
          )}
        </div>

        <Link
          href={`products/${product.id}`}
          className="block rounded-lg overflow-hidden w-full h-10 text-xs sm:text-sm md:text-base font-medium bg-secondary-600 hover:bg-secondary-700 transition-all ease-in text-white mt-2 flex_center gap-1 md:gap-2 text-nowrap"
        >
          <ShoppingBag className="text-white w-4 h-4 md:w-5 md:h-5" />
          مشاهده محصول
        </Link>
      </div>
    </div>
  );
};

export default memo(ProductCard);
