import { Metadata } from "next";
import BlogCard from "@/components/shared/blogs/BlogCard";
import CustomPagination from "@/components/shared/CustomPagination";
import { Blog } from "@prisma/client";

export const metadata: Metadata = {
    title: "مقالات آموزشی ترید | تحلیل و آموزش مبانی بازار | وبلاگ Daylight",
    description:
        "در وبلاگ Daylight آموزش‌های تخصصی ترید، تحلیل بازارهای مالی، معرفی اندیکاتورها و بررسی مباحث فاندامنتال را بخوانید و حرفه‌ای‌تر معامله کنید.",
    openGraph: {
        title: "وبلاگ Daylight | آموزش ترید و تحلیل بازارهای مالی",
        description:
            "مطالب تخصصی و کاربردی در زمینه ترید، تحلیل تکنیکال و فاندامنتال، استراتژی‌های معاملاتی و آموزش ابزارهای تریدینگ در وبلاگ Daylight.",
        url: "http://daylighttrade.com/blog",
        siteName: "Daylight",
        images: [
            {
                url: "/assets/images/logo.png",
                width: 1200,
                height: 630,
                alt: "Daylight Blog Articles",
            },
        ],
        locale: "fa_IR",
        type: "website",
    },
    alternates: {
        canonical: "http://daylighttrade.com/blog",
    },
    robots: {
        index: true,
        follow: true,
    },
    twitter: {
        card: "summary_large_image",
        title: "وبلاگ Daylight | آموزش ترید، تحلیل تکنیکال و فاندامنتال",
        description:
            "با مقالات آموزشی Daylight در دنیای بازارهای مالی حرفه‌ای‌تر شوید. تحلیل‌های دقیق، آموزش استراتژی و معرفی ابزارهای معاملاتی.",
        images: ["/assets/images/logo.png"],
    },
};

const page = async () => {
    const res = await fetch('/api/blogs', {
        cache: 'no-store'
    });
    const blogs = await res.json();

    return (
        <section className="container mx-auto px-10 mt-12">
            <div className="flex flex-wrap gap-4">
                {Array.isArray(blogs.data as Blog) &&
                    blogs.data.map((item: Blog) => <BlogCard key={item.id} blog={item} />)}
            </div>

            <CustomPagination pagination={blogs.pagination} />
        </section>
    );
};

export default page;
