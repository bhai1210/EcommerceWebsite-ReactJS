// src/components/ClassComponents/useClassHooks.ts
import { useState, useCallback, useEffect } from "react";
import api from "@/Services/api/api";
import { toast } from "react-toastify";

export interface Category {
  _id: string;
  name: string;
}

export interface ClassType {
  _id?: string;
  name: string;
  price: number;
  description: string;
  stockcount: number[];
  category: string; // store as ObjectId (string)
  image?: string;
}

export const useClassHooks = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (error) {
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  }, []);

  // Add class
  const addClass = async (data: ClassType) => {
    try {
      await api.post("/classes", data);
      toast.success("Class added successfully");
      fetchClasses();
    } catch {
      toast.error("Failed to add class");
    }
  };

  // Update class
  const updateClass = async (id: string, data: ClassType) => {
    try {
      await api.put(`/classes/${id}`, data);
      toast.success("Class updated successfully");
      fetchClasses();
    } catch {
      toast.error("Failed to update class");
    }
  };

  // Delete class
  const deleteClass = async (id: string) => {
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted successfully");
      fetchClasses();
    } catch {
      toast.error("Failed to delete class");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchCategories();
  }, [fetchClasses, fetchCategories]);

  return {
    classes,
    categories,
    loading,
    addClass,
    updateClass,
    deleteClass,
  };
};
