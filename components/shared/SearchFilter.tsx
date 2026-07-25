"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SearchFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleFilters = () => {
    const isFiltersVisible = searchParams.get("showFilters") === 'true';
    updateQueryParams({ showFilters: isFiltersVisible ? null : 'true' });
  };

  const handleSearch = () => {
    if (searchQuery.trim().length === 0) updateQueryParams({ search: null });
    else updateQueryParams({ search: searchQuery.trim() });
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        type="button"
        onClick={toggleFilters}
        className="text-nowrap text-white bg-secondary-600 hover:bg-secondary-700 px-4 py-2 rounded-lg h-[40px]"
      >
        فیلتر ها
      </button>

      <div className="flex flex-nowrap w-full">
        <input
          id="search"
          type="search"
          name="search"
          placeholder="جستجو..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full rounded-r-lg outline-none border border-light_muted px-4"
        />
        <button
          type="button"
          aria-label="search"
          onClick={handleSearch}
          className="bg-light_muted px-3 py-2 rounded-l duration-500 h-10 w-10 hover:bg-muted flex_center btn"
        >
          <Search />
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
