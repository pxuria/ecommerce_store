import OrderSubmitRow from "./OrderSubmitRow";
import axiosInstance from "@/lib/axiosInstance";
import { clearCart } from "@/lib/store/slices/cart-slice";
import { CartState } from "@/types";
import { paymentHandler } from "@/utils/helpers";
import { Session } from "next-auth";
import { useDispatch } from "react-redux";

interface Props {
  cart: CartState;
  session: Session;
}

const OrderSubmit = ({ cart, session }: Props) => {
  const dispatch = useDispatch();

  const submitHandler = async () => {
    try {
      const formattedItems = cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));

      const { data } = await axiosInstance.post("orders", {
        userId: session.user.id,
        items: formattedItems,
        totalPrice: cart.totalPrice,
      });
      console.log(data);
      dispatch(clearCart());
      await paymentHandler(
        data._id,
        cart.totalPrice,
        session.user.email as string
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full border border-light_muted rounded-xl p-4 bg-[#f9f9f9] shadow-lg">
      <h2 className="text-lg font-medium mb-4">سبد خرید</h2>

      <div className="flex gap-4 flex-wrap">
        {cart.items.map((item, index) => (
          <OrderSubmitRow key={index} item={item} />
        ))}
      </div>

      <div className="flex items-center gap-1 mt-4 text-right">
        <span className="text-base sm:text-lg font-bold">مبلغ کل:</span>
        <div className="flex_center gap-1">
          <span className="text-base sm:text-lg font-bold">
            {cart.totalPrice.toLocaleString("en-US")}
          </span>
          <span className="text-sm sm:text-base font-bold text-black">
            تومان
          </span>
        </div>
      </div>

      <button
        className="flex_center w-full rounded-md text-white bg-purple_900 hover:bg-purple_800 primary_transition text-nowrap py-2 mt-4"
        type="button"
        onClick={submitHandler}
      >
        تسویه حساب
      </button>
    </div>
  );
};

export default OrderSubmit;
