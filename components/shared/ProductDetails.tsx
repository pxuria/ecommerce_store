"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeAllFromCart,
  removeFromCart,
} from "@/lib/store/slices/cart-slice";
import { getCartItem, getCartItemQuantity } from "@/utils/helpers";
import { CartItem } from "@/types";
import { IProductColorVariant, IProductWithBasePrice } from "@/types/model";

import CarouselProductDetails from "./CarouselProductDetails";
import { Button } from "../ui/button";

const ProductDetails = ({ product }: { product: IProductWithBasePrice }) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [selectedVariant, setSelectedVariant] = useState<IProductColorVariant | undefined>(product?.colorVariants?.[0]);
  const { pricePerMeter, stockMeters, discountPercent } = selectedVariant as IProductColorVariant;
  const hasStock = product.colorVariants?.some((variant) => variant.stockMeters > 0) ?? false;

  const productItemId = `${product.id}-${selectedVariant?.id}`;
  const cartItem = getCartItem(cartItems, productItemId) as CartItem;
  const quantity = cartItem ? getCartItemQuantity(cartItems, productItemId) : 0;

  const handleAddToCart = () => {
    if (stockMeters === 0 || quantity >= Number(stockMeters)) return;

    const unitPrice = Number(pricePerMeter);
    const discount = discountPercent ?? 0;
    const discountedPrice = discount > 0 ? unitPrice * (1 - discount / 100) : unitPrice;

    dispatch(
      addToCart({
        id: productItemId,
        name: product.name,
        productId: String(product.id),
        coverImage: product.images[0]?.url,
        unitPrice,
        discountedPrice,
        discount,
        quantity: 1,
        color: selectedVariant?.color?.name ?? "نامشخص",
        total: discountedPrice
      })
    );
  };

  const handleRemoveFromCart = () => {
    if (quantity > 0 && cartItem) dispatch(removeFromCart({ id: cartItem.id }));
  };

  const handleRemoveAllFromCart = () => {
    if (cartItem) dispatch(removeAllFromCart({ id: cartItem.id }));
  };

  return (
    <section className="mt-10 flex flex-wrap min-[880px]:flex-nowrap items-start justify-between gap-8 mx-auto px-10">
      <CarouselProductDetails product={product} />

      <div className="bg-[#fff] w-full min-[880px]:w-1/2 p-6 rounded-3xl">
        <div className="border-b border-b-gray pb-4">
          <h1 className="text-3xl text-black font-medium">{product.name}</h1>
        </div>

        <div className="flex-column gap-5 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center flex-wrap">
              <span className="text-white bg-secondary-700 px-4 py-2 rounded-lg font-medium w-fit text-nowrap">
                {product?.category?.name}
              </span>

              <div className="flex items-center justify-start gap-2 bg-secondary-700 p-1 w-fit rounded-lg text-nowrap">
                <span className="text-white font-medium">برند</span>
                <span className="text-secondary-700 bg-white px-2 py-1 rounded-md font-medium">
                  {product?.brand?.name}
                </span>
              </div>
              <div className="flex items-center justify-start gap-2 bg-secondary-700 p-1 w-fit rounded-lg text-nowrap">
                <span className="text-white font-medium">کشور</span>
                <span className="text-secondary-700 bg-white px-2 py-1 rounded-md font-medium">
                  {product?.country?.name}
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] sm:text-xs font-medium text-nowrap border-2 px-3 py-[2px] flex_center rounded-md ${(product.isActive && hasStock) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
            >
              {(product.isActive && hasStock) ? "موجود" : "ناموجود"}
            </span>
          </div>

          <div>
            <span className="text-black font-medium select-none">
              کد رنگ
            </span>
            <div className="flex gap-4 items-center flex-wrap w-1/2 mt-3">
              {product?.colorVariants?.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`px-4 py-1 rounded-lg flex_center ${selectedVariant?.id === variant.id
                    ? "border-2 bg-yellow_300 text-black border-primary-900"
                    : "border border-muted"
                    }`}
                  onClick={() => setSelectedVariant(variant)}
                  aria-label={`کد رنگ ${variant.color?.name}`}
                >
                  {variant.color?.name}
                </button>
              ))}
            </div>
          </div>

          {/* price */}
          <div className="flex items-center gap-4">
            {selectedVariant?.discountPercent && selectedVariant?.discountPercent > 0 ? (
              <div className="flex-column gap-1">
                {/* Original price */}
                <span className="font-medium text-red-600 line-through text-sm">
                  {Number(pricePerMeter).toLocaleString()} تومان
                </span>

                {/* Discounted price */}
                <span className="font-bold text-xl text-secondary-700">
                  {(
                    Number(pricePerMeter) *
                    (1 - selectedVariant.discountPercent / 100)
                  ).toLocaleString()}{" "}
                  تومان/متر
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-secondary-700">
                <span className="font-bold text-xl">
                  {Number(pricePerMeter).toLocaleString()}
                </span>
                <span className="font-medium text-lg">تومان/متر</span>
              </div>
            )}
          </div>

          {/* <div className="flex gap-2 mt-2">
            <h2 className="font-medium text-base">موجودی :</h2>
            <span
              className={`font-bold text-lg ${Number(stockMeters) > 0 ? "text-green-600" : "text-red-600"}`}>
              {Number(stockMeters) > 0
                ? `${Number(stockMeters)} متر موجود است`
                : "ناموجود"}
            </span>
          </div> */}

          <div className="flex items-center gap-2 flex-wrap">
            {quantity > 0 && (
              <div className="flex items-center justify-between flex-nowrap rounded-lg bg-white gap-2">
                <Button
                  type="button"
                  className="py-3 px-4 bg-secondary-700 text-white"
                  onClick={handleAddToCart}
                  disabled={quantity >= Number(stockMeters)}
                >
                  <Plus size={16} />
                </Button>

                <span>{quantity}</span>

                <Button
                  type="button"
                  className="py-3 px-4 bg-secondary-700 text-white"
                  onClick={handleRemoveFromCart}
                >
                  <Minus size={16} />
                </Button>
              </div>
            )}

            <Button
              type="button"
              className={`btn rounded-lg text-white flex_center flex-1 gap-2 ${quantity === 0
                ? Number(stockMeters) === 0
                  ? "w-full bg-[#636363] hover:bg-black cursor-not-allowed"
                  : "w-full bg-secondary-600 hover:bg-secondary-700"
                : "bg-red-500 hover:bg-red-600"
                }`}
              onClick={quantity === 0 ? handleAddToCart : handleRemoveAllFromCart}
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