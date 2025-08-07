"use client";

import { useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
  };
}

const CustomPagination = ({ pagination }: Props) => {
  const { totalPages, currentPage } = pagination;
  const pagesArray = [...Array(totalPages)].map((_, i) => i + 1);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-8 mb-4">
      <Pagination>
        <PaginationContent>
          {/* next page */}
          {currentPage !== totalPages && (
            <PaginationItem>
              <PaginationNext href={createPageUrl(currentPage + 1)} />
            </PaginationItem>
          )}

          {pagesArray.reverse().map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={createPageUrl(page)}
                    isActive={page === currentPage}
                    className={`${
                      page === currentPage
                        ? "bg-pink_500 text-white"
                        : "bg-light_muted hover:bg-muted text-black transition-all ease-in"
                    } flex_center rounded w-8 h-8`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (page === 2 && currentPage > 3) {
              return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return (
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return null;
          })}

          {/* prev page */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={createPageUrl(currentPage - 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
