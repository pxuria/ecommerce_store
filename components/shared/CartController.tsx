"use client";

import { useDispatch } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";
import { addToCart, removeFromCart } from "@/lib/store/slices/cart-slice";
import { useAppSelector } from "@/lib/store";
import { getCartItemQuantity } from "@/utils/helpers";
import { CartItem } from "@/types";

interface Props {
  item: CartItem;
}

const CartController = ({ item }: Props) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleAddToCart = () => dispatch(addToCart(item));
  const handleRemoveFromCart = () =>
    dispatch(removeFromCart({ _id: item._id }));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.href);
    }
  };

  const quantity = getCartItemQuantity(cartItems, item._id);

  return (
    <div
      onClick={handleClick}
      className="shadow rounded-md px-3 py-1 mb-2 flex flex-nowrap gap-2 items-center w-fit bg-[#fff]"
    >
      <button type="button" className="btn" onClick={handleAddToCart}>
        <FaPlus className="w-3 h-3" />
      </button>
      <span className="">{quantity}</span>
      <button type="button" className="btn" onClick={handleRemoveFromCart}>
        <FaMinus className="w-3 h-3" />
      </button>
    </div>
  );
};

export default CartController;
