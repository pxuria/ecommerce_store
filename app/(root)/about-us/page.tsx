import { Metadata } from "next";
import Image from "next/image";
import FAQ from "@/components/shared/FAQ";
import Socials from "@/components/shared/Socials";
import AboutusDetails from "@/components/shared/AboutusDetails";
import { brandName, enBrandName } from "@/constants";

export const metadata: Metadata = {
  title: `درباره ${brandName} | فروشگاه آنلاین انواع پارچه | About ${enBrandName}`,
  description: `${brandName}، مرجع تخصصی فروش آنلاین انواع پارچه از جمله پارچه مبل، پرده، لباس و دکوراسیون داخلی. ارائه بهترین کیفیت و جدیدترین طرح‌ها از معتبرترین برندهای ایرانی و خارجی.`,
  openGraph: {
    title: `درباره ${brandName} | فروشگاه آنلاین انواع پارچه`,
    description: `${brandName} عرضه‌کننده متنوع‌ترین پارچه‌های ایرانی و خارجی شامل پارچه مبل، پرده، لباس، کوسن، و دکوراسیون.`,
    url: `https://${enBrandName}.com/about-us`,
    siteName: brandName,
    images: [
      {
        url: "/assets/images/about.jpg",
        width: 4413,
        height: 6620,
        alt: `${enBrandName} Online Fabric Store`,
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: `https://${enBrandName}.com/about-us`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <>
      <section
        className="mt-10 flex items-center justify-between lg:flex-nowrap flex-wrap-reverse gap-8 mb-14 custom_container"
        aria-label={`معرفی ${brandName}`}
      >
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            درباره{" "}
            <strong className="text-3xl font-bold text-primary-900">{brandName}</strong>
          </h2>
          <p className="text-lg mb-6 leading-relaxed">
            <strong className="text-lg font-bold text-primary-900">{brandName}</strong>{" "}
            در دنیای زیبایی‌ها، جایی که خانه به آینه‌ای از روح و سلیقه ساکنانش تبدیل می‌شود،پارچه عرشیان بافت نه به عنوان یک فروشگاه، که به عنوان یک «آرتیستِ خانه‌آرایی» متولد شد. ما باور داریم که پارچه، تنها یک پوشش نیست؛ نفس یک فضاست. نوازشگر نگاه‌ها، نگهدارنده خاطرات و ترجمانِ سلیقه‌ای است که از ظرافت می‌گوید.

            ما در پارچه عرشیان بافت، با عشقی پایان‌ناپذیر به هنر و صنعت، گردآورنده نفیس‌ترین و مرغوب‌ترین پارچه‌های مبل، پرده و دکوراسیون از چهارگوشه جهان هستیم. از ابریشم‌های نرم ایتالیایی که با خورشید رقابت می‌کنند، تا کتان‌های طبیعی و بادوام اروپایی که بوی اصالت می‌دهند؛ از طرح‌های کلاسیک و شاهانه تا مدرن‌ترین و مینیمال‌ترین بافت‌ها.
          </p>
          <p className="text-lg font-bold text-primary-800">آدرس: تهران،افسریه شهرک مسعودیه، خیابان شهید فتح الله مرادی امید، خیابان شهید عباسعلی طاهر پناه پلاک 177 طبقه 1</p>
          <p className="text-lg font-bold text-primary-800">کد پستی: 1786838654</p>
          <p className="text-lg font-bold text-primary-800">شماره تماس با ما: 09129722530</p>
          <p className="text-lg font-bold text-primary-800">شماره ثابت: 02191016694</p>
        </div>

        <div className="w-full lg:w-1/2">
          <Image
            src="/assets/images/about.jpg"
            width={4413}
            height={6620}
            alt={`درباره ${brandName}`}
            className="w-full rounded-xl shadow-xl h-[460px] object-cover"
            loading="eager"
          />
        </div>
      </section>

      <AboutusDetails />

      <section className="flex items-center justify-between gap-4 flex-wrap-reverse lg:flex-nowrap my-12 custom_container">
        <FAQ />
        <Socials />
      </section>
    </>
  );
};

export default page;
