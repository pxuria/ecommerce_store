import { Metadata } from "next";
import Image from "next/image";
import ContactusForm from "@/components/forms/ContactusForm";
import FAQ from "@/components/shared/FAQ";
import Socials from "@/components/shared/Socials";
import ContactusText from "@/components/shared/ContactusText";
import { brandName, enBrandName } from "@/constants";

export const metadata: Metadata = {
  title: `تماس با ${brandName} | ارتباط با ما | Contact ${enBrandName}`,
  description: `برای ارتباط با ${brandName}، فروشگاه آنلاین تخصصی پارچه، می‌توانید از فرم تماس، شماره تلفن‌ها یا شبکه‌های اجتماعی ما استفاده کنید. تیم پشتیبانی ${brandName} همیشه آماده پاسخگویی به شماست.`,
  openGraph: {
    title: `تماس با ${brandName} | ارتباط با ما`,
    description: `با تیم ${brandName} تماس بگیرید — پاسخگوی سوالات، همکاری‌ها و سفارش‌های عمده انواع پارچه (مبل، لباس، پرده و دکوراسیون).`,
    url: `https://${enBrandName}.com/contact-us`,
    siteName: brandName,
    images: [
      {
        url: "/assets/images/about.jpg",
        width: 4413,
        height: 6620,
        alt: `تماس با ${brandName} - Contact ${enBrandName}`,
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: `https://${enBrandName}.com/contact-us`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <div className="custom_container">
      <section
        className="flex items-start justify-end flex-wrap lg:flex-nowrap gap-4 my-4"
        aria-label="فرم تماس و اطلاعات تماس"
      >
        <ContactusText />
        <ContactusForm />
      </section>

      <Socials />

      <section
        className="flex justify-between items-end flex-wrap lg:flex-nowrap gap-8 my-10"
        aria-label="شبکه‌های اجتماعی"
      >
        <FAQ />

        <div className="w-full lg:w-1/2">
          <Image
            src="/assets/images/about.jpg"
            width={4413}
            height={6620}
            alt={`تماس با ${brandName}`}
            className="w-full rounded-xl shadow-xl h-[460px] object-cover"
            loading="eager"
          />
        </div>
      </section>
    </div>
  );
};

export default page;
