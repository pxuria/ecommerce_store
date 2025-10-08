import { brandName } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const socials = [
  {
    href: 'https://instagram.com/marin',
    ariaLabel: `اینستاگرام ${brandName}`,
    icon: '/assets/images/instagram.svg'
  },
  {
    href: 'https://t.me/marin',
    ariaLabel: `تلگرام ${brandName}`,
    icon: '/assets/images/telegram.svg'
  },
  {
    href: 'https://wa.me/yourwhatsappnumber',
    ariaLabel: `واتساپ پشتیبانی ${brandName}`,
    icon: '/assets/images/whatsapp.svg'
  }
]

const Socials = () => {
  return (
    <section className="py-10 px-4 max-w-3xl mx-auto text-center mt-12">
      <h2 className="text-2xl font-bold mb-4">
        ما را در شبکه‌های اجتماعی دنبال کنید
      </h2>
      <p className="text-lg font-medium mb-6 text-primary-900">
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
            <Image
              width={32}
              height={32}
              src={social.icon}
              alt={social.ariaLabel} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Socials;
