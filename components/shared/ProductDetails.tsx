"use client";

import { useMemo, useState } from "react";

import { Eye, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeAllFromCart,
  removeFromCart,
} from "@/lib/store/slices/cart-slice";
import { getCartItem, getCartItemQuantity } from "@/utils/helpers";
import { CartItem } from "@/types";
import { IProductWithBasePrice } from "@/types/model";

import CarouselProductDetails from "./CarouselProductDetails";
import { Button } from "../ui/button";

const ProductDetails = ({ product }: { product: IProductWithBasePrice }) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [selectedVariant, setSelectedVariant] = useState(product.colorVariants[0]);
  const { pricePerMeter, stockMeters } = selectedVariant;

  const productItem = useMemo(() => ({
    id: `${product.id}-${selectedVariant.color?.id}`,
    productId: product.id,
    name: product.name,
    image: product.images[0]?.url,
    price: Number(pricePerMeter),
    quantity: Number(stockMeters),
    color: selectedVariant.color?.name,
  }),
    [product, selectedVariant, pricePerMeter, stockMeters]
  );

  const cartItem = getCartItem(cartItems, productItem.id) as CartItem;
  const quantity = cartItem ? getCartItemQuantity(cartItems, productItem.id) : 0;

  const handleAddToCart = () => {
    if (stockMeters === 0 || quantity >= Number(stockMeters)) return;
    dispatch(addToCart(productItem));
  };

  const handleRemoveFromCart = () => {
    if (quantity > 0 && cartItem) {
      dispatch(removeFromCart({ id: cartItem.id }));
    }
  };

  const handleRemoveAllFromCart = () => {
    if (cartItem) {
      dispatch(removeAllFromCart({ id: cartItem.id }));
    }
  };

  return (
    <section className="mt-10 flex flex-wrap min-[880px]:flex-nowrap items-start justify-between gap-8 mx-auto px-10">
      <CarouselProductDetails product={product} />

      <div className="bg-[#fff] w-full min-[880px]:w-1/2 p-6 rounded-3xl">
        <div className="border-b border-b-gray pb-4 flex items-end justify-between">
          <h1 className="text-3xl text-black font-medium">{product.name}</h1>

          {/* views */}
          <div className="flex_center gap-1">
            <span className="text-sm text-black font-semibold">4.5</span>
            <Eye size={16} className="text-gray" />
          </div>
        </div>

        <div className="flex-column gap-5 mt-4">
          {/* categories */}
          <div className="flex items-center justify-start gap-3">
            <span className="text-black font-medium">دسته بندی :</span>
            <span className="text-secondary-700 font-medium">
              {product?.category?.name}
            </span>
          </div>
          <div className="flex items-center justify-start gap-3">
            <span className="text-black font-medium">برند :</span>
            <span className="text-secondary-700 font-medium">
              {product?.brand?.name}
            </span>
          </div>
          <div className="flex items-center justify-start gap-3">
            <span className="text-black font-medium">کشور :</span>
            <span className="text-secondary-700 font-medium">
              {product?.country?.name}
            </span>
          </div>

          <div>
            <span className="text-black font-medium select-none">
              انتخاب رنگ
            </span>
            <div className="flex gap-4 items-center flex-wrap w-1/2 mt-3">
              {product?.colorVariants?.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`px-4 py-1 rounded-lg flex_center ${selectedVariant.id === variant.id
                    ? "border-2 bg-yellow_300 text-black border-primary-900"
                    : "border border-muted"
                    }`}
                  onClick={() => setSelectedVariant(variant)}
                  aria-label={`انتخاب رنگ ${variant.color?.name}`}
                >
                  {variant.color?.name}
                </button>
              ))}
            </div>
          </div>

          {/* price */}
          <div className="flex items-center gap-4">
            <h2 className="font-medium text-lg">قیمت :</h2>

            {selectedVariant.discountPercent && selectedVariant.discountPercent > 0 ? (
              <div className="flex items-center gap-3">
                {/* Original price */}
                <span className="font-medium text-gray-500 line-through text-base">
                  {Number(pricePerMeter).toLocaleString()} تومان
                </span>

                {/* Discounted price */}
                <span className="font-bold text-xl text-pink_700">
                  {(
                    Number(pricePerMeter) *
                    (1 - selectedVariant.discountPercent / 100)
                  ).toLocaleString()}{" "}
                  تومان/متر
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-pink_700">
                <span className="font-bold text-xl">
                  {Number(pricePerMeter).toLocaleString()}
                </span>
                <span className="font-medium text-lg">تومان/متر</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <h2 className="font-medium text-base">موجودی :</h2>
            <span
              className={`font-bold text-lg ${Number(stockMeters) > 0 ? "text-green-600" : "text-red-600"
                }`}
            >
              {Number(stockMeters) > 0
                ? `${Number(stockMeters)} متر موجود است`
                : "ناموجود"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <div className="w-1/5 flex items-center justify-between flex-nowrap rounded-lg bg-white">
                <Button
                  type="button"
                  className="py-3 px-4"
                  onClick={handleAddToCart}
                  disabled={quantity >= Number(stockMeters)}
                >
                  <Plus size={16} />
                </Button>

                <span>{quantity}</span>

                <Button
                  type="button"
                  className="py-3 px-4"
                  onClick={handleRemoveFromCart}
                >
                  <Minus size={16} />
                </Button>
              </div>
            )}

            <Button
              type="button"
              className={`btn rounded-lg text-white flex_center gap-2 ${quantity === 0
                ? Number(stockMeters) === 0
                  ? "w-full bg-[#636363] hover:bg-black cursor-not-allowed"
                  : "w-full bg-secondary-600 hover:bg-secondary-700"
                : "w-4/5 bg-red-500 hover:bg-red-600"
                }`}
              onClick={
                quantity === 0 ? handleAddToCart : handleRemoveAllFromCart
              }
              disabled={Number(stockMeters) === 0}
            >
              {Number(stockMeters) === 0
                ? "ناموجود"
                : quantity === 0
                  ? "افزودن به سبد خرید"
                  : "حذف از سبد خرید"}
              {Number(stockMeters) === 0 ? null : quantity === 0 ? (
                <ShoppingBag size={16} />
              ) : (
                <Trash2 size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;