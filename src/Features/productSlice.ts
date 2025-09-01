// src/features/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; // ✅ type-only
import api from "@/Services/api/api";

// Define Product type
export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: number;
}


// Define slice state type
interface ProductState {
  items: ProductType[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

// ✅ Async thunk to create product
export const createProduct = createAsyncThunk<
  ProductType,
  Partial<ProductType>,
  { rejectValue: string }
>("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error creating product");
  }
});

// ✅ Async thunk to fetch products

export const fetchProducts = createAsyncThunk<
  ProductType[],
  { search?: string; category?: number },
  { rejectValue: string }
>(
  "products/fetchProducts",
  async (filters, { rejectWithValue }) => {
    try {
      const params: any = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;

      const response = await api.get("/class", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<ProductType>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
