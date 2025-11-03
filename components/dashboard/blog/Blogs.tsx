/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CirclePlus, SquarePen, Trash2 } from 'lucide-react';

import CustomPagination from '@/components/shared/CustomPagination';
import ConfirmBox from '@/components/ui/ConfirmBox';
import { Button } from '@/components/ui/button';
import { handleShowToast } from '@/lib/toast';
import axiosInstance from '@/lib/axiosInstance';
import { IBlog } from '@/types/model';
import DashboardTable from '../DashboardTable';
import BlogForm from './BlogForm';

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

    const fetchBlogs = useCallback(async (filters: Record<any, string | null>) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('blogs', { params: filters });
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
    }, []);

    useEffect(() => {
        fetchBlogs(getParams());
    }, [fetchBlogs, getParams])

    const handleDelete = async () => {
        if (!selectedBlog?.id) return;
        try {
            await axiosInstance.delete(`blogs/${selectedBlog?.id}`);
            handleShowToast("بلاگ با موفقیت حذف شد.", "success");
            setSelectedBlog(null);
            await fetchBlogs(getParams());
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
        await fetchBlogs(getParams());
    };

    const onUpdated = async () => {
        setFormMode(null);
        await fetchBlogs(getParams());
    };


    const COLUMNS = [
        {
            title: 'تیتر بلاگ',
            key: 'title',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'عکس بلاگ',
            key: 'coverImage',
            className: 'text-right',
            render: ({ coverImage }: IBlog) => (
                <Image
                    width={120}
                    height={80}
                    alt={coverImage}
                    src={coverImage}
                    className="rounded-lg object-cover"
                />
            ),
        },
        {
            title: 'بلاگ (نشانی کوتاه)',
            key: 'slug',
            searchable: true,
            className: 'text-right'
        },
        {
            title: 'مدت زمان مطالعه',
            key: 'estimatedTimeToRead',
            sortable: true,
            className: 'text-right'
        },
        {
            title: 'وضعیت انتشار',
            key: '',
            className: 'text-right',
            render: ({ isPublished }: IBlog) => isPublished ? 'منتشر شده' : '-',
        },
        {
            title: 'عملیات',
            key: 'actions',
            className: 'text-center',
            render: (_: any, blog: IBlog) => (
                <div className="flex_center gap-2">
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
                </div>
            )
        }
    ];

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
                            <DashboardTable
                                loading={loading}
                                data={blogs}
                                columns={COLUMNS} />
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