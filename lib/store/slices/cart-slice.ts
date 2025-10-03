import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, CartItem } from "@/types";

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) existingItem.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });

      state.totalQuantity += 1;
      state.totalAmount += action.payload.discountedPrice;
    },
    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        if (existingItem.quantity > 1) existingItem.quantity -= 1;
        else state.items = state.items.filter((item) => item.id !== itemId);

        state.totalQuantity -= 1;
        state.totalAmount -= existingItem.discountedPrice;
      }
    },
    removeAllFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.quantity * existingItem.discountedPrice;
        state.items = state.items.filter((item) => item.id !== itemId);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, removeAllFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;