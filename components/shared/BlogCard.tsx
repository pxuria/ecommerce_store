"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { IBlog } from "@/types/model";

interface Props {
    blog: IBlog;
    itemClass?: string;
}

const BlogCard = ({ blog, itemClass = "" }: Props) => {
    return (
        <div className={itemClass}>
            <div className={`rounded-2xl overflow-hidden pb-2 px-2 pt-2 border border-muted bg-white shadow-none sm:shadow-md h-full flex flex-col`}>
                <div className="flex-grow flex flex-col">
                    <div className="relative overflow-hidden rounded-lg">
                        <Image
                            unoptimized
                            src={blog.coverImage ?? ''}
                            alt={`بلاگ ${blog.title}`}
                            width={900}
                            height={900}
                            className="object-cover h-[8rem] sm:h-[10rem] md:h-[15rem] rounded-3xl group-hover:rounded-2xl w-full transition-all ease-in duration-500 group-hover:scale-110"
                        />
                    </div>

                    <div className="flex items-end justify-between gap-0 sm:gap-2 md:gap-4 flex-wrap mt-0 sm:mt-2">
                        <Link href={`blogs/${blog.id}`}>
                            <h4 className="text-black text-sm sm:text-base font-medium text-right mt-2">
                                {blog.title}
                            </h4>
                        </Link>
                    </div>
                </div>

                <Link
                    href={`blogs/${blog.id}`}
                    className="block rounded-lg overflow-hidden w-full h-10 text-xs sm:text-sm md:text-base font-medium bg-secondary-600 hover:bg-secondary-700 transition-all ease-in text-white flex_center gap-1 md:gap-2 text-nowrap mt-2"
                >
                    <ShoppingBag className="text-white w-4 h-4 md:w-5 md:h-5" />
                    مشاهده بلاگ
                </Link>
            </div>
        </div>
    );
};

export default memo(BlogCard);