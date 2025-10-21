'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { ShoppingBag } from "lucide-react";

import { useAppSelector } from "@/lib/store";
import { clearCart } from "@/lib/store/slices/cart-slice";
import { getCartItemQuantity } from "@/utils/helpers";
import { handleShowToast } from "@/lib/toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const CartPopover = () => {
  const [cartTrigger, setCartTrigger] = useState(false);
  const cart = useAppSelector((state) => state.cart);

  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (!session) {
      handleShowToast('برای ادامه، لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
      return;
    }
    router.push("/dashboard?tab=orders");
    setCartTrigger(false);
  };

  return (
    <Popover onOpenChange={setCartTrigger} open={cartTrigger}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <span className="absolute -top-2 -right-2 w-4 md:w-5 h-4 md:h-5 flex_center rounded-full z-10 bg-secondary-700 text-[8px] md:text-xs text-white">
            {cart.totalQuantity > 99 ? "😊" : cart.totalQuantity}
          </span>
          <Button
            className="bg-primary-300 text-black hover:bg-primary-400 px-2 md:px-3 py-1 md:py-2 rounded duration-500 w-8 md:h-10 h-8 md:w-10 flex_center btn"
            size="icon"
            type="button"
            aria-label="shopping_bag"
            onClick={() => setCartTrigger(true)}
          >
            <ShoppingBag className="w-4 md:w-12 h-4 md:h-12" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-[#fff] mt-1 p-2 rounded-xl outline-none border-light_muted">
        <div>
          <ul className="flex-column gap-1">
            {cartItems.length ? (
              cartItems.map((item) => {
                const quantity = getCartItemQuantity(cartItems, item.id);
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
      </PopoverContent>
    </Popover>
  );
};

export default CartPopover;