'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IUser } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import DashboardTable, { renderSkeletonRows } from "../DashboardTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaRegTrashCan, FaUserSecret } from "react-icons/fa6";
import CustomPagination from "@/components/shared/CustomPagination";

const COLUMNS = [
    { title: 'نام', className: 'text-right' },
    { title: 'نام خانوادگی', className: 'text-right' },
    { title: 'تلفن همراه', className: 'text-right' },
    { title: 'ایمیل', className: 'text-right' },
    { title: 'نقش', className: 'text-right' },
    { title: 'عملیات', className: 'text-center' }
];

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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`users?page=${page}&limit=${limit}`);
            setUsers(data);
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
        fetchUsers();
    }, [fetchUsers])

    const handleDelete = async () => {
        if (!selectedUser?.id) return;
        try {
            await axiosInstance.delete(`users/${selectedUser?.id}`);
            handleShowToast("کاربر با موفقیت حذف شد.", "success");
            setSelectedUser(null);
            await fetchUsers();
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
            await fetchUsers();
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

    return (
        <section>
            <div className="rounded-md border">
                <DashboardTable columns={COLUMNS}>
                    {loading
                        ? renderSkeletonRows(3, COLUMNS)
                        : users.length > 0
                            ? users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role === 'ADMIN' ? 'ادمین' : 'کاربر'}</TableCell>
                                    <TableCell className="flex_center gap-2">
                                        <Button
                                            className="bg-secondary-500 text-white !text-xs lg:text-base"
                                            onClick={() => {
                                                console.log(user)
                                                setSelectedUser(user);
                                                setIsAdminDialogOpen(true);
                                            }}
                                        >
                                            <FaUserSecret className="mr-1" /> تغییر نقش کاربر
                                        </Button>
                                        <Button
                                            className="bg-red-700 text-white !text-xs lg:text-base"
                                            onClick={() => {
                                                setSelectedUser(user);
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
                                        هیچ کاربری ثبت نشده است.
                                    </TableCell>
                                </TableRow>
                            )
                    }
                </DashboardTable>
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