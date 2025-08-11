'use client';
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IColor } from "@/types/model";
import { useEffect, useState } from "react";
import ColorForm from "./ColorForm";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import ConfirmBox from "@/components/ui/ConfirmBox";

const Colors = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [colors, setColors] = useState<IColor[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColor | null>();

    const fetchColors = async () => {
        try {
            const { data } = await axiosInstance.get('color?populated=true');
            setColors(data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        }
    };

    useEffect(() => {
        fetchColors();
    }, [])

    const selectChannelHandler = (item: IColor) => {
        if (selectedColor?.id === item.id) setSelectedColor(null);
        else setSelectedColor(item);
    }

    const handleDelete = async () => {
        if (!selectedColor?.id) return;
        try {
            await axiosInstance.delete(`channel/${selectedColor?.id}`);
            handleShowToast("کانال با موفقیت حذف شد.", "success");
            setSelectedColor(null);
            await fetchColors();
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف کانال.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = () => {
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
                        <div className="flex items-center flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-8">
                            <Button
                                onClick={handleEdit}
                                className="text-white bg-lightPurple w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base"
                                disabled={selectedColor ? false : true}>
                                ویرایش کانال
                                <FaRegEdit />
                            </Button>

                            <Button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-white bg-red w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base"
                                disabled={selectedColor ? false : true}>
                                حذف کانال
                                <FaRegTrashCan />
                            </Button>

                            <Button
                                onClick={handleAdd}
                                className="text-white bg-primary w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن کانال
                                <FaRegTrashCan />
                            </Button>
                        </div>

                        <div className="flex items-start justify-start gap-4 flex-wrap">
                            {colors.length > 0 && colors.map((item) => (
                                <div
                                    key={item.id as string}
                                    onClick={() => selectChannelHandler(item)}
                                    className={`w-full sm:w-[calc(50%-16px)] min-h-[80px] rounded-xl bg-hoverBlack border-2 p-4 cursor-pointer ${selectedColor?.id === item.id ? "border-lightPurple" : "border-white"}`} >
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white text-base font-medium">{item.name}</h3>
                                    </div>
                                </div>
                            ))}
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