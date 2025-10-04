'use client';

import { useEffect, useState } from "react";
import { IProductWithBasePrice } from "@/types/model";
import productLoading from "@/public/assets/lotties/product-loading.json";
import ProductCard from "../shared/ProductCard"
import LottieText from "../shared/LottieText";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const ProductsList = () => {
    const [products, setProducts] = useState<IProductWithBasePrice[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            try {
                const res = await fetch(`/api/products?limit=16&sortBy=createdAt&sortOrder=desc`);
                const data = await res.json();

                setProducts(data.data || []);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [])

    return (
        <section className='my-10 w-full py-6 px-4 sm:px-10' aria-label='محصولات'>
            <div className='flex items-center justify-between px-4 sm:px-10 mb-8'>
                <h3 className='font-bold text-2xl text-black title relative select-none'>
                    محصولات
                </h3>
                <Link className='flex items-end gap-1 text-black font-normal text-base'
                    href={'/products'}>
                    مشاهده همه
                    <ChevronLeft size={16} />
                </Link>
            </div>

            <div className="w-full flex items-start justify-start gap-2 sm:gap-4 flex-wrap">
                {loading
                    ? <LottieText text="در حال بارگذاری" itemClass="w-64 h-64" file={productLoading} />
                    : (products.length && (
                        <div className="w-full flex items-start justify-start gap-2 sm:gap-4 flex-wrap">
                            {products?.map((item: IProductWithBasePrice) => (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    itemClass='w-[calc(50%-8px)] sm:w-[calc(50%-16px)] lg:w-[calc(33%-16px)] xl:w-[calc(25%-8px)]'
                                />
                            ))}
                        </div>
                    ))}
            </div>
        </section >
    )
}

export default ProductsList