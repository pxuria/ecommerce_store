import Image from "next/image";

const HomeFeatures = () => {
  const home_features = [
    {
      icon: "/assets/images/original-tag.svg",
      iconAlt: "original",
      text: "ﺿﻤﺎﻧﺖ اصالت ﮐﺎﻟﺎ",
    },
    {
      icon: "/assets/images/delivery.svg",
      iconAlt: "deliver",
      text: "اﻣﮑﺎن ﺗﺤﻮﯾﻞ اﮐﺴﭙﺮس",
    },
    {
      icon: "/assets/images/customer.svg",
      iconAlt: "support",
      text: "۷ روز ﻫﻔﺘﻪ، ۲۴ ﺳﺎﻋﺘﻪ",
    },
    {
      icon: "/assets/images/box.svg",
      iconAlt: "box",
      text: "3 روز ضمانت بازگشت کالا",
    },
  ];

  return (
    <section className="flex items-center gap-2 justify-between mx-auto w-[96%] sm:w-[65%] p-4 rounded-xl bg-pink_600 z-10 relative -bottom-14">
      {home_features.map((item, index) => (
        <div className="flex-column items-center gap-2" key={index}>
          <Image
            src={item.icon}
            width={48}
            height={48}
            alt={item.iconAlt}
            className=""
          />
          <span className="text-sm font-medium text-white text-center">
            {item.text}
          </span>
        </div>
      ))}
    </section>
  );
};

export default HomeFeatures;
