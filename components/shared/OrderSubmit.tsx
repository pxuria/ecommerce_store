import OrderSubmitRow from "./OrderSubmitRow";
import axiosInstance from "@/lib/axiosInstance";
import { clearCart } from "@/lib/store/slices/cart-slice";
import { handleShowToast } from "@/lib/toast";
import { CartState } from "@/types";
import { paymentHandler } from "@/utils/helpers";
import { Session } from "next-auth";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

interface Props {
  cart: CartState;
  session: Session;
}

const OrderSubmit = ({ cart, session }: Props) => {
  const dispatch = useDispatch();
  const { address, city, postalCode, email, phone } = session?.user || {};

  const validateUserInfo = useCallback((): boolean => {
    if (!address) {
      handleShowToast("لطفا آدرس را از حساب کاربری تکمیل نمایید", "error");
      return false;
    }
    if (!city) {
      handleShowToast("لطفا شهر خود را از حساب کاربری تکمیل نمایید", "error");
      return false;
    }
    if (!postalCode) {
      handleShowToast("لطفا کد پستی خود را از حساب کاربری تکمیل نمایید", "error");
      return false;
    }
    return true;
  }, [address, city, postalCode]);

  const submitHandler = async () => {
    if (!validateUserInfo()) return;

    try {
      const formattedItems = cart.items.map((item) => ({
        productColorVariantId: item.id.split('-')[1],
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0
      }));

      const { data } = await axiosInstance.post("orders", {
        items: formattedItems,
        shippingAddress: session.user.address,
        city,
        postalCode
      });
      console.log(data);

      dispatch(clearCart());

      await paymentHandler(data.id, cart.totalAmount, email, phone);
    } catch (error) {
      console.log(error);
      handleShowToast("خطایی در ارسال سفارش رخ داده است", "error");
    }
  };

  return (
    <div className="w-full border border-light_muted rounded-xl p-4 bg-[#f9f9f9] shadow-lg">
      <h2 className="text-lg font-medium mb-4">سبد خرید</h2>

      <div className="flex gap-4 flex-wrap">
        {cart.items.map((item, index) => <OrderSubmitRow key={index} item={item} />)}
      </div>

      <div className="flex items-center gap-1 mt-4 text-right">
        <span className="text-base sm:text-lg font-bold">مبلغ کل:</span>
        <div className="flex_center gap-1">
          <span className="text-base sm:text-lg font-bold">
            {cart.totalAmount.toLocaleString("en-US")}
          </span>
          <span className="text-sm sm:text-base font-bold text-black">
            تومان
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={submitHandler}
        className="flex_center w-full rounded-md text-white bg-secondary-600 hover:bg-secondary-800 primary_transition text-nowrap py-2 mt-4"
      >
        تسویه حساب
      </button>
    </div>
  );
};

export default OrderSubmit;
