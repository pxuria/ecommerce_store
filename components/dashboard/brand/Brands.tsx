/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, SquarePen, SquarePlus, Trash2 } from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IBrand } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CustomPagination from "@/components/shared/CustomPagination";
import BrandForm from "./BrandForm";
import DashboardTable from "../DashboardTable";

const Brands = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>();
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 1
    });

    const searchParams = useSearchParams();

    const getParams = useCallback((): Record<any, string | null> => {
        const params: Record<string, string | null> = {};
        searchParams.forEach((value, key) => {
            params[key] = decodeURIComponent(value);
        });

        return {
            page: params.page || "1",
            limit: params.limit || "20",
            ...params,
        };
    }, [searchParams]);


    const fetchBrands = useCallback(async (filters: Record<any, string | null>) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`brands`, { params: filters });
            setBrands(data.data);
            setPagination({
                total: data.pagination.total,
                currentPage: data.pagination.page,
                totalPages: data.pagination.totalPages
            });
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands(getParams());
    }, [fetchBrands, getParams])

    const handleDelete = async () => {
        if (!selectedBrand?.id) return;
        try {
            await axiosInstance.delete(`brands/${selectedBrand?.id}`);
            handleShowToast("برند با موفقیت حذف شد.", "success");
            setSelectedBrand(null);
            await fetchBrands(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف برند.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: IBrand) => {
        setSelectedBrand(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchBrands(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchBrands(getParams());
    };

    const COLUMNS = [
        {
            title: 'نام برند',
            key: 'name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'برند (نشانی کوتاه)',
            key: 'slug',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, brand: IBrand) => (
                <div className="flex_center gap-2">
                    <Button
                        className="bg-primary-500 text-black !text-xs lg:text-base"
                        onClick={() => handleEdit(brand)}
                    >
                        <SquarePen className="mr-1" /> ویرایش
                    </Button>
                    <Button
                        className="bg-red-700 text-white !text-xs lg:text-base"
                        onClick={() => {
                            setSelectedBrand(brand);
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
            {formMode === "edit" && selectedBrand && (
                <BrandForm item={selectedBrand} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <BrandForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <div className="flex items-center gap-2 mb-8">
                            <Button
                                onClick={handleAdd}
                                className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن برند
                                <SquarePlus />
                            </Button>

                            <Button
                                size='icon'
                                onClick={() => fetchBrands(getParams())}
                                className="text-white bg-secondary-700 aspect-square text-base">
                                <RefreshCw />
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <DashboardTable
                                data={brands}
                                loading={loading}
                                columns={COLUMNS} />
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف برند"
                            onOk={handleDelete}
                            onOkText="حذف برند"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md">
                                    آیا مطمئن هستید که می‌خواهید برند{" "}
                                    <span className="font-bold text-base md:text-md">{selectedBrand?.name}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )}

        </section>
    )
}

export default Brands;