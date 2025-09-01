import React, { useEffect, useState, useRef } from "react";
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
    reset({
      name: "",
      price: "",
      description: "",
      stockcount: "",
      category: "",
    });
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

  const renderError = (field: keyof FormValues) => errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Card className="max-w-6xl mx-auto rounded-3xl shadow-2xl p-6 bg-white border border-gray-200">
          <motion.h2
            className="text-3xl font-bold text-blue-900 text-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {editId ? "Edit Product" : "Create Product"}
          </motion.h2>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Product Name */}
            <motion.div className="flex flex-col" whileHover={{ scale: 1.02 }}>
              <Input
                placeholder="Product Name"
                className="h-12 shadow-sm hover:shadow-md transition-shadow"
                {...register("name", { required: "Name is required" })}
              />
              {renderError("name")}
            </motion.div>

            {/* Price */}
            <motion.div className="flex flex-col" whileHover={{ scale: 1.02 }}>
              <Input
                type="number"
                placeholder="Price"
                className="h-12 shadow-sm hover:shadow-md transition-shadow"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be at least 0" },
                })}
              />
              {renderError("price")}
            </motion.div>

            {/* Description */}
            <motion.div className="flex flex-col" whileHover={{ scale: 1.02 }}>
              <Textarea
                placeholder="Description"
                className="h-28 p-2 resize-none shadow-sm hover:shadow-md transition-shadow"
                {...register("description", { required: "Description is required" })}
              />
              {renderError("description")}
            </motion.div>

            {/* Stock Count */}
            <motion.div className="flex flex-col" whileHover={{ scale: 1.02 }}>
              <Input
                type="number"
                placeholder="Stock Count"
                className="h-12 shadow-sm hover:shadow-md transition-shadow"
                {...register("stockcount", {
                  required: "Stock count is required",
                  min: { value: 0, message: "Stock count must be at least 0" },
                })}
              />
              {renderError("stockcount")}
            </motion.div>

            {/* Category */}
            <motion.div className="flex flex-col" whileHover={{ scale: 1.02 }}>
              <Controller
                control={control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 shadow-sm hover:shadow-md transition-shadow">
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
            </motion.div>

            {/* Image Upload */}
            <motion.div className="col-span-full flex flex-col" whileHover={{ scale: 1.02 }}>
              <label className="block mb-1 font-medium text-gray-700">
                {editId ? "Change Image" : "Upload Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="block w-full border rounded p-2 hover:border-blue-500 transition-colors"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              {imageUrl && (
                <motion.img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-md shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
              )}
            </motion.div>

            {/* Buttons */}
            <motion.div className="flex gap-4 col-span-full mt-3">
              <Button
                type="submit"
                className="bg-blue-900 text-white h-12 shadow-lg hover:scale-105 transform transition-all"
              >
                {editId ? "Update" : "Create"}
              </Button>
              {editId && (
                <Button type="button" variant="outline" className="h-12" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </motion.div>
          </motion.form>

          {/* Product Table */}
          <motion.h3
            className="text-lg font-semibold  mb-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Product List
          </motion.h3>

          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <Table className="w-full rounded-xl overflow-hidden shadow-lg">
              <TableHeader className="text-white">
  <TableRow>
    {["Name", "Price", "Description", "Stock", "Category", "Image", "Actions"].map((header) => (
      <TableHead key={header}>{header}</TableHead>
    ))}
  </TableRow>
</TableHeader>

                <TableBody>
                  {currentClasses.map((cls: ClassItem) => (
                    <TableRow
                      key={cls._id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                    >
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>{formatPrice(cls.price)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{cls.description}</TableCell>
                      <TableCell>{cls.stockcount?.join(", ")}</TableCell>
                      <TableCell>{getCategoryName(cls.category)}</TableCell>
                      <TableCell>
                        {cls.image ? (
                          <motion.img
                            src={cls.image}
                            alt="class"
                            className="w-16 h-16 object-cover rounded"
                            whileHover={{ scale: 1.1 }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditId(cls._id);
                            reset({
                              name: cls.name,
                              price: String(cls.price),
                              description: cls.description,
                              stockcount: String(cls.stockcount[0] || ""),
                              category: typeof cls.category === "string" ? cls.category : cls.category?._id || "",
                            });
                            setImageUrl(cls.image || null);
                          }}
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(cls._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-end mt-4 gap-2 items-center">
                <Button size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  Prev
                </Button>
                <span className="px-2">{currentPage} / {totalPages}</span>
                <Button size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
