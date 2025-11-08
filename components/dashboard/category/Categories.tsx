/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { ICategory } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CategoryForm from "./CategoryForm";
import DashboardTable from "../DashboardTable";
import CustomPagination from "@/components/shared/CustomPagination";
import { SquarePen, SquarePlus, Trash2 } from "lucide-react";


const Categories = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>();
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

    const fetchCategories = useCallback(async (filters: Record<any, string | null>) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('categories', { params: filters });
            setCategories(Array.isArray(data.data) ? data.data : []);
            setPagination({
                total: data.pagination.total,
                currentPage: data.pagination.page,
                totalPages: data.pagination.totalPages
            });
        } catch (error) {
            console.log(error);
            if (error instanceof Error) handleShowToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories(getParams());
    }, [fetchCategories, getParams])

    const handleDelete = async () => {
        if (!selectedCategory?.id) return;
        try {
            await axiosInstance.delete(`categories/${selectedCategory?.id}`);
            handleShowToast("دسته بندی با موفقیت حذف شد.", "success");
            setSelectedCategory(null);
            await fetchCategories(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف دسته بندی.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: ICategory) => {
        setSelectedCategory(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchCategories(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchCategories(getParams());
    };


    const COLUMNS = [
        {
            title: 'نام دسته بندی',
            key: 'name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'دسته بندی (نشانی کوتاه)',
            key: 'slug',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, category: ICategory) => (
                <div className="flex_center gap-2">
                    <Button
                        className="bg-primary-500 text-black !text-xs lg:text-base"
                        onClick={() => handleEdit(category)}
                    >
                        <SquarePen className="mr-1" /> ویرایش
                    </Button>
                    <Button
                        className="bg-red-700 text-white !text-xs lg:text-base"
                        onClick={() => {
                            setSelectedCategory(category);
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
            {formMode === "edit" && selectedCategory && (
                <CategoryForm item={selectedCategory} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <CategoryForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن دسته بندی
                            <SquarePlus />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable
                                data={categories}
                                loading={loading}
                                columns={COLUMNS} />
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف دسته بندی"
                            onOk={handleDelete}
                            onOkText="حذف دسته بندی"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md">
                                    آیا مطمئن هستید که می‌خواهید دسته بندی{" "}
                                    <span className="font-bold text-base md:text-md">{selectedCategory?.name}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )}

        </section>
    )
}

export default Categories;