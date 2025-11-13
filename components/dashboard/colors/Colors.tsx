/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, SquarePen, SquarePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IColor } from "@/types/model";
import CustomPagination from "@/components/shared/CustomPagination";
import DashboardTable from "../DashboardTable";
import ColorForm from "./ColorForm";

const Colors = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [colors, setColors] = useState<IColor[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColor | null>(null);
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

    const fetchColors = useCallback(async (filters: Record<any, string | null>) => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('colors', { params: filters });

            setColors(Array.isArray(data.data) ? data.data : []);
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
        fetchColors(getParams());
    }, [fetchColors, getParams])

    const handleDelete = async () => {
        if (!selectedColor?.id) return;
        try {
            await axiosInstance.delete(`colors/${selectedColor?.id}`);
            handleShowToast("رنگ با موفقیت حذف شد.", "success");
            setSelectedColor(null);
            await fetchColors(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف رنگ.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: IColor) => {
        setSelectedColor(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchColors(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchColors(getParams());
    };

    const COLUMNS = [
        {
            title: 'نام رنگ',
            key: 'name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'کد رنگ',
            key: 'hex',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'رنگ',
            key: 'color_name',
            className: 'text-right',
            render: (_: any, color: IColor) => (
                <div
                    className={`w-8 h-8 rounded border border-[#b7b1b1] flex_center font-bold ${!color.hex && "bg-gray-200"}`}
                    style={{ backgroundColor: color.hex || "#fff" }}
                >
                    {!color.hex && '?'}
                </div>
            )
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, color: IColor) => (
                <div className="flex_center gap-2">
                    <Button
                        className="bg-primary-500 text-black !text-xs lg:text-base"
                        onClick={() => handleEdit(color)}
                    >
                        <SquarePen className="mr-1" /> ویرایش
                    </Button>
                    <Button
                        className="bg-red-700 text-white !text-xs lg:text-base"
                        onClick={() => {
                            setSelectedColor(color);
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
            {formMode === "edit" && selectedColor && (
                <ColorForm item={selectedColor} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <ColorForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <div className="flex items-center gap-2 mb-8">
                            <Button
                                onClick={handleAdd}
                                className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن رنگ
                                <SquarePlus />
                            </Button>

                            <Button
                                size='icon'
                                onClick={() => fetchColors(getParams())}
                                className="text-white bg-secondary-700 aspect-square text-base">
                                <RefreshCw />
                            </Button>
                        </div>

                        {/* Colors Table */}
                        <div className="rounded-md border">
                            <DashboardTable
                                data={colors}
                                loading={loading}
                                columns={COLUMNS} />
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف رنگ"
                            onOk={handleDelete}
                            onOkText="حذف رنگ"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-black">
                                    آیا مطمئن هستید که می‌خواهید رنگ{" "}
                                    <span className="font-bold text-base md:text-md">{selectedColor?.name}</span>{" "}
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

export default Colors;