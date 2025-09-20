"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import CollapsibleMenu from "../ui/CollapsibleMenu";
import { Button } from "../ui/button";
import { IBrand, ICategory, IColor, ICountry } from "@/types/model";

const Filter = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      setFilterLoading(true);
      try {
        const res = await fetch("/api/filters", { cache: 'no-store' });
        const data = await res.json();
        setBrands(data.brands);
        setCategories(data.categories);
        setCountries(data.countries);
        setColors(data.colors);
      } catch (error) {
        console.log(error)
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilters();
  }, []);

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

  const initialAvailability = useMemo(() => searchParams.get("isActive") === "true", [searchParams]);

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [available, setAvailable] = useState(initialAvailability);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key);

        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else if (value) {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleMultiSelect = useCallback(
    (key: string, id: number) => {
      const existing = searchParams.getAll(key);
      const idStr = String(id);

      let updated: string[];
      if (existing.includes(idStr)) {
        updated = existing.filter((x) => x !== idStr);
      } else {
        updated = [...existing, idStr];
      }

      updateQueryParams({ [key]: updated.length > 0 ? updated : null });
    },
    [searchParams, updateQueryParams]
  );

  const handleCategorySelect = (id: number) => toggleMultiSelect("categoryId", id);
  const handleBrandSelect = (id: number) => toggleMultiSelect("brandId", id);
  const handleCountrySelect = (id: number) => toggleMultiSelect("countryId", id);
  const handleColorSelect = (id: number) => toggleMultiSelect("colorId", id);

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
      updateQueryParams({ isActive: newAvailable ? "true" : null });
      return newAvailable;
    });
  }, [updateQueryParams]);

  return (
    <div className="rounded-xl border border-muted px-4 py-3 bg-[#fff] flex flex-col gap-2">
      <CollapsibleMenu
        title="دسته بندی ها"
        loading={filterLoading}
        items={
          categories.map((i) => ({
            id: i.id,
            name: i.name,
            onClick: () => handleCategorySelect(Number(i.id)),
            checked: searchParams.getAll("categoryId").includes(String(i.id))
          }))}
      />

      <CollapsibleMenu
        title="کشور ها"
        loading={filterLoading}
        items={
          countries.map((i) => ({
            id: i.id,
            name: i.name,
            onClick: () => handleCountrySelect(Number(i.id)),
            checked: searchParams.getAll("countryId").includes(String(i.id))
          }))}
      />

      <CollapsibleMenu
        title="برند ها"
        loading={filterLoading}
        items={
          brands.map((i) => ({
            id: i.id,
            name: i.name,
            onClick: () => handleBrandSelect(Number(i.id)),
            checked: searchParams.getAll("brandId").includes(String(i.id))
          }))}
      />

      <CollapsibleMenu
        title="رنگ ها"
        loading={filterLoading}
        items={
          colors.map((i) => ({
            id: i.id,
            name: i.name,
            onClick: () => handleColorSelect(Number(i.id)),
            checked: searchParams.getAll("colorId").includes(String(i.id))
          }))}
      />

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

      <Button
        type="button"
        className="text-white bg-secondary-700 hover:bg-secondary-800 w-full mt-2"
        onClick={() => {
          updateQueryParams({ page: "1" });
        }}>
        اعمال فیلتر
      </Button>
    </div>
  );
};

export default Filter;
