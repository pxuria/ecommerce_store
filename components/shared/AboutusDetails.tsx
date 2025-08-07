"use client";

import { aboutusItems } from "@/constants";
import Lottie from "lottie-react";

const AboutusDetails = () => {
  return (
    <section className="flex items-center gap-4 flex-wrap lg:flex-nowrap justify-center my-8 bg-purple_400 custom_container py-10">
      {aboutusItems.map((item, index) => (
        <div
          className="flex_center flex-col gap-2 bg-[#fff] shadow px-4 py-3 rounded-lg w-full sm:w-[calc(50%-8px)] md:w-[calc(32%-8px)] lg:w-[calc(20%-8px)]"
          key={index}
        >
          <div className="w-32 h-32 flex_center">
            <Lottie
              animationData={item.lottie}
              loop={true}
              className={`${item.width} ${item.height}`}
            />
          </div>
          <h5 className="text-sm font-medium">{item.title}</h5>
        </div>
      ))}
    </section>
  );
};

export default AboutusDetails;
