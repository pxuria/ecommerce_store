import { Metadata } from "next";
import Image from "next/image";
import ContactusForm from "@/components/forms/ContactusForm";
import FAQ from "@/components/shared/FAQ";
import Socials from "@/components/shared/Socials";
import ContactusText from "@/components/shared/ContactusText";
import { enBrandName } from "@/constants";

export const metadata: Metadata = {
  title: "تماس با مارین | ارتباط با فروشگاه آنلاین پوشاک زنانه | Contact Marin",
  description:
    "با ما در ارتباط باشید - پشتیبانی ۲۴/۷ فروشگاه مارین، متخصص در ارائه پوشاک زنانه و دخترانه | Contact Marin - 24/7 Support for Women's Fashion Store",
  keywords:
    "تماس با مارین, پشتیبانی مارین, ارتباط با ما, خرید لباس آنلاین, فروشگاه لباس زنانه, contact marin, marin support",
  openGraph: {
    title: "تماس با مارین | ارتباط با فروشگاه آنلاین پوشاک زنانه",
    description:
      "با ما در ارتباط باشید - پشتیبانی ۲۴/۷ فروشگاه مارین، متخصص در ارائه پوشاک زنانه و دخترانه",
    images: [
      {
        url: "/assets/images/pic5.jpg",
        width: 4413,
        height: 6620,
        alt: "تماس با مارین - Contact Marin",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: "https://marin.com/contact-us",
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

        <div className="relative w-full lg:w-1/2">
          <Image
            src="/assets/images/outlined_logo.png"
            alt={enBrandName}
            width={435}
            height={142}
            className="w-28 h-9 absolute left-4 top-4"
            priority
          />
          <Image
            src="/assets/images/pic5.jpg"
            width={4413}
            height={6620}
            alt="contact us"
            className="w-full rounded-xl shadow-xl h-[460px] object-cover"
            loading="eager"
          />
        </div>
      </section>
    </div>
  );
};

export default page;
