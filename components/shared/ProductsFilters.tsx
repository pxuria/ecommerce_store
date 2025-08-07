"use client";

import { useCallback, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const ProductsFilters = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

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

  const toggleFilters = () => {
    const isFiltersVisible = searchParams.get("showFilters") === "true";
    updateQueryParams({ showFilters: isFiltersVisible ? null : "true" });
  };

  const handleSearch = () => updateQueryParams({ search: searchQuery || null });

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        type="button"
        className="text-nowrap text-white bg-purple-500 px-4 py-2 rounded-lg"
        onClick={toggleFilters}
      >
        فیلتر ها
      </button>

      <div className="flex flex-nowrap w-full">
        <input
          type="search"
          className="w-full rounded-r-lg outline-none border border-light_muted px-4"
          placeholder="جستجو محصولات"
          name="search"
          id="search"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-light_muted px-3 py-2 rounded-l duration-500 h-10 w-10 hover:bg-muted flex_center btn"
          type="button"
          aria-label="search"
          onClick={handleSearch}
        >
          <FiSearch />
        </button>
      </div>
    </div>
  );
};

export default ProductsFilters;
