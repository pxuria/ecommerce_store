/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SquarePen, SquarePlus, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { ICountry } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CustomPagination from "@/components/shared/CustomPagination";
import DashboardTable from "../DashboardTable";
import CountryForm from "./CountryForm";

const Countries = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>();
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

    const fetchCountries = useCallback(async (filters: Record<any, string | null>) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('countries', { params: filters });

            setCountries(Array.isArray(data.data) ? data.data : []);
            setPagination({
                total: data.pagination.total,
                currentPage: data.pagination.page,
                totalPages: data.pagination.totalPages
            });
        } catch (error) {
            console.log(error)
            if (error instanceof Error) handleShowToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCountries(getParams());
    }, [fetchCountries, getParams])

    const handleDelete = async () => {
        if (!selectedCountry?.id) return;
        try {
            await axiosInstance.delete(`countries/${selectedCountry?.id}`);
            handleShowToast("کشور با موفقیت حذف شد.", "success");
            setSelectedCountry(null);
            await fetchCountries(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف کشور.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: ICountry) => {
        setSelectedCountry(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchCountries(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchCountries(getParams());
    };

    const COLUMNS = [
        {
            title: 'نام کشور',
            key: 'name',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'کشور (نشانی کوتاه)',
            key: 'slug',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'عملیات',
            key: '',
            className: 'text-center',
            render: (_: any, country: ICountry) => (
                <div className="flex_center gap-2">

                    <Button
                        className="bg-primary-500 text-black !text-xs lg:text-base"
                        onClick={() => handleEdit(country)}
                    >
                        <SquarePen className="mr-1" /> ویرایش
                    </Button>
                    <Button
                        className="bg-red-700 text-white !text-xs lg:text-base"
                        onClick={() => {
                            setSelectedCountry(country);
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
            {formMode === "edit" && selectedCountry && (
                <CountryForm item={selectedCountry} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <CountryForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن کشور
                            <SquarePlus />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable
                                data={countries}
                                loading={loading}
                                columns={COLUMNS} />
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف کشور"
                            onOk={handleDelete}
                            onOkText="حذف کشور"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
                                    آیا مطمئن هستید که می‌خواهید کشور{" "}
                                    <span className="font-bold text-base md:text-md">{selectedCountry?.name}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )}

        </section>
    )
}

export default Countries;