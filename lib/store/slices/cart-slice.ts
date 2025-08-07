import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "@/types";

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemId = action.payload._id;
      const existingItem = state.items.find((item) => item._id === itemId);

      if (existingItem) existingItem.quantity += 1;
      else state.items.push({ ...action.payload, _id: itemId, quantity: 1 });

      state.totalQuantity += 1;
      state.totalPrice += action.payload.price;
    },
    removeFromCart: (state, action: PayloadAction<{ _id: string }>) => {
      const itemId = action.payload._id;
      const existingItem = state.items.find((item) => item._id === itemId);

      if (existingItem) {
        if (existingItem.quantity > 1) existingItem.quantity -= 1;
        else state.items = state.items.filter((item) => item._id !== itemId);

        state.totalQuantity -= 1;
        state.totalPrice -= existingItem.price;
      }
    },
    removeAllFromCart: (state, action: PayloadAction<{ _id: string }>) => {
      const itemId = action.payload._id;
      const existingItem = state.items.find((item) => item._id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.quantity * existingItem.price;
        state.items = state.items.filter((item) => item._id !== itemId);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, removeAllFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
