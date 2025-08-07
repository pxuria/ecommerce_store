import { Metadata } from "next";
import Image from "next/image";
import BlogPageSidebar from "@/components/shared/blogs/BlogPageSidebar";
import { formatDate } from "@/utils/helpers";
import { getBlogById } from "@/lib/actions/blog.action";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const blog = await getBlogById(params.id);

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
      images: [blog.wallpaper],
    },
  };
}

const page = async ({ params }: { params: { id: string } }) => {
  const blog = await getBlogById(params.id)

  return (
    <section className="md:container md:mx-auto mt-16">
      <div className="flex items-start flex-nowrap gap-4">
        <div className="bg-lightBlack rounded-3xl px-8 py-2 w-full xl:w-2/3">
          <h1 className="text-4xl font-semibold text-white">{blog.title}</h1>

          <div className="flex flex-wrap justify-between items-center my-4">
            <div className="flex items-center justify-start flex-nowrap gap-2">
              <span className="text-sm text-white font-medium">
                {blog.author?.first_name} {blog.author?.last_name}
              </span>
              {blog.createdAt && (
                <span className="text-sm text-[#818181] font-medium">
                  {formatDate(blog.createdAt.toString())}
                </span>
              )}
            </div>
            {blog.estimatedTimeToRead ? (
              <span className="text-sm text-purple_500 font-medium">
                خواندن این مطلب {blog.estimatedTimeToRead} دقیقه زمان میبرد
              </span>
            ) : null}
          </div>

          <Image
            src={blog.wallpaper || "assets/images/candles.svg"}
            alt={blog.title}
            width={450}
            height={200}
            className="w-full object-cover rounded-2xl max-h-[450px] shadow"
          />

          <div
            className="mt-8 mb-12 leading-8 text-base font-normal text-white"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <BlogPageSidebar />
      </div>
    </section>
  );
};

export default page;
