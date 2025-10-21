import supportLottie from "../public/assets/lotties/support.json";
import originalLottie from "../public/assets/lotties/original.json";
import returnLottie from "../public/assets/lotties/gift-on-the-way.json";
import deliveryLottie from "../public/assets/lotties/delivery-service.json";
import payLottie from "../public/assets/lotties/pay.json";
import { Bookmark, Boxes, ChartColumnBig, Gift, LandPlot, Newspaper, Package, Palette, Tag, User, Users } from "lucide-react";


export const brandName = 'عرشیان بافت';
export const enBrandName = 'arshianbaft';

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
  }
];

export const socials = [
  {
    link: "www.whatsapp.com",
    name: "whatsapp",
    logo: '/assets/images/WhatsappLogo.svg',
    color: "#128c7e",
  },
  {
    link: "www.telegram.com",
    name: "telegram",
    logo: '/assets/images/TelegramLogo.svg',
    color: "#369fdb",
  },
  {
    link: "www.instagram.com",
    name: "instagram",
    logo: '/assets/images/InstagramLogo.svg',
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


export const sizes = ["sm", "md", "lg", "xl", "2xl", "3xl"];
export const colors = ["red", "blue", "black", "purple"];

export const dashboardTabs = [
  {
    name: "حساب کاربری",
    dashName: "profile",
    icon: User
  },
  {
    name: "سفارشات",
    dashName: "orders",
    icon: Gift
  },
  {
    name: "علاقه مندی ها",
    dashName: "bookmarks",
    icon: Bookmark
  }
];

export const dashboardAdminTabs = [
  {
    name: "گزارشات",
    dashName: "logs",
    icon: ChartColumnBig
  },
  {
    name: "بلاگ ها",
    dashName: "blogs",
    icon: Newspaper
  },
  {
    name: "محصولات",
    dashName: "products",
    icon: Package
  },
  {
    name: "دسته بندی محصولات",
    dashName: "product_category",
    icon: Boxes
  },
  {
    name: "رنگ ها",
    dashName: "colors",
    icon: Palette
  },
  {
    name: "کشور ها",
    dashName: "countries",
    icon: LandPlot
  },
  {
    name: "برند ها",
    dashName: "brands",
    icon: Tag
  },
  {
    name: "لیست کاربران",
    dashName: "users-list",
    icon: Users
  }
]

export const profileFields = [
  {
    name: "firstName",
    label: "نام",
    type: "text",
  },
  {
    name: "lastName",
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
    name: "postalCode",
    label: "کد پستی",
    type: "text",
  }
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
    question: 'شرایط بازگشت کالا چگونه است؟',
    answer: 'متاسفانه به دلیل برش پارچه ها بر اساس سفارش مشتری، امکان بازگشت کالا وجود ندارد. ما با هر سفارش، پارچه ها را به اندازه های دقیق مشتریان برش می دهیم تا نیازهای خاص آن هارا برآورده کنیم. بنابراین، پس از برش، امکان بازگشت وجود ندارد.',
  },
  {
    value: "q2",
    question: "حداقل متراژ خرید چقدر است؟",
    answer: `حداقل متراژ سفارش جمع فاکتور باید بالای 3 متر باشد.
یعنی میتوانید از یک گزینه 3 متر خرید کنید و یا از هر طرح 1 متر خرید کنید که در مجموع جمع متراژ حداقل 3 متر باشد.
در غیر این صورت از پذیرش سفارشات شما معذوریم.`,
  },
  {
    value: "q3",
    question: "عرض پارچه های مبلی چقدر است؟",
    answer: "عرض تمام پارچه های مبلی سراسر دنیا 140cm است، عموما عرض 1و نیم گفته میشود.",
  },
  {
    value: "q4",
    question: "آیا از پارچه های مبلی برای دکور پرده استفاده میشود؟",
    answer: `بله، از پارچه های مبلی برای دکور رویه پرده استفاده میشود به این صورت که برای هر قد دکور پرده شما نیاز به 3/5 متر پارچه نیاز دارید. 

مثلا: اگر پنجره ای داریم که لازم است دو طرف ان دکور داشته باشد 7 متر پارچه لازم دارد.`,
  }
];
