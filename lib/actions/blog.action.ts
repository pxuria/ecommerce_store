"use server";

import ConnectDB from "@/config/db";
// import redis from "../redis";
// import Blog from "@/models/Blog.model";
import { isAdmin } from "../auth";
import User from "@/models/User.model";
import { asyncHandler } from "@/utils/helpers";
// import { blogsRedis } from "@/constants/redis-keys";
// import { IBlogUser } from "@/types";

type Blog = {
    title: string;
    author: string;
    content: string;
    wallpaper: string;
    metaTitle: string;
    metaDescription: string;
    estimatedTimeToRead: number;
}

export async function getBlogs() {
    return asyncHandler(async () => {
        await ConnectDB();

        // const cacheKey = blogsRedis.all;
        // const cachedBlogs = await redis.get(cacheKey);
        // if (cachedBlogs) return JSON.parse(cachedBlogs);

        // const blogs: IBlogUser[] = await Blog.find()
        //     .sort({ createdAt: -1 })
        //     .populate("author", "first_name last_name");

        // await redis.set(cacheKey, JSON.stringify(blogs), "EX", 300);

        // return blogs;
    }, "GET /blogs error:")
}

export async function addBlog({ title, content, author, wallpaper, estimatedTimeToRead, metaTitle, metaDescription }: Blog) {
    return asyncHandler(async () => {
        await ConnectDB();

        if (!(await isAdmin())) return { error: "Access denied: Unauthorized" }

        if (!title || !content || !author || !wallpaper || !estimatedTimeToRead) return { error: "Please fill all required fields." }


        const user = await User.findById(author);
        if (!user) return { error: "Author not found." };

        // const blog = await Blog.create({
        //     title,
        //     content,
        //     author,
        //     wallpaper,
        //     estimatedTimeToRead,
        //     metaTitle,
        //     metaDescription,
        // });

        // await redis.del(blogsRedis.all);

        // return blog;
    }, "POST /blogs error:")
}

export async function getBlogById(id: string) {
    return asyncHandler(async () => {
        await ConnectDB();
        // const cacheKey = `${blogsRedis.byId}${id}`;

        // const cachedBlog = await redis.get(cacheKey);
        // if (cachedBlog) return JSON.parse(cachedBlog);

        // const blog = await Blog.findById(id).populate(
        //     "author",
        //     "first_name last_name"
        // );
        // if (!blog) return { message: "Not found" };

        // await redis.set(cacheKey, JSON.stringify(blog), "EX", 600);

        // console.log(blog);
        // return blog;
    }, "GET /blogs/:id error:")
}

export async function updateBlog(id: string, data: Blog) {
    return asyncHandler(async () => {
        await ConnectDB();
        if (!(await isAdmin())) return { error: "Access denied: Unauthorized" }

        // const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
        //     new: true,
        // });
        // if (!updatedBlog) return { message: "Not found" };

        // await redis.del(`${blogsRedis.byId}${id}`);
        // await redis.del(blogsRedis.all);

        // return updatedBlog;
    }, "PUT / blogs error:");
}

export async function deleteBlog(id: string) {
    return asyncHandler(async () => {
        await ConnectDB();
        if (!(await isAdmin())) return { error: "Access denied: Unauthorized" }

        // const deletedBlog = await Blog.findByIdAndDelete(id);
        // if (!deletedBlog) return { message: "Not found" };

        // await redis.del(`${blogsRedis.byId}${id}`);
        // await redis.del(blogsRedis.all);

        // return { message: "Deleted successfully" };
    }, "DELETE /blogs/:id error:");
}

export async function getLatestBlogs() {
    return asyncHandler(async () => {
        await ConnectDB();
        // const cacheKey = blogsRedis.latest;

        // const cached = await redis.get(cacheKey);
        // if (cached) return JSON.parse(cached);

        // const blogs = await Blog.find()
        //     .sort({ createdAt: -1 })
        //     .limit(5)
        //     .populate("author", "first_name last_name");

        // await redis.set(cacheKey, JSON.stringify(blogs), "EX", 300);

        // return blogs;
    }, "GET /blogs/latest-blogs error:");
}