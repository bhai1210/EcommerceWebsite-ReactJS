// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import classReducer from "../Features/classSlice";
import productReducer from "../Features/productSlice";
import cartReducer from "../Features/cartSlice";
import checkoutReducer from "../Features/checkoutSlice";

// Configure store
export const store = configureStore({
  reducer: {
    classes: classReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

// Types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
