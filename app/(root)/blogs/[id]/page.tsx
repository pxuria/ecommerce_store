import { Metadata } from "next";
import Image from "next/image";
import BlogPageSidebar from "@/components/shared/blogs/BlogPageSidebar";
import { formatDate, HttpError } from "@/utils/helpers";
import { IBlog } from "@/types/model";
import { redisKeys } from "@/constants/redis-keys";
import { cachedData, cacheWithTTL } from "@/utils/serverCache";
import prisma from "@/lib/db";


const fetchBlogById = async (id: number) => {
  const redisId = `${redisKeys.blogs.byId}${id}`;

  const cachedBlog = await cachedData(redisId);
  if (cachedBlog) return { ...JSON.parse(cachedBlog) };

  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) throw new HttpError('Blog not found', 404);

  await cacheWithTTL(redisId, JSON.stringify(blog), 300);
  return blog as IBlog;
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await fetchBlogById(Number(params.id)) as IBlog;

  if (!blog || "error" in blog || "message" in blog) {
    return {
      title: "مطلب یافت نشد",
      description: "این مطلب وجود ندارد یا حذف شده است.",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.content?.slice(0, 160),
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.content?.slice(0, 160),
      images: [blog.coverImage],
    },
  };
}

const page = async ({ params }: { params: { id: string } }) => {
  const blog = await fetchBlogById(Number(params.id)) as IBlog;
  console.log('BLOG::', blog)

  return (
    <section className="md:container md:mx-auto mt-16">
      <div className="flex items-start flex-nowrap gap-4">
        <div className="bg-lightBlack rounded-3xl px-8 py-2 w-full xl:w-2/3">
          <h1 className="text-4xl font-semibold">{blog.title}</h1>

          <div className="flex flex-wrap justify-between items-center my-4">
            <div className="flex items-center justify-start flex-nowrap gap-2">
              {blog.createdAt && (
                <span className="text-sm text-[#3e3e3e] font-medium">
                  {formatDate(blog.createdAt.toString())}
                </span>
              )}
            </div>
            {blog.estimatedTimeToRead ? (
              <span className="text-sm text-secondary-700 font-medium">
                خواندن این مطلب {blog.estimatedTimeToRead} دقیقه زمان میبرد
              </span>
            ) : null}
          </div>

          <Image
            src={blog.coverImage || "assets/images/candles.svg"}
            alt={blog.title}
            width={450}
            height={200}
            className="w-full object-cover rounded-2xl max-h-[450px] shadow"
          />

          <div
            className="mt-8 mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <BlogPageSidebar />
      </div>
    </section>
  );
};

export default page;
