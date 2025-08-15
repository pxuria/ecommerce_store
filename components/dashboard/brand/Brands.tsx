'use client';

import { useEffect, useState } from "react";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IBrand } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import BrandForm from "./BrandForm";
import DashboardTable, { renderSkeletonRows } from "../DashboardTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaRegTrashCan } from "react-icons/fa6";

const COLUMNS = [
    { title: 'نام برند', className: 'text-right' },
    { title: 'برند (نشانی کوتاه)', className: 'text-right' },
    { title: 'عملیات', className: 'text-center' }
];

const Brands = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>();
    const [loading, setLoading] = useState(true);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('brands');
            setBrands(data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, [])

    const handleDelete = async () => {
        if (!selectedBrand?.id) return;
        try {
            await axiosInstance.delete(`brands/${selectedBrand?.id}`);
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

    const handleEdit = (item: IBrand) => {
        setSelectedBrand(item)
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
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن برند
                            <FaRegPlusSquare />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable columns={COLUMNS}>
                                {loading
                                    ? renderSkeletonRows(3, COLUMNS)
                                    : brands.length > 0
                                        ? brands.map((brand) => (
                                            <TableRow key={brand.id}>
                                                <TableCell>{brand.name}</TableCell>
                                                <TableCell>{brand.slug}</TableCell>
                                                <TableCell className="flex_center gap-2">
                                                    <Button
                                                        className="bg-primary-500 text-black !text-xs lg:text-base"
                                                        onClick={() => handleEdit(brand)}
                                                    >
                                                        <FaRegEdit className="mr-1" /> ویرایش
                                                    </Button>
                                                    <Button
                                                        className="bg-red-700 text-white !text-xs lg:text-base"
                                                        onClick={() => {
                                                            setSelectedBrand(brand);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <FaRegTrashCan className="mr-1" /> حذف
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-gray-500">
                                                    هیچ برندی ثبت نشده است.
                                                </TableCell>
                                            </TableRow>
                                        )
                                }
                            </DashboardTable>
                        </div>

                        {/* <div className="flex items-start justify-start gap-4 flex-wrap">
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
                        </div> */}

                        <ConfirmBox
                            title="حذف برند"
                            onOk={handleDelete}
                            onOkText="حذف برند"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
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