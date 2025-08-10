import { brandName } from "@/constants";

const ContactusText = () => {
    return (
        <div className="py-10 px-4 w-full lg:w-3/5 mx-auto flex-column items-start justify-start">
            <h1 className="text-3xl font-bold mb-8 bg-white">
                تماس با{" "}
                <strong className="text-pink_800 text-4xl font-bold ">{brandName}</strong>
            </h1>

            <p className="text-lg leading-relaxed bg-white">
                <strong className="text-pink_800">{brandName}</strong>، فروشگاه آنلاین مدرن و
                تخصصی در زمینه پوشاک زنانه، با هدف ارائه جدیدترین و باکیفیت‌ترین لباس‌ها
                برای بانوان و دختران خوش‌سلیقه راه‌اندازی شده است. ما مجموعه‌ای از
                شیک‌ترین و ترندترین محصولات شامل کراپ‌تاپ، تی‌شرت، شلوار، تاپ، هودی و
                دیگر پوشاک جذاب را با بهترین کیفیت و قیمت مناسب ارائه می‌دهیم.
            </p>
            <p className="text-lg mt-4">
                در <strong className="text-pink_800">{brandName}</strong>، ما به تجربه خرید
                آنلاین آسان، ارسال سریع و پشتیبانی مشتریان اهمیت ویژه‌ای می‌دهیم. هدف ما
                این است که شما همیشه بهترین انتخاب‌ها را داشته باشید و با استایل خاص خود
                بدرخشید.
            </p>
        </div>
    );
}

export default ContactusText