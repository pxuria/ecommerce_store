import { footerLinks, footerPages, socials } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-yellow filter backdrop-blur-lg min-h-[400px] h-max text-white p-10 pb-12 pt-6 relative bottom-0 -z-12">
      <div className="flex items-start justify-between flex-wrap md:flex-nowrap gap-4 mt-12">
        <div className="w-full md:w-6/12 flex items-start flex-col gap-5">
          {/* <Image
            src="/assets/images/logoBG.png"
            alt="marin"
            width={480}
            height={480}
            className="w-20 h-20 rounded-xl"
          /> */}
          <h2 className="text-black text-2xl font-bold">LOGO</h2>
          <p className="text-base text-black">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و
            کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
          </p>
          <div className="flex_center gap-8">
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
                    {item.logo}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 justify-end mt-auto">
              {/* <Image
                src="/assets/images/enamad.svg"
                alt="enamad"
                width={48}
                height={48}
                className=""
              /> */}
              <div
                dangerouslySetInnerHTML={{
                  __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=583681&Code=VbL7Z2YeMOOggCMlAGvrJ5IdG12EiKT8'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=583681&Code=VbL7Z2YeMOOggCMlAGvrJ5IdG12EiKT8' class='w-8 h-8' alt='enamad' style='cursor:pointer' code='VbL7Z2YeMOOggCMlAGvrJ5IdG12EiKT8'></a>`,
                }}
              />
              {/* <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=583681&Code=VbL7Z2YeMOOggCMlAGvrJ5IdG12EiKT8"
              >
                <Image
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=583681&Code=VbL7Z2YeMOOggCMlAGvrJ5IdG12EiKT8"
                  className="w-8 h-8"
                  width={30}
                  height={30}
                  alt="enamad"
                  style={{ cursor: "pointer" }}
                  code="VbL7Z2YeMOOggCMlAGvrJ5IdG12EiKT8"
                />
              </a> */}

              <Image
                src="/assets/images/zarinpal.svg"
                alt="zarinpal"
                width={48}
                height={48}
                className=""
              />
            </div>
          </div>
        </div>

        <div className="w-[calc(50%-8px)] md:w-2/12 border-r-2 pr-4 border-[#0b14b6] min-w-[140px]">
          <h4 className="text-2xl font-bold text-[#0b14b6] mb-5">صفحات</h4>
          <ul className="flex-column gap-4">
            {footerPages.map((item, index) => (
              <li className="text-black text-nowrap" key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-[calc(50%-8px)] md:w-2/12 border-r-2 pr-4 border-[#0b14b6] min-w-[140px]">
          <h4 className="text-2xl font-bold text-[#0b14b6] mb-5">
            محصولات جدید
          </h4>
          <ul className="flex-column gap-4">
            {footerLinks.map((item, index) => (
              <li className="text-black text-nowrap" key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-[calc(50%-8px)] md:w-2/12 border-r-2 pr-4 border-[#0b14b6] min-w-[140px]">
          <h4 className="text-2xl font-bold text-[#0b14b6] mb-5">
            محصولات جدید
          </h4>
          <ul className="flex-column gap-4">
            {footerLinks.map((item, index) => (
              <li className="text-black text-nowrap" key={index}>
                <Link href={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* copy rights */}
      <div className="absolute w-full bg-light_purple h-8 bottom-0 right-0 flex_center">
        <span className="text-xs text-black font-medium">
          تمامی حقوق این سایت متعلق به تلاریو میباشد {year} ©
        </span>
      </div>
    </footer>
  );
};

export default Footer;
