import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import { Blog } from "@prisma/client";

const BlogCard = ({ blog }: { blog: Blog }) => {
    function stripHtml(html: string): string {
        if (!html) return "";
        let text = html.replace(/<[^>]*>/g, "");
        text = text
            .replace(/&nbsp;/g, " ")
            .replace(/&zwnj;/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");

        text = text.replace(/\s+/g, " ").trim();
        if (text.length > 85) return text.substring(0, 85).trim() + "...";

        return text;
    }

    const summary = blog.content.slice(0, 200) + '...';

    return (
        <div className="2xl:w-[calc(24%-8px)] lg:w-[calc(33%-8px)] sm:w-[calc(50%-8px)] p-3 rounded-3xl overflow-hidden">
            {/* image */}
            <Link href={`blog/${blog.id}`}>
                <div className="rounded-xl overflow-hidden relative">
                    <Image
                        className="max-w-full w-full object-cover object-center max-h-[200px] overflow-hidden hover:scale-105 transition-all ease-in duration-300"
                        src={blog.coverImage || "assets/images/candles.svg"}
                        alt={blog.title}
                        width={200}
                        height={180}
                    />
                </div>
            </Link>

            {/* title */}
            <Link href={`blog/${blog.id}`}>
                <h3 className="font-bold text-2xl text-wrap mt-2 text-white hover:text-lightPurple duration-300 transition-all ease-in">
                    {blog.title}
                </h3>
            </Link>

            <div className="flex flex-wrap items-end justify-between mt-3">
                <div className="flex-column gap-1">
                    <span className="text-[10px] font-medium text-[#7e7e7e] text-nowrap">
                        {formatDate(String(blog.createdAt))}
                    </span>
                </div>

                <span className="text-xs font-medium text-purple_500">
                    {blog.estimatedTimeToRead} دقیقه مدت زمان مطالعه
                </span>
            </div>

            <p className="text-justify text-sm font-normal text-[#787878] ellipsis_text text-wrap">
                {stripHtml(summary)}
            </p>

            <Link
                href={`blog/${blog.id}`}
                className="w-full mt-4 bg-lightPurple text-white block px-4 py-2 rounded-lg text-center"
            >
                <span className="text-lg font-medium">مشاهده مطلب</span>
            </Link>
        </div>
    );
};

export default BlogCard;
