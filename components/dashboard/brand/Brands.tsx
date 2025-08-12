'use client';

import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IBrand } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import BrandForm from "./BrandForm";


const Brands = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>();

    const fetchBrands = async () => {
        try {
            const { data } = await axiosInstance.get('color?populated=true');
            setBrands(data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        }
    };

    useEffect(() => {
        fetchBrands();
    }, [])

    const selectChannelHandler = (item: IBrand) => {
        if (selectedBrand?.id === item.id) setSelectedBrand(null);
        else setSelectedBrand(item);
    }

    const handleDelete = async () => {
        if (!selectedBrand?.id) return;
        try {
            await axiosInstance.delete(`channel/${selectedBrand?.id}`);
            handleShowToast("برند با موفقیت حذف شد.", "success");
            setSelectedBrand(null);
            await fetchBrands();
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
        await fetchBrands();
    };

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
                        <div className="flex items-center flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-8">
                            <Button
                                onClick={handleEdit}
                                className="text-white bg-lightPurple w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base"
                                disabled={selectedBrand ? false : true}>
                                ویرایش برند
                                <FaRegEdit />
                            </Button>

                            <Button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-white bg-red w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base"
                                disabled={selectedBrand ? false : true}>
                                حذف برند
                                <FaRegTrashCan />
                            </Button>

                            <Button
                                onClick={handleAdd}
                                className="text-white bg-primary w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن برند
                                <FaRegTrashCan />
                            </Button>
                        </div>

                        <div className="flex items-start justify-start gap-4 flex-wrap">
                            {brands.length > 0 && brands.map((item) => (
                                <div
                                    key={item.id as string}
                                    onClick={() => selectChannelHandler(item)}
                                    className={`w-full sm:w-[calc(50%-16px)] min-h-[80px] rounded-xl bg-hoverBlack border-2 p-4 cursor-pointer ${selectedBrand?.id === item.id ? "border-lightPurple" : "border-white"}`} >
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