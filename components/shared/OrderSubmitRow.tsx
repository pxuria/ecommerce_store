import { CartItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  item: CartItem;
}

const OrderSubmitRow = ({ item }: Props) => {
  return (
    <Link
      href={`/products/${item.productId}`}
      className="w-full lg:w-[calc(50%-8px)] bg-[#fff] shadow-md rounded-lg p-2 flex items-start justify-start gap-3"
    >
      <Image
        src={item.coverImage}
        unoptimized
        alt={item.name}
        width={65}
        height={65}
        className="object-cover h-full rounded-md aspect-square"
      />

      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 flex-wrap">
          {/* title */}
          <h3 className="text-base font-medium">{item.name}</h3>

          {/* quantity */}
          <span className="px-3 text-sm bg-primary-300 flex_center text-black font-semibold rounded w-fit">
            {item.quantity} عدد
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
          {/* size & color */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-center gap-1 flex-wrap">
            <span className="px-3 pb-1 text-sm font-medium rounded bg-secondary-700 text-white flex_center">
              {item.color}
            </span>
          </div>

          {/* price */}
          <div className="flex_center gap-1">
            <span className="text-base sm:text-lg font-bold">
              {item.total.toLocaleString("en-US")}
            </span>
            <span className="text-sm sm:text-base font-bold text-black">
              تومان
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderSubmitRow;
