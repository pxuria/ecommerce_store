'use client';

import { useEffect, useState } from "react";
import LottieText from "../shared/LottieText";
import ProductCard from "../shared/ProductCard";
import noProduct from "@/public/assets/lotties/no_product2.json";
import productLoading from "@/public/assets/lotties/product-loading.json";
import CustomPagination from "../shared/CustomPagination";
import { IProductWithBasePrice } from "@/types/model";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1
  });

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);

      try {
        const res = await fetch('/api/users/favorites');
        const data = await res.json();

        setBookmarks(data.data || []);
        setPagination({
          total: data.pagination?.total || 0,
          currentPage: data.pagination?.page || 1,
          totalPages: data.pagination?.totalPages || 1,
        });
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [])

  return <div className="">
    {loading
      ? <LottieText text="در حال بارگذاری" itemClass="w-64 h-64" file={productLoading} />
      : (bookmarks.length ? (
        <div className="w-full flex items-start justify-between gap-2 sm:gap-4 flex-wrap">
          {bookmarks?.map((item: IProductWithBasePrice) => (
            <ProductCard
              key={item.id}
              product={item}
              itemClass='w-[calc(50%-8px)] sm:w-[calc(50%-16px)] lg:w-[calc(33%-16px)] xl:w-[calc(25%-8px)]'
            />
          ))}
        </div>
      )
        : <LottieText text="محصولی یافت نشد." file={noProduct} />)}

    <CustomPagination pagination={pagination} />
  </div>;
};

export default Bookmarks;
