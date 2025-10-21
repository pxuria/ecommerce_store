import { Metadata } from "next";
import Image from "next/image";
import FAQ from "@/components/shared/FAQ";
import Socials from "@/components/shared/Socials";
import AboutusDetails from "@/components/shared/AboutusDetails";
import { brandName, enBrandName } from "@/constants";

export const metadata: Metadata = {
  // title: "درباره مارین | فروشگاه آنلاین پوشاک زنانه و دخترانه | About Marin",
  // description:
  //   "مارین، فروشگاه آنلاین تخصصی پوشاک زنانه و دخترانه با ارائه جدیدترین و باکیفیت‌ترین محصولات از برندهای معتبر جهانی | Marin, Specialized Online Women's and Girls' Clothing Store",
  openGraph: {
    // title: "درباره مارین | فروشگاه آنلاین پوشاک زنانه و دخترانه",
    // description:
    //   "مارین، فروشگاه آنلاین تخصصی پوشاک زنانه و دخترانه با ارائه جدیدترین و باکیفیت‌ترین محصولات از برندهای معتبر جهانی",
    images: [
      {
        url: "/assets/images/about.jpg",
        width: 4413,
        height: 6620,
        alt: `${enBrandName} Fashion Store`,
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: 'https://${enBrandName}.com/about-us',
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
          <p className="text-lg font-bold text-primary-800">آدرس: تهران،افسریه،خیابان شهید عباسعلی طاهر پناه پلاک 177 طبقه 1</p>
          <p className="text-lg font-bold text-primary-800">کد پستی: 1786838654</p>
          <p className="text-lg font-bold text-primary-800">شماره تماس: 09129722530</p>
          <p className="text-lg font-bold text-primary-800">شماره ثابت: 02191016694</p>
          {/* <p className="text-lg mb-6 leading-relaxed">
            <strong className="text-lg font-bold text-pink_700">{brandName}</strong>{" "}
            یک فروشگاه آنلاین تخصصی در زمینه پوشاک زنانه و دخترانه است که با هدف
            ارائه جدیدترین و باکیفیت‌ترین محصولات از برندهای معتبر جهانی تأسیس
            شده است. ما با انتخاب دقیق مجموعه‌ای از لباس‌های مدرن، پینترستی، شیک
            و متناسب با سبک زندگی امروزی، تجربه‌ای لذت‌بخش از خرید اینترنتی را
            برای مشتریان خود فراهم می‌کنیم. در {brandName}، اولویت ما ارائه محصولاتی
            با کیفیت بالا، قیمت مناسب و تنوع گسترده است تا هر فرد بتواند استایل
            مورد علاقه خود را پیدا کند. تیم ما به‌طور مداوم در جستجوی جدیدترین
            ترندهای دنیای مد است و تضمین می‌کنیم که محصولات ارائه شده همواره
            به‌روز و مطابق با استانداردهای مخاطبان ما باشند. علاوه بر این، ما با
            پشتیبانی حرفه‌ای، ارسال سریع و خدمات مشتریان کارآمد، تلاش می‌کنیم تا
            فرآیند خرید را برای شما آسان و لذت‌بخش کنیم. اگر به دنبال استایل‌های
            جدید، لباس‌های باکیفیت و خریدی مطمئن هستید، {brandName} همراه شما خواهد
            بود. ما اینجاییم تا زیبایی و اعتماد‌به‌نفس را به استایل شما هدیه
            دهیم.🩷✨
          </p> */}
        </div>

        <div className="w-full lg:w-1/2">
          <Image
            src="/assets/images/about.jpg"
            width={4413}
            height={6620}
            alt="contact us"
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
