import { brandName } from "@/constants";
import Link from "next/link";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const socials = [
  {
    href: 'https://instagram.com/marin',
    ariaLabel: `اینستاگرام ${brandName}`,
    icon: <FaInstagram className="text-pink-600 hover:text-pink_800 transition" />
  },
  {
    href: 'https://t.me/marin',
    ariaLabel: `تلگرام ${brandName}`,
    icon: <FaTelegramPlane className="text-[#3AA9EA] hover:text-blue_700 transition" />
  },
  {
    href: 'https://wa.me/yourwhatsappnumber',
    ariaLabel: `واتساپ پشتیبانی ${brandName}`,
    icon: <FaWhatsapp className="text-[#40C043] hover:text-green-600 transition" />
  }
]

const Socials = () => {
  return (
    <section className="py-10 px-4 max-w-3xl mx-auto text-center mt-12">
      <h2 className="text-2xl font-bold mb-4">
        ما را در شبکه‌های اجتماعی دنبال کنید
      </h2>
      <p className="text-lg font-medium mb-6 text-pink_700">
        با دنبال کردن {brandName} در شبکه‌های اجتماعی، از جدیدترین محصولات و تخفیف‌های
        ویژه باخبر شوید.
      </p>
      <div className="flex justify-center gap-6 text-3xl">
        {socials.map(social => (
          <Link
            target="_blank"
            key={social.href}
            href={social.href}
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
          >
            {social.icon}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Socials;
