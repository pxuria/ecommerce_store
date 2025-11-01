/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import { handleShowToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { type IProduct } from "@/types/model";
import DashboardTable, { dateFormat } from "../DashboardTable";
import ProductForm from "./ProductForm";
import Image from "next/image";
import { toJalaliDate } from "@/utils/helpers";
import CustomPagination from "@/components/shared/CustomPagination";
import { SquarePen, SquarePlus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ProductsParams {
    sort: string | null;
    dir: string | null;
    category: string | null;
    brand: string | null;
    search: string | null;
    page: string | null
}

const Products = () => {
    const searchParams = useSearchParams();
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedPrduct, setSelectedProduct] = useState<IProduct | null>();
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 1
    });

    const getParams = useCallback((): ProductsParams => {
        const decode = (val: string | null) => (val ? decodeURIComponent(val) : null);

        return {
            sort: decode(searchParams.get("sort")),
            dir: decode(searchParams.get("dir")),
            category: decode(searchParams.get("category")),
            brand: decode(searchParams.get("brand")),
            search: decode(searchParams.get("name")),
            page: decode(searchParams.get("page")) || "1",
        };
    }, [searchParams]);

    const fetchProducts = useCallback(async (filters: ProductsParams) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("products", { params: filters });

            setProducts(data.data);
            setPagination({
                total: data.pagination.total,
                currentPage: data.pagination.page,
                totalPages: data.pagination.totalPages,
            });
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(getParams());
    }, [searchParams, getParams, fetchProducts]);

    const handleDelete = async () => {
        if (!selectedPrduct?.id) return;
        try {
            await axiosInstance.delete(`products/${selectedPrduct?.id}`);
            handleShowToast("محصول با موفقیت حذف شد.", "success");
            setSelectedProduct(null);
            await fetchProducts(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف محصول.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: IProduct) => {
        setSelectedProduct(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchProducts(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchProducts(getParams());
    };

    const COLUMNS = [
        { title: 'نام محصول', key: 'name', searchable: true, sortable: true, className: 'text-right' },
        {
            title: 'عکس محصول',
            key: 'image',
            render: (_: any, product: IProduct) => (
                <Image
                    width={120}
                    height={80}
                    alt={product?.images?.[0]?.alt ?? product.name}
                    src={product?.images?.[0]?.url ?? '/assets/images/placeholder.webp'}
                    className="rounded-lg object-cover aspect-square"
                />
            ),
            className: 'text-right'
        },
        { title: 'محصول (نشانی کوتاه)', key: 'slug', className: 'text-right' },
        { title: 'دسته بندی محصول', key: 'category.name', searchable: true, sortable: true, className: 'text-right' },
        { title: 'برند محصول', key: 'brand.name', searchable: true, sortable: true, className: 'text-right' },
        { title: 'کشور محصول', key: 'country.name', searchable: true, className: 'text-right' },
        {
            title: 'وضعیت محصول',
            key: 'isActive',
            sortable: true,
            render: (v: any) => (v ? 'فعال' : 'غیرفعال'),
            className: 'text-right'
        },
        {
            title: 'تاریخ ایجاد',
            key: 'createdAt',
            sortable: true,
            render: (v: any) => toJalaliDate(v, dateFormat),
            className: 'text-right'
        },
        {
            title: 'تاریخ حذف',
            key: 'deletedAt',
            className: 'text-right',
            render: (v: any) => toJalaliDate(v, dateFormat),
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, product: IProduct) => (
                <div className="flex_center gap-2">
                    <Button
                        className="bg-primary-500 text-black !text-xs lg:text-base"
                        onClick={() => handleEdit(product)}
                    >
                        <SquarePen className="mr-1" /> ویرایش
                    </Button>
                    <Button
                        className="bg-red-700 text-white !text-xs lg:text-base"
                        onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="mr-1" /> حذف
                    </Button>
                </div>
            ),
        }
    ];

    return (
        <section>
            {formMode === "edit" && selectedPrduct && (
                <ProductForm item={selectedPrduct} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <ProductForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن محصول
                            <SquarePlus />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable
                                data={products}
                                columns={COLUMNS}
                                loading={loading} />
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف محصول"
                            onOk={handleDelete}
                            onOkText="حذف محصول"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
                                    آیا مطمئن هستید که می‌خواهید محصول{" "}
                                    <span className="font-bold text-base md:text-md">{setSelectedProduct?.name}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )
            }

        </section >
    )
}

export default Products;