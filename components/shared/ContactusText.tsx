import { brandName } from "@/constants";

const ContactusText = () => {
    return (
        <div className="py-10 px-4 w-full lg:w-3/5 mx-auto flex-column items-start justify-start">
            <h1 className="text-3xl font-bold mb-8 bg-white">
                تماس با{" "}
                <strong className="text-secondary-700 text-4xl font-bold ">{brandName}</strong>
            </h1>


            <p className="text-lg mb-6 leading-relaxed">
                <strong className="text-lg font-bold text-secondary-800">{brandName}</strong>{" "}
                در دنیای زیبایی‌ها، جایی که خانه به آینه‌ای از روح و سلیقه ساکنانش تبدیل می‌شود،پارچه عرشیان بافت نه به عنوان یک فروشگاه، که به عنوان یک «آرتیستِ خانه‌آرایی» متولد شد. ما باور داریم که پارچه، تنها یک پوشش نیست؛ نفس یک فضاست. نوازشگر نگاه‌ها، نگهدارنده خاطرات و ترجمانِ سلیقه‌ای است که از ظرافت می‌گوید.

                ما در پارچه عرشیان بافت، با عشقی پایان‌ناپذیر به هنر و صنعت، گردآورنده نفیس‌ترین و مرغوب‌ترین پارچه‌های مبل، پرده و دکوراسیون از چهارگوشه جهان هستیم. از ابریشم‌های نرم ایتالیایی که با خورشید رقابت می‌کنند، تا کتان‌های طبیعی و بادوام اروپایی که بوی اصالت می‌دهند؛ از طرح‌های کلاسیک و شاهانه تا مدرن‌ترین و مینیمال‌ترین بافت‌ها.
            </p>
            <p className="text-lg font-bold text-primary-800">آدرس: تهران،افسریه شهرک مسعودیه،خیابان شهید عباسعلی طاهر پناه پلاک 177 طبقه 1</p>
            <p className="text-lg font-bold text-primary-800">کد پستی: 1786838654</p>
            <p className="text-lg font-bold text-primary-800">شماره تماس با ما: 09129722530</p>
            <p className="text-lg font-bold text-primary-800">شماره ثابت: 02191016694</p>

            {/* <p className="text-lg leading-relaxed bg-white">
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
            </p> */}
        </div>
    );
}

export default ContactusText