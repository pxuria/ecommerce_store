import { Metadata } from "next";
import Carousel from "@/components/shared/Carousel";
import HomeFeatures from "@/components/home/HomeFeatures";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsList from "@/components/home/ProductsList";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین | صفحه اصلی",
  description:
    "فروشگاه آنلاین با بهترین محصولات و قیمت‌های مناسب. خرید آسان و مطمئن با ضمانت اصل بودن کالا",
  keywords: "فروشگاه آنلاین، خرید اینترنتی، محصولات با کیفیت، قیمت مناسب",
  openGraph: {
    title: "فروشگاه آنلاین | صفحه اصلی",
    description: "فروشگاه آنلاین با بهترین محصولات و قیمت‌های مناسب",
    images: [{ url: "/assets/images/bg-1.jpg" }],
  },
};

const page = () => {
  return (
    <>
      <HeroSlider />

      <Carousel
        title="محصولات جدید"
        side="right"
        seeAllLink="products"
        carouselBg="white"
        api="products?limit=16&sortBy=createdAt&sortOrder=desc"
      />

      <Carousel
        title="محصولات پرفروش"
        seeAllLink="products"
        carouselClass="z-10"
        api="products/most-ordered"
      />

      <Carousel
        title="آخرین بلاگ‌ها"
        type='blog'
        seeAllLink="blogs"
        carouselClass="z-10"
        api="blogs?limit=16"
      />

      <ProductsList />

      <HomeFeatures />
    </>
  );
};

export default page;
