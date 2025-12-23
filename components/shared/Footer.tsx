'use client';

import { footerPages, socials } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary-100 filter backdrop-blur-lg min-h-[400px] h-max text-white p-10 pb-12 pt-6 relative bottom-0 -z-12">
      <div className="flex items-start justify-between flex-wrap md:flex-nowrap gap-4 mt-12">
        <div className="w-full md:w-1/2 flex items-start flex-col gap-5">
          <Image
            src="/assets/images/logo.webp"
            alt="arshianbaft"
            width={480}
            height={480}
            className="w-20 h-20 rounded-xl"
          />
          <p className="text-base text-black">
            ما باور داریم که پارچه، تنها یک پوشش نیست؛ نفس یک فضاست. نوازشگر نگاه‌ها، نگهدارنده خاطرات و ترجمانِ سلیقه‌ای است که از ظرافت می‌گوید. ما در پارچه عرشیان بافت، با عشقی پایان‌ناپذیر به هنر و صنعت، گردآورنده نفیس‌ترین و مرغوب‌ترین پارچه‌های مبل، پرده و دکوراسیون از چهارگوشه جهان هستیم. از ابریشم‌های نرم ایتالیایی که با خورشید رقابت می‌کنند، تا کتان‌های طبیعی و بادوام اروپایی که بوی اصالت می‌دهند؛ از طرح‌های کلاسیک و شاهانه تا مدرن‌ترین و مینیمال‌ترین بافت‌ها
          </p>
        </div>

        <div className="w-[calc(50%-8px)] md:w-2/12 border-r-2 pr-4 border-secondary-700 min-w-[140px]">
          <h4 className="text-2xl font-bold text-secondary-700 mb-5">صفحات</h4>
          <ul className="flex-column gap-4">
            {footerPages.map((item, index) => (
              <li className="text-black text-nowrap" key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-[calc(50%-8px)] md:w-4/12 flex_center flex-wrap gap-8">
          {/* socials */}
          <ul className="flex_center gap-4 mt-3">
            {socials.map((item, index) => (
              <li className="footer-social_link relative" key={index}>
                <Link
                  data-social={item.name}
                  aria-label={item.name}
                  href={item.link}
                  className={`relative overflow-hidden flex_center w-10 h-10 rounded-full text-[#4d4d4d] bg-white transition-all ease-in-out duration-300`}
                >
                  <div
                    className="filled"
                    style={{ backgroundColor: item.color }}
                  ></div>

                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={16}
                    height={16}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-stretch flex-wrap justify-center gap-4 mt-auto">
            <div className="p-2 rounded-lg border-2 border-white">
              <div
                className="min-w-[90px] h-[116px] aspect-square"
                dangerouslySetInnerHTML={{
                  __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=647497&Code=MM6TkbvEyvYFNeElexjjqHOIsm5PF8QW'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=647497&Code=MM6TkbvEyvYFNeElexjjqHOIsm5PF8QW' alt='' style='cursor:pointer' code='MM6TkbvEyvYFNeElexjjqHOIsm5PF8QW'></a>`,
                }}
              />
            </div>

            <div className="p-2 rounded-lg border-2 border-white">
              <div
                className="min-w-[90px] h-[116px] aspect-square"
                dangerouslySetInnerHTML={{
                  __html: `<img referrerpolicy='origin' width='' id = 'rgvjsizpapfuoeukjxlzesgt' style = 'cursor:pointer' onclick = 'window.open("https://logo.samandehi.ir/Verify.aspx?id=395810&p=xlaopfvldshwmcsirfthobpd", "Popup","toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30")' alt = 'logo-samandehi' src = 'https://logo.samandehi.ir/logo.aspx?id=395810&p=qftibsiyujynaqgwnbpdlyma' />`,
                }}
              />
            </div>

            <div className="p-2 rounded-lg border-2 border-white">
              <Image
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Im0xMjAgMjQzbDk0LTU0IDAtMTA5IC05NCA1NCAwIDEwOSAwIDB6IiBmaWxsPSIjODA4Mjg1Ii8+Cgk8cGF0aCBkPSJtMTIwIDI1NGwtMTAzLTYwIDAtMTE5IDEwMy02MCAxMDMgNjAgMCAxMTkgLTEwMyA2MHoiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDo1O3N0cm9rZTojMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjE0IDgwbC05NC01NCAtOTQgNTQgOTQgNTQgOTQtNTR6IiBmaWxsPSIjMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjYgODBsMCAxMDkgOTQgNTQgMC0xMDkgLTk0LTU0IDAgMHoiIGZpbGw9IiM1ODU5NWIiLz4KCTxwYXRoIGQ9Im0xMjAgMTU3bDQ3LTI3IDAtMjMgLTQ3LTI3IC00NyAyNyAwIDU0IDQ3IDI3IDQ3LTI3IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTU7c3Ryb2tlOiNmZmYiLz4KCTx0ZXh0IHg9IjE1IiB5PSIzMDAiIGZvbnQtc2l6ZT0iMjVweCIgZm9udC1mYW1pbHk9IidCIFlla2FuJyIgc3R5bGU9ImZpbGw6IzI5Mjk1Mjtmb250LXdlaWdodDpib2xkIj7Yudi22Ygg2KfYqtit2KfYr9uM2Ycg2qnYtNmI2LHbjDwvdGV4dD4KCTx0ZXh0IHg9IjgiIHk9IjM0MyIgZm9udC1zaXplPSIyNXB4IiBmb250LWZhbWlseT0iJ0IgWWVrYW4nIiBzdHlsZT0iZmlsbDojMjkyOTUyO2ZvbnQtd2VpZ2h0OmJvbGQiPtqp2LPYqCDZiCDaqdin2LHZh9in24wg2YXYrNin2LLbjDwvdGV4dD4KPC9zdmc+"
                alt="Verification badge"
                width={70}
                height={120}
                unoptimized
                className='min-w-[90px] h-[116px] aspect-square cursor-pointer'
                onClick={() =>
                  window.open(
                    "https://ecunion.ir/verify/arshianbaft.com?token=570963968ff20ae43a8d",
                    "Popup",
                    "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30"
                  )
                }
              />
            </div>

            <div className="p-2 rounded-lg border-2 border-white">
              <Image
                src="/assets/images/zarinpal.svg"
                alt="zarinpal"
                className='min-w-[90px] h-[116px] aspect-square cursor-pointer'
                width={80}
                height={80}
              />
            </div>
          </div>
        </div>

        {/* <div className="w-[calc(50%-8px)] md:w-2/12 border-r-2 pr-4 border-secondary-700 min-w-[140px]">
          <h4 className="text-2xl font-bold text-secondary-700 mb-5">
            محصولات جدید
          </h4>
          <ul className="flex-column gap-4">
            {footerLinks.map((item, index) => (
              <li className="text-black text-nowrap" key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div> */}

        {/* <div className="w-[calc(50%-8px)] md:w-2/12 border-r-2 pr-4 border-secondary-700 min-w-[140px]">
          <h4 className="text-2xl font-bold text-secondary-700 mb-5">
            محصولات جدید
          </h4>
          <ul className="flex-column gap-4">
            {footerLinks.map((item, index) => (
              <li className="text-black text-nowrap" key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* copy rights */}
      <div className="absolute w-full bg-secondary-700 h-8 bottom-0 right-0 flex_center">
        <span className="text-xs text-white font-medium">
          تمامی حقوق این سایت متعلق به تلاریو میباشد {year} ©
        </span>
      </div>
    </footer>
  );
};

export default Footer;
