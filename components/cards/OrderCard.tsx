import { IOrder } from "@/types";
import { paymentHandler } from "@/utils/helpers";
import { useSession } from "next-auth/react";

interface Props {
  order: IOrder;
}

const OrderCard = ({ order }: Props) => {
  const { data: session } = useSession();

  const orderHandler = async () => {
    try {
      await paymentHandler(
        order._id!,
        order.totalPrice,
        session?.user.email || ""
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full lg:w-[calc(50%-16px)] rounded-xl shadow-md p-4 bg-[#fff]">
      <div className="flex items-center justify-between gap-2 flex-wrap xl:flex-nowrap">
        <h3 className="text-sm text-nowrap flex items-center gap-2 flex-wrap lg:flex-nowrap text-black font-medium">
          <span>شماره سفارش</span>
          <span className="text-xs md:text-sm text-white bg-pink_700 px-2 py-1 rounded">
            {order._id}
          </span>
        </h3>

        <span
          className={`rounded border-2 ${
            order.status === "pending"
              ? "border-orange_900 bg-yellow_300 text-orange_900"
              : order.status === "paid"
              ? "border-green-800 bg-green-200 text-green-800"
              : "border-red-700 bg-red-100 text-red-700"
          } text-xs font-medium text-nowrap px-2 py-1 select-none`}
        >
          {order.status === "pending"
            ? "در انتظار پرداخت"
            : order.status === "paid"
            ? "پرداخت شده"
            : "ناموفق"}
        </span>
      </div>

      <div className="flex-column items-start gap-2 mt-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="rounded-md border px-4 py-2 bg-[#f9f9f9] border-muted flex items-center justify-between gap-2 flex-wrap w-full"
          >
            <h4 className="font-medium text-lg text-black">{item.name}</h4>

            <div className="flex items-center justify-start gap-3 flex-wrap">
              <span className="font-medium bg-purple_800 px-4 py-1 text-white rounded-md flex_center w-fit select-none">
                {item.quantity} عدد
              </span>

              <div className="flex_center font-medium flex-nowrap gap-1">
                <span className="text-lg">
                  {item.price.toLocaleString("en-US")}
                </span>
                <span className="text-sm">تومان</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-column gap-2 flex-wrap xl:flex-nowrap mt-2">
        {/* total price */}
        <div className="flex items-center justify-start gap-2 flex-wrap lg:flex-nowrap mt-4 text-black bg-pink_800 p-2 rounded-md w-fit">
          <span className="font-medium text-lg text-white">مبلغ کل</span>

          <div className="flex_center font-medium flex-nowrap gap-1 bg-white px-4 py-1 rounded">
            <span className="text-lg">
              {order.totalPrice.toLocaleString("en-US")}
            </span>
            <span className="text-sm">تومان</span>
          </div>
        </div>

        {/* submit Button */}
        {order.status === "pending" && (
          <button
            className="flex_center w-full rounded-md text-white bg-purple_900 hover:bg-purple_800 primary_transition text-nowrap py-2"
            type="button"
            onClick={orderHandler}
          >
            تسویه حساب
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
