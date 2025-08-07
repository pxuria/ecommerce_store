"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { ISideBlogs } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import LatestBlogCard from "./LatestBlogCard";

const BlogPageSidebar = () => {
    const [sideBlogs, setSideBlogs] = useState<ISideBlogs[] | null>();
    const [hydrated, setHydrated] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => setHydrated(true), []);

    useEffect(() => {
        if (!hydrated || isMobile) return;

        const fetchSideBlogs = async () => {
            try {
                const { data } = await axiosInstance.get("blog/latest-blog");
                setSideBlogs(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSideBlogs();
    }, [hydrated, isMobile]);

    if (!hydrated || isMobile) return null;

    return (
        <div className="w-1/3 bg-lightBlack rounded-3xl p-4 hidden xl:block">
            <div className="flex flex-col gap-4 w-full">
                {sideBlogs?.map((item, index) => (
                    <LatestBlogCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default BlogPageSidebar;
