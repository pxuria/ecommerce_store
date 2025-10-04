import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/store/slices/cart-slice";
import { useAppSelector } from "@/lib/store";
import { getCartItemQuantity } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleShowToast } from "@/lib/toast";

const CartPopover = () => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    console.log(session)
    if (!session) {
      handleShowToast('برای ادامه، لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
      return;
    }
    router.push("/dashboard?tab=orders");
  };

  return (
    <>
      <div>
        <ul className="flex-column gap-1">
          {cartItems.length ? (
            cartItems.map((item) => {
              const quantity = getCartItemQuantity(cartItems, item.id);
              console.log(item);
              return (
                <li
                  className="hover:bg-white rounded-lg transition-all ease-in p-2"
                  key={item.id}
                >
                  <Link href={`/products/${item.id}`}>
                    <div className="flex flex-nowrap items-start gap-2">
                      <Image
                        width={60}
                        height={60}
                        unoptimized
                        alt={item.name}
                        src={item.coverImage}
                        className="rounded-md object-cover w-16 h-full aspect-square"
                      />

                      <div className="flex-column gap-2 w-full">
                        <span className="">{item.name}</span>

                        <span className="text-lg font-bold text-secondary-700">
                          {item?.discountedPrice?.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2 flex-nowrap">
                          <span className="text-sm">تعداد :</span>
                          <span className="text-lg font-medium">
                            {quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })
          ) : (
            <li className="text-base font-medium">سبد خرید خالی است.</li>
          )}
        </ul>
      </div>
      <div className="flex_center gap-2 flex-nowrap mt-4">
        <button
          type="button"
          onClick={handleCheckout}
          className="btn w-1/2 flex_center text-sm font-medium bg-secondary-700 hover:bg-secondary-600 text-white py-2 rounded-lg"
        >
          تسویه حساب
        </button>

        <button
          type="button"
          className="btn w-1/2 flex_center border-2 border-[#ec2e5e] text-[#ec2e5e] hover:bg-[#ec2e5e] hover:text-white text-sm font-medium py-2 rounded-lg"
          onClick={() => dispatch(clearCart())}
        >
          حذف سبد خرید
        </button>
      </div>
    </>
  );
};

export default CartPopover;