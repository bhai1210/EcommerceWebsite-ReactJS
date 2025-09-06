import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";

import api from "@/Services/api/api";
import { createClass, updateClass, fetchClasses, deleteClass } from "@/features/classSlice";

import type { AppDispatch } from "@/Store/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ClassItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  stockcount: number[];
  category: string | { _id: string; name: string } | null;
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

interface FormValues {
  name: string;
  price: string;
  description: string;
  stockcount: string;
  category: string;
}

export default function ClassCreate() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: classes = [], loading } = useSelector((state: any) => state.classes || { data: [], loading: false });

  const [editId, setEditId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: "", price: "", description: "", stockcount: "", category: "" },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
    dispatch(fetchClasses());
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const cats = (Array.isArray(res.data) ? res.data : res.data.data || []).map((c: any) => ({
        id: c._id,
        name: c.name,
      }));
      setCategories(cats);
    } catch {
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/uploads", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const uploadedUrl = res?.data?.fileUrl?.startsWith("http")
        ? res.data.fileUrl
        : `${import.meta.env.VITE_API_URL}${res?.data?.fileUrl}`;
      setImageUrl(uploadedUrl);
      Swal.fire({ icon: "success", title: "Image uploaded successfully", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Image upload failed!", timer: 1500, showConfirmButton: false });
    }
  };

  const resetForm = () => {
    reset({ name: "", price: "", description: "", stockcount: "", category: "" });
    setImageUrl(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormValues) => {
    if (!imageUrl) return Swal.fire("Error", "Please upload an image first", "error");

    const payload = {
      ...data,
      price: Number(data.price),
      stockcount: data.stockcount ? [Number(data.stockcount)] : [],
      image: imageUrl,
    };

    try {
      if (editId) {
        await dispatch(updateClass({ id: editId, payload })).unwrap();
        Swal.fire({ icon: "success", title: "Product updated successfully", timer: 1500, showConfirmButton: false });
      } else {
        await dispatch(createClass(payload)).unwrap();
        Swal.fire({ icon: "success", title: "Product created successfully", timer: 1500, showConfirmButton: false });
      }
      dispatch(fetchClasses());
      resetForm();
    } catch {
      Swal.fire("Error", "Operation failed", "error");
    }
  };

  const onDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the product permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteClass(id)).unwrap();
        Swal.fire({ icon: "success", title: "Product deleted", timer: 1500, showConfirmButton: false });
        dispatch(fetchClasses());
      } catch {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const currentClasses = classes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

  const getCategoryName = (cat: any) =>
    typeof cat === "string" ? categories.find((c) => c.id === cat)?.name || "N/A" : cat?.name || "N/A";

  const renderError = (field: keyof FormValues) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Card className="max-w-6xl mx-auto rounded-3xl shadow-2xl p-6 bg-white border border-gray-200">
          {/* Title */}
          <motion.h2
            className="text-3xl font-bold text-blue-900 text-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {editId ? "Edit Product" : "Create Product"}
          </motion.h2>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Inputs */}
            <Input placeholder="Product Name" {...register("name", { required: "Name is required" })} />
            {renderError("name")}

            <Input type="number" placeholder="Price" {...register("price", { required: "Price is required" })} />
            {renderError("price")}

            <Textarea placeholder="Description" {...register("description", { required: "Description is required" })} />
            {renderError("description")}

            <Input
              type="number"
              placeholder="Stock Count"
              {...register("stockcount", { required: "Stock count is required" })}
            />
            {renderError("stockcount")}

            {/* Category */}
            <Controller
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {renderError("category")}

            {/* File Upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
            {imageUrl && <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md mt-2" />}

            <Button type="submit">{editId ? "Update" : "Create"}</Button>
            {editId && <Button onClick={resetForm}>Cancel</Button>}
          </motion.form>

          {/* Table */}
          <Table className="w-full rounded-xl overflow-hidden shadow-lg">
            <TableHeader>
              <TableRow>
                {["Name", "Price", "Description", "Stock", "Category", "Image", "Actions"].map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClasses.map((cls: ClassItem) => (
                <TableRow key={cls._id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                  <TableCell>{cls.name}</TableCell>
                  <TableCell>{formatPrice(cls.price)}</TableCell>
                  <TableCell>{cls.description}</TableCell>
                  <TableCell>{cls.stockcount?.join(", ")}</TableCell>
                  <TableCell>{getCategoryName(cls.category)}</TableCell>
                  <TableCell>
                    {cls.image ? <img src={cls.image} alt="class" className="w-16 h-16 object-cover" /> : "No Image"}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => setEditId(cls._id)}>Edit</Button>
                    <Button variant="destructive" onClick={() => onDelete(cls._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 gap-2">
            <Button size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </Button>
            <span>{currentPage} / {totalPages}</span>
            <Button size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
