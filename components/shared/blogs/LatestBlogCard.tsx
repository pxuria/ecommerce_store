"use client";

import Image from "next/image";
import Link from "next/link";
import { ISideBlogs } from "@/types";
import { formatDate } from "@/utils/helpers";

const LatestBlogCard = ({
    _id,
    title,
    wallpaper,
    author,
    createdAt,
}: ISideBlogs) => {
    return (
        <Link
            href={`/blog/${_id}`}
            className="cursor-pointer rounded-2xl hover:bg-hoverBlack transition-all ease-in p-2"
        >
            <div className="flex flex-nowrap items-start justify-start gap-4">
                <Image
                    alt={title}
                    width={150}
                    height={100}
                    src={wallpaper || "assets/images/candles.svg"}
                    className="rounded-2xl max-w-[220px] h-[140px] object-cover block"
                />

                <div className="flex flex-col items-start">
                    <h3 className="text-base text-white font-semibold text-wrap">
                        {title}
                    </h3>
                    <div className="flex items-center justify-start gap-2 mt-2">
                        <span className="text-sm font-semibold text-lightPurple">
                            {author.first_name} {author.last_name}
                        </span>
                        <span className="text-sm font-medium text-[#818181]">
                            {formatDate(createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default LatestBlogCard;
