'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CustomPagination from "@/components/shared/CustomPagination";
import LottieText from "@/components/shared/LottieText";
import noProduct from "@/public/assets/lotties/no_product2.json";
import productLoading from "@/public/assets/lotties/product-loading.json";
import { IBlog } from "@/types/model";
import BlogCard from "./blogs/BlogCard";

const BlogsList = () => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 1
    });
    const searchParams = useSearchParams();
    const productQuery = (() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("showFilters");
        return params.toString();
    })();

    useEffect(() => {
        const fetchblogs = async () => {
            setLoading(true);

            try {
                const res = await fetch(`/api/blogs?isPublished=true&${productQuery}`);
                const data = await res.json();

                setBlogs(data.data || []);
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

        fetchblogs();
    }, [productQuery])


    return (
        <section className="px-4 md:px-14 mt-10 min-h-[85vh] flex-column items-center justify-between">
            <div className="w-full flex items-start justify-center gap-4 flex-wrap md:flex-nowrap px-0 md:px-4">
                <div className='flex items-center justify-end gap-4 flex-wrap md:px-2 w-full'>
                    {loading
                        ? <LottieText text="در حال بارگذاری" itemClass="w-64 h-64" file={productLoading} />
                        : (blogs.length ? (
                            <div className="w-full flex items-stretch justify-start gap-2 sm:gap-4 flex-wrap">
                                {blogs?.map((item: IBlog) => (
                                    <BlogCard
                                        key={item.id}
                                        blog={item}
                                        itemClass='w-[calc(50%-8px)] sm:w-[calc(50%-16px)] lg:w-[calc(33%-16px)] xl:w-[calc(25%-8px)]'
                                    />
                                ))}
                            </div>
                        )
                            : <LottieText text="بلاگی یافت نشد." file={noProduct} />)}
                </div>
            </div>

            <CustomPagination pagination={pagination} />
        </section>
    );
};

export default BlogsList;