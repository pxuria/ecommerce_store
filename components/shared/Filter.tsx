"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import RangeSlider from "react-range-slider-input";
import { categories } from "@/constants";
import "react-range-slider-input/dist/style.css";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialPriceRange = useMemo<[number, number]>(
    () => [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 20000000,
    ],
    [searchParams]
  );

  const initialAvailability = useMemo(
    () => searchParams.get("stock") === "true",
    [searchParams]
  );

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [available, setAvailable] = useState(initialAvailability);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleCategorySelect = useCallback(
    (categoryName: string) => {
      updateQueryParams({
        category:
          searchParams.get("category") === categoryName ? null : categoryName,
      });
    },
    [updateQueryParams, searchParams]
  );

  const handlePriceChange = useCallback(
    (newValue: [number, number]) => {
      setPriceRange(newValue);
      updateQueryParams({
        minPrice: String(newValue[0]),
        maxPrice: String(newValue[1]),
      });
    },
    [updateQueryParams]
  );

  const toggleAvailability = useCallback(() => {
    setAvailable((prev) => {
      const newAvailable = !prev;
      updateQueryParams({ stock: newAvailable ? "true" : null });
      return newAvailable;
    });
  }, [updateQueryParams]);

  return (
    <div className="rounded-xl border border-muted px-4 py-3 bg-[#fff]">
      {/* Categories */}
      <div className="mt-4">
        <h5 className="text-base font-medium select-none">دسته بندی ها</h5>
        <div className="overflow-y-hidden overflow-x-auto flex_center flex-wrap gap-4 my-2 py-2">
          {categories.map((item) => {
            const isActive = searchParams.get("category") === item.enName;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleCategorySelect(item.enName)}
                className={`rounded-full min-w-20 h-20 flex_center flex-col group ${
                  isActive ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: item.bg }}
              >
                <Image
                  src={item.icon}
                  alt={item.enName}
                  className="group-hover:scale-110 primary_transition"
                  width={35}
                  height={35}
                />
                <span className="text-sm text-black font-medium">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-4">
        <h5 className="text-base font-medium mb-6 select-none">محدوده قیمت</h5>
        <RangeSlider
          value={priceRange}
          onInput={(newValue) =>
            handlePriceChange(newValue as [number, number])
          }
          step={10000}
          min={0}
          max={20000000}
          id="product_price_range"
        />
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-black text-sm font-medium">
            {priceRange[1].toLocaleString("en-US")} تومان
          </span>
          <span className="text-black text-sm font-medium">
            {priceRange[0].toLocaleString("en-US")} تومان
          </span>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-6 flex items-center justify-start gap-4">
        <label htmlFor="availablity" className="text-base font-medium">
          فقط کالا های موجود
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="availablity"
            className="sr-only peer"
            checked={available}
            onChange={toggleAvailability}
          />
          <div className="group peer bg-white rounded-full duration-300 w-12 h-6 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95"></div>
        </label>
      </div>
    </div>
  );
};

export default Filter;
