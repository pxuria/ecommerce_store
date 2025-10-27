'use client';

import { useEffect, useState } from 'react'
import Image from 'next/image';
import { CirclePlus, SquarePen, Trash2 } from 'lucide-react';
import CustomPagination from '@/components/shared/CustomPagination';
import ConfirmBox from '@/components/ui/ConfirmBox';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleShowToast } from '@/lib/toast';
import axiosInstance from '@/lib/axiosInstance';
import { IBlog } from '@/types/model';
import DashboardTable, { renderSkeletonRows } from '../DashboardTable';
import BlogForm from './BlogForm';

const COLUMNS = [
    { title: 'تیتر بلاگ', className: 'text-right' },
    { title: 'عکس بلاگ', className: 'text-right' },
    { title: 'بلاگ (نشانی کوتاه)', className: 'text-right' },
    { title: 'مدت زمان مطالعه', className: 'text-right' },
    { title: 'وضعیت انتشار', className: 'text-right' },
    { title: 'عملیات', className: 'text-center' }
];

const Blogs = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<IBlog | null>();
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 1
    });

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('blogs');
            setBlogs(data.data);
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
    };

    useEffect(() => {
        fetchBlogs();
    }, [])

    const handleDelete = async () => {
        if (!selectedBlog?.id) return;
        try {
            await axiosInstance.delete(`blogs/${selectedBlog?.id}`);
            handleShowToast("بلاگ با موفقیت حذف شد.", "success");
            setSelectedBlog(null);
            await fetchBlogs();
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف بلاگ.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: IBlog) => {
        setSelectedBlog(item)
        setFormMode("edit");
    };

    const handleAdd = () => {
        setFormMode("add");
    }

    const handleCancelForm = async () => {
        setFormMode(null);
        await fetchBlogs();
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchBlogs();
    };

    return (
        <section>
            {formMode === "edit" && selectedBlog && (
                <BlogForm item={selectedBlog} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <BlogForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن بلاگ
                            <CirclePlus />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable columns={COLUMNS}>
                                {loading
                                    ? renderSkeletonRows(3, COLUMNS)
                                    : blogs.length > 0
                                        ? blogs.map(blog => (
                                            <TableRow key={blog.id}>
                                                <TableCell>{blog.title}</TableCell>
                                                <TableCell>
                                                    <Image
                                                        width={120}
                                                        height={80}
                                                        alt={blog.title}
                                                        src={blog.coverImage}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell>{blog.slug}</TableCell>
                                                <TableCell>{blog.estimatedTimeToRead}</TableCell>
                                                <TableCell>{blog.isPublished ? 'منتشر شده' : '-'}</TableCell>
                                                <TableCell className="flex_center gap-2">
                                                    <Button
                                                        className="bg-primary-500 text-black !text-xs lg:text-base"
                                                        onClick={() => handleEdit(blog)}
                                                    >
                                                        <SquarePen className="mr-1" /> ویرایش
                                                    </Button>
                                                    <Button
                                                        className="bg-red-700 text-white !text-xs lg:text-base"
                                                        onClick={() => {
                                                            setSelectedBlog(blog);
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
                                                    هیچ بلاگی ثبت نشده است.
                                                </TableCell>
                                            </TableRow>
                                        )
                                }
                            </DashboardTable>
                        </div>

                        <CustomPagination pagination={pagination} />

                        <ConfirmBox
                            title="حذف بلاگ"
                            onOk={handleDelete}
                            onOkText="حذف بلاگ"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
                                    آیا مطمئن هستید که می‌خواهید بلاگ{" "}
                                    <span className="font-bold text-base md:text-md">{selectedBlog?.title}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )}

        </section>
    )
}

export default Blogs