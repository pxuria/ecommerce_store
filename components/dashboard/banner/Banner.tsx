'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IBanner } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import BannerForm from "./BannerForm";
import DashboardTable, { renderSkeletonRows } from "../DashboardTable";
import { TableCell, TableRow } from "@/components/ui/table";
import CustomPagination from "@/components/shared/CustomPagination";
import { SquarePen, SquarePlus, Trash2 } from "lucide-react";

const COLUMNS = [
    { title: 'عکس', className: 'text-right' },
    { title: 'متن عکس', className: 'text-right' },
    { title: 'ترتیب بنر', className: 'text-right' },
    { title: 'وضعیت', className: 'text-right' },
    { title: 'عملیات', className: 'text-center' }
];

const Banners = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [selectedBanner, setSelectedBanner] = useState<IBanner | null>();
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 1
    });

    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;

    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`banners?page=${page}&limit=${limit}`);
            setBanners(data.data);
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
        fetchBanners();
    }, [fetchBanners])

    const handleDelete = async () => {
        if (!selectedBanner?.id) return;
        try {
            await axiosInstance.delete(`banners/${selectedBanner?.id}`);
            handleShowToast("بنر با موفقیت حذف شد.", "success");
            setSelectedBanner(null);
            await fetchBanners();
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف بنر.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: IBanner) => {
        setSelectedBanner(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchBanners();
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchBanners();
    };

    return (
        <section>
            {formMode === "edit" && selectedBanner && (
                <BannerForm item={selectedBanner} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <BannerForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن بنر
                            <SquarePlus />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable columns={COLUMNS}>
                                {loading
                                    ? renderSkeletonRows(3, COLUMNS)
                                    : banners.length > 0
                                        ? banners.map(banner => (
                                            <TableRow key={banner.id}>
                                                <TableCell>{banner.image}</TableCell>
                                                <TableCell>{banner.alt}</TableCell>
                                                <TableCell>{banner.displayOrder}</TableCell>
                                                <TableCell>{banner.isActive}</TableCell>
                                                <TableCell className="flex_center gap-2">
                                                    <Button
                                                        className="bg-primary-500 text-black !text-xs lg:text-base"
                                                        onClick={() => handleEdit(banner)}
                                                    >
                                                        <SquarePen className="mr-1" /> ویرایش
                                                    </Button>
                                                    <Button
                                                        className="bg-red-700 text-white !text-xs lg:text-base"
                                                        onClick={() => {
                                                            setSelectedBanner(banner);
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
                                                    هیچ بنری ثبت نشده است.
                                                </TableCell>
                                            </TableRow>
                                        )
                                }
                            </DashboardTable>
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف بنر"
                            onOk={handleDelete}
                            onOkText="حذف بنر"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md">
                                    آیا مطمئن هستید که می‌خواهید بنر{" "}
                                    <span className="font-bold text-base md:text-md">{selectedBanner?.alt}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )}

        </section>
    )
}

export default Banners;