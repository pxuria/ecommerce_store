import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { IBlog } from "@/types/model";
import DOMPurify from "isomorphic-dompurify";

interface Props {
    blog: IBlog;
    itemClass?: string;
}

const BlogCard = ({ blog, itemClass }: Props) => {
    // function stripHtml(html: string): string {
    //     if (!html) return "";
    //     // Remove all HTML tags including <img>
    //     let text = html.replace(/<img[^>]*>/g, "").replace(/<[^>]*>/g, "");
    //     text = text
    //         .replace(/&nbsp;/g, " ")
    //         .replace(/&zwnj;/g, "")
    //         .replace(/&amp;/g, "&")
    //         .replace(/&lt;/g, "<")
    //         .replace(/&gt;/g, ">")
    //         .replace(/&quot;/g, '"')
    //         .replace(/&#039;/g, "'");
    //     text = text.replace(/\s+/g, " ").trim();
    //     if (text.length > 85) return text.substring(0, 85).trim() + "...";
    //     return text;
    // }

    // const summary = blog.content.slice(0, 200) + "...";

    function cleanHtml(html: string): string {
        if (!html) return "";
        let cleaned = html.replace(/<img[^>]*>/g, ""); // remove img tags
        cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ""); // remove scripts for safety
        cleaned = cleaned.replace(/&nbsp;/g, " ");
        // sanitize the rest
        return DOMPurify.sanitize(cleaned);
    }

    // Clean and then truncate
    const cleanedHtml = cleanHtml(blog.content);
    const tempDiv = typeof window !== "undefined" ? document.createElement("div") : null;
    let textContent = "";

    if (tempDiv) {
        tempDiv.innerHTML = cleanedHtml;
        textContent = tempDiv.textContent || tempDiv.innerText || "";
    }

    const truncatedText = textContent.length > 200 ? textContent.slice(0, 200).trim() + "..." : textContent;


    return (
        <div className={`2xl:w-[calc(24%-8px)] lg:w-[calc(33%-8px)] sm:w-[calc(50%-8px)] p-3 rounded-3xl overflow-hidden flex flex-col ${itemClass}`}>
            {/* image */}
            <Link href={`blog/${blog.id}`}>
                <div className="rounded-xl overflow-hidden relative">
                    <Image
                        className="max-w-full w-full object-cover object-center h-[200px] overflow-hidden hover:scale-105 transition-all ease-in duration-300"
                        src={blog.coverImage ?? '/assets/images/placeholder.webp'}
                        alt={blog.title}
                        width={200}
                        height={180}
                    />
                </div>
            </Link>

            {/* title */}
            <Link href={`blog/${blog.id}`}>
                <h3 className="font-bold text-xl text-wrap mt-2 hover:text-secondary-700 transition-all ease-in">
                    {blog.title}
                </h3>
            </Link>

            <div className="flex flex-wrap items-end justify-between mt-3">
                <div className="flex-column gap-1">
                    <span className="text-[10px] font-medium text-[#3e3e3e] text-nowrap">
                        {formatDate(String(blog.createdAt))}
                    </span>
                </div>

                <span className="text-xs font-medium text-secondary-700">
                    {blog.estimatedTimeToRead} دقیقه مدت زمان مطالعه
                </span>
            </div>

            {/* <p className="text-justify text-sm font-normal flex-1 text-[#787878] ellipsis_text text-wrap">
                {stripHtml(summary)}
            </p> */}

            <div
                className="text-justify text-sm font-normal flex-1 text-[#787878] ellipsis_text text-wrap mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: truncatedText }}
            />

            {/* New button */}
            <Link
                href={`blogs/${blog.id}`}
                className="block rounded-lg overflow-hidden w-full h-10 text-xs sm:text-sm md:text-base font-medium bg-secondary-600 mt-2 hover:bg-secondary-700 transition-all ease-in text-white flex_center gap-1 md:gap-2 text-nowrap"
            >
                <Eye className="text-white w-4 h-4 md:w-5 md:h-5" />
                مشاهده بلاگ
            </Link>
        </div>
    );
};

export default BlogCard;
