import { useEffect, useState } from "react";
import api from "@/Services/api/api";
import { toast } from "react-toastify";

export type Category = {
  _id: string;
  name: string;
  createdAt?: string;
};

interface UseCategoryProps {
  limit?: number;
}

export function useCategory({ limit = 5 }: UseCategoryProps = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Search, Sort & Pagination
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        params: { search, sortBy, order, page, limit },
      });
      setCategories(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching categories", err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, sortBy, order, page]);

  // Add/Update Category
  const saveCategory = async (name: string) => {
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name });
        toast.success("Category updated successfully");
        setEditId(null);
      } else {
        await api.post("/categories", { name });
        toast.success("Category added successfully");
      }
      fetchCategories();
    } catch (err) {
      console.error("Error saving category", err);
      toast.error("Operation failed");
    }
  };

  // Delete
  const deleteCategory = async (_id: string) => {
    try {
      await api.delete(`/categories/${_id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
      toast.error("Failed to delete category");
    }
  };

  return {
    categories,
    editId,
    setEditId,
    search,
    setSearch,
    sortBy,
    setSortBy,
    order,
    setOrder,
    page,
    setPage,
    totalPages,
    saveCategory,
    deleteCategory,
  };
}
