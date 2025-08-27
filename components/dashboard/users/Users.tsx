'use client';

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { handleShowToast } from "@/lib/toast";
import { IUser } from "@/types/model";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import DashboardTable, { renderSkeletonRows } from "../DashboardTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaRegTrashCan } from "react-icons/fa6";

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
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>();
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('users');
            setUsers(data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [])

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
                        <span className="font-bold text-base md:text-md">{setSelectedUser?.name}</span>{" "}
                        را حذف کنید؟
                    </p>
                }
            />
        </section>
    )
}

export default Users;