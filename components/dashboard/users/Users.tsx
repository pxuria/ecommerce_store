/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Trash2, UserStar } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { UserRole } from "@prisma/client";
import { handleShowToast } from "@/lib/toast";
import { type IUser } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import CustomPagination from "@/components/shared/CustomPagination";
import DashboardTable from "../DashboardTable";

const Users = () => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
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

    const fetchUsers = useCallback(async (filters: Record<any, string | null>) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('users', { params: filters });
            setUsers(data.data);
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
        fetchUsers(getParams());
    }, [fetchUsers, getParams])

    const handleDelete = async () => {
        if (!selectedUser?.id) return;
        try {
            await axiosInstance.delete(`users/${selectedUser?.id}`);
            handleShowToast("کاربر با موفقیت حذف شد.", "success");
            setSelectedUser(null);
            await fetchUsers(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف کاربر.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleAdministration = async () => {
        if (!selectedUser?.id) return;
        try {
            await axiosInstance.put('admin/administration', {
                userId: selectedUser.id
            });
            handleShowToast("تغییر نقش کاربر با موفقیت انجام شد", "success");
            setSelectedUser(null);
            await fetchUsers(getParams());
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در تغییر نقش کاربر.", "error");
            }
        } finally {
            setIsAdminDialogOpen(false);
        }
    }

    const COLUMNS = [
        {
            title: 'نام',
            key: 'firstName',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'نام خانوادگی',
            key: 'lastName',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'تلفن همراه',
            key: 'phone',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'ایمیل',
            key: 'email',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'نقش',
            key: 'role',
            className: 'text-right',
            // searchable: true,
            searchItems: [
                { key: "ادمین", value: UserRole.ADMIN },
                { key: "کاربر", value: UserRole.USER },
                { key: "همه", value: ' ' }
            ],
            render: (v: any) => v === UserRole.ADMIN ? 'ادمین' : 'کاربر'
        },
        {
            title: 'شهر',
            key: 'city',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'کد پستی',
            key: 'postalCode',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'آدرس',
            key: 'address',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, user: IUser) => (
                <div className="flex_center gap-2">
                    <Button
                        className="bg-secondary-500 text-white !text-xs lg:text-base"
                        onClick={() => {
                            console.log(user)
                            setSelectedUser(user);
                            setIsAdminDialogOpen(true);
                        }}
                    >
                        <UserStar className="mr-1" /> تغییر نقش کاربر
                    </Button>
                    <Button
                        className="bg-red-700 text-white !text-xs lg:text-base"
                        onClick={() => {
                            setSelectedUser(user);
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
            <div className="rounded-md border">
                <DashboardTable
                    data={users}
                    loading={loading}
                    columns={COLUMNS} />
            </div>

            <CustomPagination pagination={pagination} />

            <ConfirmBox
                title="تغییر نقش کاربر"
                onOk={handleAdministration}
                onOkText="تغییر نقش کاربر"
                onCancelText="انصراف"
                onCancel={() => setIsAdminDialogOpen(false)}
                isDialogOpen={isAdminDialogOpen}
                setIsDialogOpen={setIsAdminDialogOpen}
                okClass="bg-secondary-600 hover:bg-secondary-700"
                cancelClass="bg-red-600 hover:bg-red-700"
                content={
                    <p className="text-sm md:text-md text-black">
                        آیا مطمئن هستید که می‌خواهید نقش کاربر{" "}
                        <span className="font-bold text-base md:text-md">{selectedUser?.firstName} {selectedUser?.lastName}</span>{" "}
                        را تغییر دهید؟
                    </p>
                }
            />

            <ConfirmBox
                title="حذف کاربر"
                onOk={handleDelete}
                onOkText="حذف کاربر"
                onCancelText="انصراف"
                onCancel={() => setIsDeleteDialogOpen(false)}
                isDialogOpen={isDeleteDialogOpen}
                setIsDialogOpen={setIsDeleteDialogOpen}
                content={
                    <p className="text-sm md:text-md text-black">
                        آیا مطمئن هستید که می‌خواهید کاربر{" "}
                        <span className="font-bold text-base md:text-md">{selectedUser?.firstName} {selectedUser?.lastName}</span>{" "}
                        را حذف کنید؟
                    </p>
                }
            />
        </section>
    )
}

export default Users;