'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SquarePen, SquarePlus, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IColor } from "@/types/model";
import DashboardTable, { renderSkeletonRows } from "../DashboardTable";
import ColorForm from "./ColorForm";
import CustomPagination from "@/components/shared/CustomPagination";

const COLUMNS = [
    { title: 'نام رنگ', className: 'text-right' },
    { title: 'کد رنگ', className: 'text-right' },
    { title: 'رنگ', className: 'text-right' },
    { title: 'عملیات', className: 'text-center' }
];

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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;

    const fetchColors = useCallback(async () => {
        console.log(1)
        setLoading(true);
        try {
            const res = await fetch(`/api/colors?page=${page}&limit=${limit}`);
            const data = await res.json();
            console.log(data)
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
    }, [page, limit]);

    useEffect(() => {
        fetchColors();
    }, [fetchColors])

    const handleDelete = async () => {
        if (!selectedColor?.id) return;
        try {
            await axiosInstance.delete(`colors/${selectedColor?.id}`);
            handleShowToast("رنگ با موفقیت حذف شد.", "success");
            setSelectedColor(null);
            await fetchColors();
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

    const handleCancelForm = () => {
        setFormMode(null);
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchColors();
    };

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
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن رنگ
                            <SquarePlus />
                        </Button>

                        {/* Colors Table */}
                        <div className="rounded-md border">
                            <DashboardTable columns={COLUMNS}>
                                {loading
                                    ? renderSkeletonRows(3, COLUMNS)
                                    : colors.length > 0
                                        ? colors.map((color) => (
                                            <TableRow key={color.id}>
                                                <TableCell>{color.name}</TableCell>
                                                <TableCell>{color.hex}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className={`w-8 h-8 rounded border border-[#b7b1b1] flex_center font-bold ${!color.hex && "bg-gray-200"}`}
                                                        style={{ backgroundColor: color.hex || "#fff" }}
                                                    >
                                                        {!color.hex && '?'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex_center gap-2">
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
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-gray-500">
                                                    هیچ رنگی ثبت نشده است.
                                                </TableCell>
                                            </TableRow>
                                        )
                                }
                            </DashboardTable>
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
                )}

        </section>
    )
}

export default Colors;