import { Metadata } from "next";
import Carousel from "@/components/shared/Carousel";
import HomeFeatures from "@/components/home/HomeFeatures";
import HeroSlider from "@/components/home/HeroSlider";

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
      <HeroSlider />

      <Carousel
        title="محصولات جدید"
        side="right"
        seeAllLink="products"
        carouselBg="white"
        api="products/newest"
      />

      <Carousel
        title="محصولات پرفروش"
        seeAllLink="products  "
        carouselClass="z-10"
        api="products/best-selling"
      />

      <HomeFeatures />
    </>
  );
};

export default page;
