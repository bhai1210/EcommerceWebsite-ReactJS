// src/redux/checkoutSlice.ts
import { createSlice,  } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit"; // ✅ type-only
// Define the checkout state type
interface CheckoutState {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: string;
}

// Initial state
const initialState: CheckoutState = {
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  shippingMethod: "standard", // default
};

// Define payload type for setAddress
interface AddressPayload {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Create slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<AddressPayload>) => {
      state.address = action.payload.address;
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.zip = action.payload.zip;
      state.country = action.payload.country;
    },
    setShippingMethod: (state, action: PayloadAction<string>) => {
      state.shippingMethod = action.payload;
    },
    clearCheckout: () => initialState,
  },
});

export const { setAddress, setShippingMethod, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
