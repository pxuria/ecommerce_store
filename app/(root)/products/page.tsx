import type { Metadata } from "next";
import ProductsList from "@/components/shared/ProductsList";
import { brandName, enBrandName } from "@/constants";

export const metadata: Metadata = {
  title: `خرید انواع پارچه با بهترین قیمت | فروشگاه ${brandName} (${enBrandName})`,
  description:
    "فروشگاه اینترنتی عرشیان بافت ارائه‌دهنده انواع پارچه مجلسی، نخی، کتانی، مخمل، ساتن و اسپرت با کیفیت بالا و قیمت مناسب. ارسال سریع به سراسر کشور.",
  keywords: [
    "عرشیان بافت",
    "ArshianBaft",
    "فروشگاه پارچه",
    "خرید پارچه",
    "پارچه نخی",
    "پارچه مجلسی",
    "پارچه مخمل",
    "پارچه ساتن",
    "پارچه اسپرت",
    "فروش پارچه",
  ],
  openGraph: {
    title:
      `${brandName} | فروشگاه اینترنتی پارچه با کیفیت و قیمت مناسب (${enBrandName})`,
    description:
      `در ${brandName} بهترین پارچه‌ها را برای دوخت لباس، مانتو، کت و دامن با قیمت رقابتی و ارسال سریع تهیه کنید.`,
    type: "website",
    locale: "fa_IR",
    url: "https://arshianbaft.com/products",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `فروشگاه پارچه ${brandName}`,
      },
    ],
  },
  alternates: {
    canonical: "https://arshianbaft.com/products",
  },
};

const Page = () => {

  return <ProductsList />;
};

export default Page;