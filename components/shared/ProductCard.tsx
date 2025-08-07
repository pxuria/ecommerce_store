"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineBookmarkBorder, MdOutlineBookmark } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { enBrandName } from "@/constants";

interface Props {
  imgSrc: string;
  imgAlt: string;
  imgWidth: number;
  imgHeight: number;
  title: string;
  link: string;
  price: number;
  stock: boolean;
  margin?: boolean;
}

const ProductCard = ({
  imgSrc,
  imgAlt,
  stock,
  imgWidth,
  imgHeight,
  title,
  link,
  price,
  margin,
}: Props) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((prev) => !prev);
  };

  return (
    <div className={`flex-column items-center ${margin && "mx-2"}`}>
      <div className="rounded-2xl overflow-hidden pb-2 px-2 pt-2 border border-muted bg-[#fff] shadow-md">
        <div className="relative overflow-hidden rounded-lg">
          <div className="relative">
            <button
              className="absolute right-3 top-3 bg-[#f9fafbb3] hover:bg-[#f8f9fa] primary_transition cursor-pointer rounded-full p-2 z-40"
              onClick={handleBookmark}
              aria-label="save product"
              name="save"
              type="button"
            >
              {bookmarked ? (
                <MdOutlineBookmark className="w-5 h-5" />
              ) : (
                <MdOutlineBookmarkBorder className="w-5 h-5" />
              )}
            </button>
            <div className="group relative z-0">
              <div className="carousel_item_img flex_center">
                <Image
                  src="/assets/images/outlined_logo.png"
                  alt={enBrandName}
                  width={435}
                  height={142}
                  className="w-16 h-5"
                />
              </div>

              <Image
                unoptimized
                src={imgSrc}
                alt={imgAlt}
                width={imgWidth}
                height={imgHeight}
                className="object-cover h-[15.5rem] rounded-3xl group-hover:rounded-2xl w-[20rem] transition-all ease-in duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap mt-2">
          <Link href={`products/${link}`}>
            <h4 className="text-black text-base font-medium text-right mt-2">
              {title}
            </h4>
          </Link>

          <span
            className={`text-xs font-medium text-nowrap border-2 px-3 py-[2px] flex_center rounded-md ${stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {stock ? "موجود" : "ناموجود"}
          </span>
        </div>

        <div className="flex items-center justify-end mt-3">
          <div className="flex items-end gap-1">
            <span className="text-lg font-bold">
              {price.toLocaleString("en-US")}
            </span>
            <span className="text-black text-base font-bold">تومان</span>
          </div>

          {/* <button
              className="bg-black p-2 rounded-md overflow-hidden flex items-center justify-center active:scale-110 transition-all ease-in"
              type="button"
              onClick={showCartHandler}
            >
              <FiShoppingBag className="w-5 h-5 text-white" />
            </button> */}
        </div>

        <Link
          href={`products/${link}`}
          className="block rounded-lg overflow-hidden w-full h-10 text-sm font-medium bg-pink text-white mt-2 flex_center gap-2"
        >
          <FiShoppingBag className="w-5 h-5 text-white" />
          مشاهده محصول
        </Link>
      </div>
    </div>
  );
};

export default memo(ProductCard);
