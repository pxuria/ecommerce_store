/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RefreshCw, SquarePen, SquarePlus, Trash2 } from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IBanner } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CustomPagination from "@/components/shared/CustomPagination";
import DashboardTable from "../DashboardTable";
import BannerForm from "./BannerForm";

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

    const fetchBanners = useCallback(async (filters: Record<any, string | null>) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('banners', { params: filters });
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
    }, []);

    useEffect(() => {
        fetchBanners(getParams());
    }, [fetchBanners, getParams])

    const handleDelete = async () => {
        if (!selectedBanner?.id) return;
        try {
            await axiosInstance.delete(`banners/${selectedBanner?.id}`);
            handleShowToast("بنر با موفقیت حذف شد.", "success");
            setSelectedBanner(null);
            await fetchBanners(getParams());
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
        await fetchBanners(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchBanners(getParams());
    };


    const COLUMNS = [
        {
            title: 'عکس',
            key: 'image',
            className: 'text-right',
            render: (_: any, banner: IBanner) => (
                <Image
                    width={80}
                    height={80}
                    alt={banner?.alt || 'بنر'}
                    src={banner.image ?? "/assets/images/placeholder.webp"}
                    className="rounded-lg object-cover aspect-square"
                />
            ),
        },
        {
            title: 'متن عکس',
            key: 'alt',
            className: 'text-right'
        },
        {
            title: 'ترتیب بنر',
            key: 'displayOrder',
            sortable: true,
            className: 'text-right'
        },
        {
            title: 'وضعیت',
            key: 'isActive',
            searchItems: [
                { key: 'فعال', value: 'true' },
                { key: 'غیر فعال', value: 'false' },
                { key: 'همه', value: ' ' }
            ],
            className: 'text-right',
            render: (_: any, banner: IBanner) => (
                <span className={banner.isActive ? 'text-green-400' : 'text-red-400'}>
                    {banner.isActive ? 'فعال' : 'غیر فعال'}
                </span>
            )
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, banner: IBanner) => (
                <div className="flex_center gap-2">
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
                </div>
            )
        }
    ];

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
                        <div className="flex items-center gap-4 mb-8">
                            <Button
                                onClick={handleAdd}
                                className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base">
                                افزودن بنر
                                <SquarePlus />
                            </Button>

                            <Button
                                onClick={() => fetchBanners(getParams())}
                                className="text-white bg-secondary-700 aspect-square text-base">
                                <RefreshCw />
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <DashboardTable
                                data={banners}
                                loading={loading}
                                columns={COLUMNS} />
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