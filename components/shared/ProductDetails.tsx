"use client";

import { useEffect, useMemo, useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

import { useAppSelector } from "@/lib/store";
import { getCartItem, getCartItemQuantity } from "@/utils/helpers";
import { CartItem, IProduct } from "@/types";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeAllFromCart,
  removeFromCart,
} from "@/lib/store/slices/cart-slice";
import { FiShoppingBag } from "react-icons/fi";
import CarouselProductDetails from "./CarouselProductDetails";

const ProductDetails = ({ product }: { product: IProduct }) => {
  const dispatch = useDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0].name
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.colors[0].sizes[0].name
  );

  useEffect(() => {
    const colorObj = product.colors.find(
      (color) => color.name === selectedColor
    );
    if (colorObj?.sizes.length) setSelectedSize(colorObj.sizes[0].name);
  }, [selectedColor, product.colors]);

  const getProductDetails = (
    product: IProduct,
    color: string,
    size: string
  ) => {
    const colorObj = product.colors.find((c) => c.name === color);
    if (!colorObj) return { price: product.basePrice, stockCount: 0 };

    const sizeObj = colorObj.sizes.find((s) => s.name === size);
    return sizeObj
      ? { price: sizeObj.price, stockCount: sizeObj.stockCount }
      : { price: product.basePrice, stockCount: 0 };
  };

  const { price, stockCount } = getProductDetails(
    product,
    selectedColor,
    selectedSize
  );

  const productItem = useMemo(
    () => ({
      _id: `${product._id}-${selectedColor}-${selectedSize}`,
      productId: product._id,
      name: product.name,
      image: product.image,
      price,
      quantity: stockCount,
      color: selectedColor,
      size: selectedSize,
    }),
    [product, selectedColor, selectedSize, price, stockCount]
  );

  const cartItem = getCartItem(cartItems, productItem._id) as CartItem;
  const quantity = cartItem
    ? getCartItemQuantity(cartItems, productItem._id)
    : 0;
  console.log("CART ITEM", cartItem);
  console.log("CART ITEMS", cartItems);
  console.log("PRODUCT ITEM", productItem);
  console.log("QUANTITY", quantity);

  const handleAddToCart = () => {
    if (stockCount === 0 || quantity >= stockCount) return;
    dispatch(addToCart(productItem));
  };
  const handleRemoveFromCart = () => {
    if (stockCount === 0) return;
    if (quantity > 0) {
      dispatch(removeFromCart({ _id: cartItem._id }));
    }
  };
  const handleRemoveAllFromCart = () => {
    if (cartItem) {
      dispatch(removeAllFromCart({ _id: cartItem._id }));
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
            <MdRemoveRedEye className="text-gray w-4 h-4" />
          </div>
        </div>

        <div className="flex-column gap-5 mt-4">
          {/* categories */}

          <div className="flex items-center justify-start gap-3">
            <span className="text-black font-medium">دسته بندی :</span>
            <span className="text-black text-blue-700 font-medium">
              {product.category.name}
            </span>
          </div>

          {/* size */}
          <div>
            <h2 className="text-black font-medium select-none">انتخاب سایز</h2>
            <div className="mt-3 flex flex-wrap gap-4">
              {product.colors
                .find((color) => color.name === selectedColor)
                ?.sizes.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    className={`px-4 py-1 rounded-lg font-medium flex_center ${
                      selectedSize === size.name
                        ? "border-2 bg-yellow_300 text-black border-orange_900"
                        : "border border-muted"
                    }`}
                    onClick={() => setSelectedSize(size.name)}
                    aria-label={`انتخاب سایز ${size.name}`}
                  >
                    {size.name}
                  </button>
                ))}
            </div>
          </div>

          {/* color */}
          <div>
            <span className="text-black font-medium select-none">
              انتخاب رنگ
            </span>
            <div className="flex gap-4 items-center flex-wrap w-1/2 mt-3">
              {product.colors.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={`px-4 py-1 ${
                    selectedColor === item.name
                      ? "border-2 bg-yellow_300 text-black border-orange_900"
                      : "border border-muted"
                  } rounded-lg flex_center`}
                  onClick={() => setSelectedColor(item.name)}
                  aria-label={`انتخاب رنگ ${item.name}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* price */}
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-lg">قیمت :</h2>
            <div className="flex items-center gap-2 text-pink_700">
              <span className="font-bold text-xl">{price}</span>
              <span className="font-medium text-lg">تومان</span>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <h2 className="font-medium text-base">موجودی :</h2>
            <span
              className={`font-bold text-lg ${
                stockCount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stockCount > 0 ? `${stockCount} عدد موجود است` : "ناموجود"}
            </span>
          </div>

          {/* add cart */}
          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <div className="w-1/5 flex items-center justify-between flex-nowrap rounded-lg bg-white">
                <button
                  type="button"
                  className="py-3 px-4"
                  aria-label="افزودن به سبد خرید"
                  onClick={handleAddToCart}
                  disabled={quantity >= stockCount}
                >
                  <FaPlus className="w-4 h-4" />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  className="py-3 px-4"
                  aria-label="حذف از سبد خرید"
                  onClick={handleRemoveFromCart}
                >
                  <FaMinus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              className={`btn py-2 rounded-lg text-white flex_center gap-2 ${
                quantity === 0
                  ? stockCount === 0
                    ? "w-full bg-[#636363] hover:bg-black cursor-not-allowed"
                    : "w-full bg-pink_600 hover:bg-pink_700"
                  : "w-4/5 bg-red-500 hover:bg-red-600"
              }`}
              onClick={
                quantity === 0 ? handleAddToCart : handleRemoveAllFromCart
              }
              disabled={stockCount === 0}
            >
              {stockCount === 0
                ? "ناموجود"
                : quantity === 0
                ? "افزودن به سبد خرید"
                : "حذف از سبد خرید"}
              {stockCount === 0 ? null : quantity === 0 ? (
                <FiShoppingBag />
              ) : (
                <FaRegTrashCan />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
