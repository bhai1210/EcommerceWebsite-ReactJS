// src/features/classSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Services/api/api";
import { message } from "antd";

// ---------- Types ----------
export interface ClassType {
  _id: string;
  name: string;
  price: number;
  description: string;
  stockcount: number[];
  category: string;
  image?: string;
}

interface ClassState {
  data: ClassType[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

// ---------- Initial State ----------
const initialState: ClassState = {
  data: [],
  loading: false,
  saving: false,
  error: null,
};

// ---------- Thunks ----------
export const fetchClasses = createAsyncThunk<ClassType[]>(
  "classes/fetchClasses",
  async () => {
    try {
      const res = await api.get("class/mara");
      const data = Array.isArray(res.data.data) ? res.data.data : res.data || [];
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch classes";
      throw new Error(errorMessage);
    }
  }
);

export const createClass = createAsyncThunk<ClassType, Partial<ClassType>>(
  "classes/createClass",
  async (payload) => {
    try {
      const res = await api.post("/class/create", payload);
      message.success("Class created successfully!");
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create class";
      message.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

export const updateClass = createAsyncThunk<
  ClassType,
  { id: string; payload: Partial<ClassType> }
>("classes/updateClass", async ({ id, payload }) => {
  try {
    const res = await api.put(`/class/${id}`, payload);
    message.success("Class updated successfully!");
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to update class";
    message.error(errorMessage);
    throw new Error(errorMessage);
  }
});

export const deleteClass = createAsyncThunk<string, string>(
  "classes/deleteClass",
  async (id) => {
    try {
      await api.delete(`/class/${id}`);
      message.success("Class deleted successfully!");
      return id;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete class";
      message.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
);

// ---------- Slice ----------
const classSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch classes";
      })
      .addCase(createClass.pending, (state) => {
        state.saving = true;
      })
      .addCase(createClass.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to create class";
      })
      .addCase(updateClass.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateClass.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to update class";
      })
      .addCase(deleteClass.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.saving = false;
        // ✅ remove deleted class from state
        state.data = state.data.filter((cls) => cls._id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to delete class";
      });
  },
});

export const { clearError, clearData } = classSlice.actions;
export default classSlice.reducer;
