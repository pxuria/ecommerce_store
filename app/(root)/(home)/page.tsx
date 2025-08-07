import { Metadata } from "next";
import Image from "next/image";
import Carousel from "@/components/shared/Carousel";
import Categories from "@/components/home/Categories";
import HomeFeatures from "@/components/home/HomeFeatures";
import ExpandableCards from "@/components/shared/ExpandableCards";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین | صفحه اصلی",
  description:
    "فروشگاه آنلاین با بهترین محصولات و قیمت‌های مناسب. خرید آسان و مطمئن با ضمانت اصل بودن کالا",
  keywords: "فروشگاه آنلاین، خرید اینترنتی، محصولات با کیفیت، قیمت مناسب",
  openGraph: {
    title: "فروشگاه آنلاین | صفحه اصلی",
    description: "فروشگاه آنلاین با بهترین محصولات و قیمت‌های مناسب",
    images: [{ url: "/assets/images/banner.jpg" }],
  },
};

const page = () => {
  return (
    <>
      <Categories />
      <div className="relative w-full">
        <Carousel
          title="محصولات جدید"
          side="right"
          seeAllLink="products"
          carouselBg="white"
          api="products/newest"
        />
      </div>
      <ExpandableCards />
      <div className="relative w-full mt-20 z-0">
        <Image
          src="/assets/images/dots.svg"
          alt="vector"
          width={170}
          height={220}
          className="absolute right-1 -top-12 opacity-25 -z-10"
        />
        <Carousel
          title="محصولات پرفروش"
          seeAllLink="products  "
          carouselClass="z-10"
          api="products/best-selling"
        />
      </div>
      <HomeFeatures />
    </>
  );
};

export default page;
