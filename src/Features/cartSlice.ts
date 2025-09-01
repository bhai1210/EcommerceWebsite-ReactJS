// src/redux/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // ✅ type-only

// Define the product type
interface Product {
  _id: string;
  name: string;
  price: number;
  // add other fields your product has
  qty?: number; // quantity in cart
}

// Define the slice state type
interface CartState {
  items: Product[];
}

// Initial state
const initialState: CartState = {
  items: [],
};

// Create slice
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const exists = state.items.find((p) => p._id === product._id);
      if (exists) {
        exists.qty! += 1; // non-null assertion since qty is optional
      } else {
        state.items.push({ ...product, qty: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export actions and reducer
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
