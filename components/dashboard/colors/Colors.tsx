'use client';

import { useEffect, useState } from "react";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IColor } from "@/types/model";
import ColorForm from "./ColorForm";

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

    const fetchColors = async () => {
        try {
            const { data } = await axiosInstance.get('colors');
            setColors(data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        }
    };

    useEffect(() => {
        fetchColors();
    }, [])

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

    console.log(selectedColor ? false : true)

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
                        <div className="flex items-center flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-8">
                            <Button
                                onClick={handleAdd}
                                className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن رنگ
                                <FaRegPlusSquare />
                            </Button>
                        </div>

                        {/* Colors Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {COLUMNS.map(item => (
                                            <TableHead key={item.title} className={`${item.className}`}>{item.title}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {colors.length > 0 ? (
                                        colors.map((color) => (
                                            <TableRow key={color.id}>
                                                <TableCell>{color.name}</TableCell>
                                                <TableCell>{color.hex || "-"}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className={`w-8 h-8 rounded border ${!color.hex && "bg-gray-200"}`}
                                                        style={{ backgroundColor: color.hex || "#fff" }}
                                                    />
                                                </TableCell>
                                                <TableCell className="flex_center gap-2">
                                                    <Button
                                                        className="bg-primary-500 text-black !text-xs lg:text-base"
                                                        onClick={() => handleEdit(color)}
                                                    >
                                                        <FaRegEdit className="mr-1" /> ویرایش
                                                    </Button>
                                                    <Button
                                                        className="bg-red-700 text-white !text-xs lg:text-base"
                                                        onClick={() => {
                                                            setSelectedColor(color);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <FaRegTrashCan className="mr-1" /> حذف
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500">
                                                هیچ رنگی ثبت نشده است.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <ConfirmBox
                            title="حذف رنگ"
                            onOk={handleDelete}
                            onOkText="حذف رنگ"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
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