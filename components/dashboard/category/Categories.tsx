'use client';

import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { ICategory } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CategoryForm from "./CategoryForm";


const Categories = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>();

    const fetchCategories = async () => {
        try {
            const { data } = await axiosInstance.get('category');
            setCategories(data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [])

    const selectChannelHandler = (item: ICategory) => {
        if (selectedCategory?.id === item.id) setSelectedCategory(null);
        else setSelectedCategory(item);
    }

    const handleDelete = async () => {
        if (!selectedCategory?.id) return;
        try {
            await axiosInstance.delete(`channel/${selectedCategory?.id}`);
            handleShowToast("دسته بندی با موفقیت حذف شد.", "success");
            setSelectedCategory(null);
            await fetchCategories();
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
        await fetchCategories();
    };

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
                        <div className="flex items-center flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-8">
                            <Button
                                onClick={handleEdit}
                                className="text-white bg-lightPurple w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base"
                                disabled={selectedCategory ? false : true}>
                                ویرایش دسته بندی
                                <FaRegEdit />
                            </Button>

                            <Button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-white bg-red w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base"
                                disabled={selectedCategory ? false : true}>
                                حذف دسته بندی
                                <FaRegTrashCan />
                            </Button>

                            <Button
                                onClick={handleAdd}
                                className="text-white bg-primary w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن دسته بندی
                                <FaRegTrashCan />
                            </Button>
                        </div>

                        <div className="flex items-start justify-start gap-4 flex-wrap">
                            {categories.length > 0 && categories.map((item) => (
                                <div
                                    key={item.id as string}
                                    onClick={() => selectChannelHandler(item)}
                                    className={`w-full sm:w-[calc(50%-16px)] min-h-[80px] rounded-xl bg-hoverBlack border-2 p-4 cursor-pointer ${selectedCategory?.id === item.id ? "border-lightPurple" : "border-white"}`} >
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white text-base font-medium">{item.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <ConfirmBox
                            title="حذف دسته بندی"
                            onOk={handleDelete}
                            onOkText="حذف دسته بندی"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
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