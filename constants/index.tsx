import {
  FaGifts,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { Bounce, ToastOptions, ToastPosition } from "react-toastify";
import { MdOutlineBookmark } from "react-icons/md";
import supportLottie from "../public/assets/lotties/support.json";
import originalLottie from "../public/assets/lotties/original.json";
import returnLottie from "../public/assets/lotties/gift-on-the-way.json";
import deliveryLottie from "../public/assets/lotties/delivery-service.json";
import payLottie from "../public/assets/lotties/pay.json";
import { IoBagAdd } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";

export const brandName = 'مارین';
export const enBrandName = 'marin';

export const navbarLinks = [
  {
    label: "صفحه اصلی",
    link: "/",
  },
  {
    label: "محصولات",
    link: "/products",
  },
  {
    label: "درباره ما",
    link: "/about-us",
  },
  {
    label: "تماس با ما",
    link: "/contact-us",
  },
];

export const mobileNavbarLinks = [
  {
    label: "صفحه اصلی",
    link: "/",
  },
  {
    label: "محصولات",
    link: "/products",
  },
  {
    label: "درباره ما",
    link: "/about-us",
  },
  {
    label: "تماس با ما",
    link: "/contact-us",
  },
  {
    label: "سبد خرید",
    link: "/dashboard?tab=orders",
  },
];

export const toasterOptions: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export const socials = [
  {
    link: "www.whatsapp.com",
    name: "whatsapp",
    logo: <FaWhatsapp />,
    color: "#128c7e",
  },
  {
    link: "www.telegram.com",
    name: "telegram",
    logo: <FaTelegramPlane />,
    color: "#369fdb",
  },
  {
    link: "www.instagram.com",
    name: "instagram",
    logo: <FaInstagram />,
    color: "#e1306c",
  },
];

export const footerPages = [
  {
    name: "صفحه اصلی",
    link: "/",
  },
  {
    name: "محصولات",
    link: "/products",
  },
  {
    name: "درباره ما",
    link: "/about-us",
  },
  {
    name: "تماس با ما",
    link: "/contact-us",
  },
];

export const footerLinks = [
  {
    name: "محصول 1",
    link: "/products/1",
  },
  {
    name: "محصول 2",
    link: "/products/2",
  },
  {
    name: "محصول 3",
    link: "/products/3",
  },
  {
    name: "محصول 4",
    link: "/products/4",
  },
];

export const aboutusItems = [
  {
    lottie: supportLottie,
    width: "w-28",
    height: "w-28",
    title: "7 روز هفته، 24 ساعته",
  },
  {
    lottie: originalLottie,
    width: "w-28",
    height: "w-28",
    title: "ضمانت اصالت کالا",
  },
  {
    lottie: returnLottie,
    width: "w-32",
    height: "w-32",
    title: "7 روز ضمانت بازگشت کالا",
  },
  {
    lottie: deliveryLottie,
    width: "w-32",
    height: "w-32",
    title: "امکان تحویل اکسپرس",
  },
  {
    lottie: payLottie,
    width: "w-28",
    height: "w-28",
    title: "پرداخت آسان و امن",
  },
];

export const products = [
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
  {
    image: "/assets/images/hat.webp",
    link: "https://example.com/products/1",
    title: "Wireless Bluetooth Headphones",
    price: "3.999.999",
    stars: 4.5,
  },
];

export const categories = [
  {
    name: "شلوارک",
    enName: "pants",
    icon: "/assets/images/pants.svg",
    bg: "var(--pink-300)",
  },
  {
    name: "کاپشن",
    enName: "puffer-jacket",
    icon: "/assets/images/puffer-jacket.svg",
    bg: "var(--blue-300)",
  },
  {
    name: "جوراب",
    enName: "socks",
    icon: "/assets/images/socks.svg",
    bg: "var(--yellow-300)",
  },
  {
    name: "عینک",
    enName: "glasses",
    icon: "/assets/images/glasses.svg",
    bg: "var(--purple-400)",
  },
  {
    name: "تیشرت",
    enName: "tshirt",
    icon: "/assets/images/tshirt.svg",
    bg: "var(--orange-500)",
  },
  {
    name: "کراپ تاپ",
    enName: "crop-top",
    icon: "/assets/images/socks.svg",
    bg: "var(--pink-300)",
  },
  {
    name: "کلاه",
    enName: "hat",
    icon: "/assets/images/cap.svg",
    bg: "var(--blue-300)",
  },
  {
    name: "هودی",
    enName: "hoodie",
    icon: "/assets/images/hoodie.svg",
    bg: "var(--yellow-300)",
  },
];

export const sizes = ["sm", "md", "lg", "xl", "2xl", "3xl"];
export const colors = ["red", "blue", "black", "purple"];

export const dashboardTabs = [
  {
    name: "حساب کاربری",
    dashName: "profile",
    icon: <IoMdPerson className="w-5 h-5" />,
  },
  {
    name: "سفارشات",
    dashName: "orders",
    icon: <FaGifts className="w-5 h-5" />,
  },
  {
    name: "علاقه مندی ها",
    dashName: "bookmarks",
    icon: <MdOutlineBookmark className="w-5 h-5" />,
  },
];

export const dashboardAdminTabs = [
  {
    name: "افزودن محصول",
    dashName: "add_product",
    icon: <IoBagAdd className="w-5 h-5" />,
  },
  {
    name: "افزودن بلاگ",
    dashName: "add_blog",
    icon: <IoMdPerson className="w-5 h-5" />,
  },
  {
    name: "افزودن دسته بندی",
    dashName: "add_category",
    icon: <BiSolidCategory className="w-5 h-5" />,
  }
]

export const profileFields = [
  {
    name: "first_name",
    label: "نام",
    type: "text",
  },
  {
    name: "last_name",
    label: "نام خانوادگی",
    type: "text",
  },
  {
    name: "email",
    label: "ایمیل",
    type: "email",
  },
  {
    name: "phone",
    label: "شماره همراه",
    type: "text",
  },
  {
    name: "instagram",
    label: "پیج اینستاگرام",
    type: "text",
  },
  {
    name: "address",
    label: "آدرس",
    type: "text",
  },
  {
    name: "city",
    label: "شهر",
    type: "text",
  },
  {
    name: "postal_code",
    label: "کد پستی",
    type: "text",
  },
  {
    name: "password",
    label: "رمز عبور جدید",
    type: "password",
  },
  {
    name: "confirm_password",
    label: "تکرار رمز عبور جدید",
    type: "password",
  },
];

export const contactusFormFields = [
  {
    label: "نام",
    type: "text",
    name: "name",
  },
  {
    label: "شماره همراه",
    type: "tel",
    name: "phone",
  },
  {
    label: "موضوع",
    type: "text",
    name: "subject",
  },
];

export const FAQItems = [
  {
    value: "q1",
    question: `چگونه می‌توانم در ${brandName} خرید کنم؟`,
    answer:
      `برای خرید از ${brandName}، کافی است محصولات مورد نظر خود را به سبد خرید اضافه کرده و پس از ثبت اطلاعات و پرداخت، سفارش خود را تکمیل کنید.`,
  },
  {
    value: "q2",
    question: "ارسال سفارشات چقدر زمان می‌برد؟",
    answer:
      "زمان ارسال سفارشات بسته به موقعیت جغرافیایی شما متفاوت است، اما معمولاً بین ۲ تا ۵ روز کاری زمان می‌برد.",
  },
  {
    value: "q3",
    question: "آیا امکان بازگشت و تعویض کالا وجود دارد؟",
    answer:
      "بله، شما می‌توانید تا ۷ روز پس از دریافت کالا، در صورت داشتن شرایط بازگشت، محصول را مرجوع یا تعویض کنید.",
  },
  {
    value: "q4",
    question: "چگونه می‌توانم سایز مناسب خود را انتخاب کنم؟",
    answer:
      "برای انتخاب سایز مناسب، به راهنمای سایزبندی که در صفحه هر محصول قرار دارد مراجعه کنید یا با پشتیبانی ما تماس بگیرید.",
  },
  {
    value: "q5",
    question: `روش‌های پرداخت در ${brandName} چگونه است؟`,
    answer:
      "شما می‌توانید با استفاده از کارت‌های بانکی عضو شبکه شتاب پرداخت خود را به صورت آنلاین انجام دهید.",
  },
  {
    value: "q6",
    question: `چگونه با پشتیبانی ${brandName} تماس بگیرم؟`,
    answer:
      "شما می‌توانید از طریق واتساپ، تلگرام یا ایمیل با تیم پشتیبانی ما در ارتباط باشید.",
  },
];
