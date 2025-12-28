import type { Metadata } from "next";
import ProductsList from "@/components/shared/ProductsList";

export const metadata: Metadata = {
  title: "خرید انواع پارچه با بهترین قیمت | فروشگاه عرشیان بافت (ArshianBaft)",
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
      "آرشیان بافت | فروشگاه اینترنتی پارچه با کیفیت و قیمت مناسب (ArshianBaft)",
    description:
      "در آرشیان بافت بهترین پارچه‌ها را برای دوخت لباس، مانتو، کت و دامن با قیمت رقابتی و ارسال سریع تهیه کنید.",
    type: "website",
    locale: "fa_IR",
    url: "https://arshianbaft.com/products",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "فروشگاه پارچه آرشیان بافت",
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