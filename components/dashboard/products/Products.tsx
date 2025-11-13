/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { RefreshCw, SquarePen, SquarePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CustomPagination from "@/components/shared/CustomPagination";
import { handleShowToast } from "@/lib/toast";
import { type IProduct } from "@/types/model";
import { toJalaliDate } from "@/utils/helpers";
import axiosInstance from "@/lib/axiosInstance";
import DashboardTable, { dateFormat } from "../DashboardTable";
import ProductForm from "./ProductForm";

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

    const getParams = useCallback((): Record<any, string | null> => {
        const decode = (val: string | null) => (val ? decodeURIComponent(val) : null);

        return {
            sortBy: decode(searchParams.get("sortBy")),
            dir: decode(searchParams.get("dir")),
            name: decode(searchParams.get("name")),
            category_name: decode(searchParams.get("category_name")),
            brand_name: decode(searchParams.get("brand_name")),
            country_name: decode(searchParams.get("country_name")),
            isActive: decode(searchParams.get("isActive")),
            page: decode(searchParams.get("page")) || "1",
        };
    }, [searchParams]);

    const fetchProducts = useCallback(async (filters: Record<any, string | null>) => {
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
    }, [getParams, fetchProducts]);

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
        {
            title: 'نام محصول',
            key: 'name',
            searchable: true,
            sortable: true,
            className: 'text-right'
        },
        {
            title: 'عکس محصول',
            key: 'image',
            render: (_: any, product: IProduct) => (
                <Image
                    width={100}
                    height={75}
                    alt={product?.images?.[0]?.alt ?? product.name}
                    src={product?.images?.[0]?.url ?? '/assets/images/placeholder.webp'}
                    className="rounded-lg object-cover aspect-square h-[100px]"
                />
            ),
            className: 'text-right'
        },
        {
            title: 'محصول (نشانی کوتاه)',
            key: 'slug',
            className: 'text-right'
        },
        {
            title: 'دسته بندی محصول',
            key: 'category_name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'برند محصول',
            key: 'brand_name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'کشور محصول',
            key: 'country_name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'وضعیت محصول',
            key: 'isActive',
            searchItems: [
                { key: 'فعال', value: 'true' },
                { key: 'غیر فعال', value: 'false' },
                { key: 'همه', value: ' ' }
            ],
            className: 'text-right',
            render: (_: any, product: IProduct) => (
                <span className={product.isActive ? 'text-green-400' : 'text-red-400'}>
                    {product.isActive ? 'فعال' : 'غیر فعال'}
                </span>
            )
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
                        <div className="flex items-center gap-2 mb-8">
                            <Button
                                onClick={handleAdd}
                                className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن محصول
                                <SquarePlus />
                            </Button>

                            <Button
                                size='icon'
                                onClick={() => fetchProducts(getParams())}
                                className="text-white bg-secondary-700 aspect-square text-base">
                                <RefreshCw />
                            </Button>
                        </div>

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