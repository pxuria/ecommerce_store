import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "@/lib/store/slices/cart-slice";
import { useAppSelector } from "@/lib/store";
import { getCartItemQuantity } from "@/utils/helpers";

const CartPopover = () => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <>
      <div>
        <ul className="flex-column gap-1">
          {cartItems.length ? (
            cartItems.map((item) => {
              const quantity = getCartItemQuantity(cartItems, item._id);
              console.log(item);
              return (
                <li
                  className="hover:bg-white rounded-lg transition-all ease-in p-2"
                  key={item._id}
                >
                  <Link href={`/products/${item._id}`}>
                    <div className="flex flex-nowrap items-start gap-2">
                      <Image
                        width={60}
                        height={60}
                        unoptimized
                        alt={item.name}
                        src={item.image[0]}
                        className="rounded-md object-cover w-16 h-full"
                      />
                      <div className="flex-column gap-2 w-full">
                        <span className="">{item.name}</span>

                        <span className="text-lg font-medium">
                          {(+item.price * +item.quantity).toFixed(2)}
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
        <Link className="w-1/2" href="/dashboard?tab=orders">
          <button
            type="button"
            className="btn w-full flex_center  text-sm font-medium bg-purple_900 hover:bg-purple_800 text-white py-2 rounded-lg"
          >
            تسویه حساب
          </button>
        </Link>
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
