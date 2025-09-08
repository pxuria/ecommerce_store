'use client';

import { useEffect, useState } from "react";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import ConfirmBox from "@/components/ui/ConfirmBox";
import { TableCell, TableRow } from "@/components/ui/table";
import { handleShowToast } from "@/lib/toast";
import axiosInstance from "@/lib/axiosInstance";
import { IProduct } from "@/types/model";
import DashboardTable, { renderSkeletonRows } from "../DashboardTable";
import ProductForm from "./ProductForm";
import Image from "next/image";
import { toJalaliDate } from "@/utils/helpers";


const COLUMNS = [
    { title: 'نام محصول', className: 'text-right' },
    { title: 'عکس محصول', className: 'text-right' },
    { title: 'محصول (نشانی کوتاه)', className: 'text-right' },
    { title: 'دسته بندی محصول', className: 'text-right' },
    { title: 'برند محصول', className: 'text-right' },
    { title: 'کشور محصول', className: 'text-right' },
    { title: 'تاریخ ایجاد', className: 'text-right' },
    { title: 'تاریخ حذف', className: 'text-right' },
    { title: 'وضعیت محصول', className: 'text-right' },
    { title: 'عملیات', className: 'text-center' }
];

const Products = () => {
    const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedPrduct, setSelectedProduct] = useState<IProduct | null>();
    const [loading, setLoading] = useState(true);
    const dateFormat = 'jYYYY/jMM/jDD';

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('products');
            setProducts(data.data);
        } catch (error) {
            if (error instanceof Error) handleShowToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleDelete = async () => {
        if (!selectedPrduct?.id) return;
        try {
            await axiosInstance.delete(`products/${selectedPrduct?.id}`);
            handleShowToast("محصول با موفقیت حذف شد.", "success");
            setSelectedProduct(null);
            await fetchProducts();
        } catch (error) {
            if (error instanceof Error) {
                handleShowToast(error.message, "error");
            } else {
                handleShowToast("خطا در حذف محصول.", "error");
            }
        } finally {
            setIsDeleteDialogOpen(false);
        }
    }

    const handleEdit = (item: IProduct) => {
        setSelectedProduct(item)
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
        await fetchProducts();
    };

    return (
        <section>
            {formMode === "edit" && selectedPrduct && (
                <ProductForm item={selectedPrduct} onClose={handleCancelForm} onUpdated={onUpdated} />
            )}

            {formMode === "add" && (
                <ProductForm onClose={handleCancelForm} />
            )}

            {formMode === null &&
                (
                    <>
                        <Button
                            onClick={handleAdd}
                            className="text-white bg-secondary-700 w-full lg:w-[calc(33%-16px)] !text-xs lg:text-base mb-8">
                            افزودن محصول
                            <FaRegPlusSquare />
                        </Button>

                        <div className="rounded-md border">
                            <DashboardTable columns={COLUMNS}>
                                {loading
                                    ? renderSkeletonRows(3, COLUMNS)
                                    : products.length > 0
                                        ? products.map(product => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>
                                                    <Image
                                                        width={120}
                                                        height={80}
                                                        alt={product?.images[0]?.alt}
                                                        src={product?.images[0]?.url}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell>{product.slug}</TableCell>
                                                <TableCell>{product.category.name}</TableCell>
                                                <TableCell>{product.brand.name}</TableCell>
                                                <TableCell>{product.country.name}</TableCell>
                                                <TableCell>{toJalaliDate(product.createdAt, dateFormat)}</TableCell>
                                                <TableCell className={!product.deletedAt && "text-center"}>{toJalaliDate(product.deletedAt, dateFormat) || '-'}</TableCell>
                                                <TableCell>{product.isActive ? 'فعال' : 'غیرفعال'}</TableCell>
                                                <TableCell className="flex_center gap-2">
                                                    <Button
                                                        className="bg-primary-500 text-black !text-xs lg:text-base"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <FaRegEdit className="mr-1" /> ویرایش
                                                    </Button>
                                                    <Button
                                                        className="bg-red-700 text-white !text-xs lg:text-base"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
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
                                                    هیچ محصولی ثبت نشده است.
                                                </TableCell>
                                            </TableRow>
                                        )
                                }
                            </DashboardTable>
                        </div>

                        <ConfirmBox
                            title="حذف محصول"
                            onOk={handleDelete}
                            onOkText="حذف محصول"
                            onCancelText="انصراف"
                            onCancel={() => setIsDeleteDialogOpen(false)}
                            isDialogOpen={isDeleteDialogOpen}
                            setIsDialogOpen={setIsDeleteDialogOpen}
                            content={
                                <p className="text-sm md:text-md text-white">
                                    آیا مطمئن هستید که می‌خواهید محصول{" "}
                                    <span className="font-bold text-base md:text-md">{setSelectedProduct?.name}</span>{" "}
                                    را حذف کنید؟
                                </p>
                            }
                        />
                    </>
                )}

        </section>
    )
}

export default Products