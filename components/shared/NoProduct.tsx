"use client";

import Lottie from "lottie-react";
import noProduct from "@/public/assets/lotties/no_product2.json";

const NoProduct = () => {
  return (
    <div className="flex_center flex-col w-full">
      <Lottie animationData={noProduct} loop={true} className="w-44 h-44" />
      <p className="text-xl font-medium text-center">محصولی یافت نشد.</p>
    </div>
  );
};

export default NoProduct;
