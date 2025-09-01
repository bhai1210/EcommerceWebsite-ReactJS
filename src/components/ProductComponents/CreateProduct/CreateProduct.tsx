import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("Failed to fetch categories");
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
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed!");
    }
  };

  const resetForm = () => {
    reset();
     reset({
      name: "",
      price: 0,
      description: "",
      stockcount: 0,
      category: "",
    });
    setImageUrl(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormValues) => {
    if (!imageUrl) return toast.error("Please upload an image first");

    const payload = {
      ...data,
      price: Number(data.price),
      stockcount: data.stockcount ? [Number(data.stockcount)] : [],
      image: imageUrl,
    };

    try {
      if (editId) {
        await dispatch(updateClass({ id: editId, payload })).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createClass(payload)).unwrap();
        toast.success("Product created successfully");
      }
      dispatch(fetchClasses());
      resetForm();
       reset({
      name: "",
      price: 0,
      description: "",
      stockcount: 0,
      category: "",
    });
    } catch {
      toast.error("Operation failed");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await dispatch(deleteClass(id)).unwrap();
      toast.success("Product deleted successfully");
      dispatch(fetchClasses());
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const currentClasses = classes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

  const getCategoryName = (cat: any) =>
    typeof cat === "string" ? categories.find((c) => c.id === cat)?.name || "N/A" : cat?.name || "N/A";

  const renderError = (field: keyof FormValues) => errors[field] && <p className="text-red-500 text-sm">{errors[field]?.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="max-w-6xl mx-auto rounded-2xl shadow-md p-6 bg-white">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">{editId ? "Edit Product" : "Create Product"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
  {/* Product Name */}
  <div className="flex flex-col">
    <Input
      placeholder="Product Name"
      className="h-12"
      {...register("name", { required: "Name is required" })}
    />
    <span className="text-red-500 text-sm mt-1">{renderError("name")}</span>
  </div>

  {/* Price */}
  <div className="flex flex-col">
    <Input
      type="number"
      placeholder="Price"
      className="h-12"
      {...register("price", {
        required: "Price is required",
        min: { value: 0, message: "Price must be at least 0" },
      })}
    />
    <span className="text-red-500 text-sm mt-1">{renderError("price")}</span>
  </div>

  {/* Description */}
  <div className="flex flex-col">
    <Textarea
      placeholder="Description"
      className="h-28 p-2 resize-none"
      {...register("description", { required: "Description is required" })}
    />
    <span className="text-red-500 text-sm mt-1">{renderError("description")}</span>
  </div>

  {/* Stock Count */}
  <div className="flex flex-col">
    <Input
      type="number"
      placeholder="Stock Count"
      className="h-12"
      {...register("stockcount", {
        required: "Stock count is required",
        min: { value: 0, message: "Stock count must be at least 0" },
      })}
    />
    <span className="text-red-500 text-sm mt-1">{renderError("stockcount")}</span>
  </div>

  {/* Category */}
  <div className="flex flex-col">
    <Controller
      control={control}
      name="category"
      rules={{ required: "Category is required" }}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="h-12">
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
    <span className="text-red-500 text-sm mt-1">{renderError("category")}</span>
  </div>

  {/* Image Upload */}
  <div className="col-span-full flex flex-col">
    <label className="block mb-1 font-medium text-gray-700">
      {editId ? "Change Image" : "Upload Image"}
    </label>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      className="block w-full border rounded p-2"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
    {imageUrl && (
      <img
        src={imageUrl}
        alt="Preview"
        className="mt-2 w-32 h-32 object-cover rounded-md shadow"
      />
    )}
  </div>

  {/* Buttons */}
  <div className="flex gap-4 col-span-full mt-3">
    <Button type="submit" className="bg-blue-800 text-white h-12">
      {editId ? "Update" : "Create"}
    </Button>
    {editId && (
      <Button type="button" variant="outline" className="h-12" onClick={resetForm}>
        Cancel
      </Button>
    )}
  </div>
</form>


          <h3 className="text-lg font-semibold text-gray-700 mb-3">Product List</h3>
          {loading ? <p className="text-center py-4">Loading...</p> : (
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {["Name", "Price", "Description", "Stock", "Category", "Image", "Actions"].map((header) => (
                    <TableHead key={header} className="bg-[#0d3b66] text-white">{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClasses.map((cls: ClassItem) => (
                  <TableRow key={cls._id} className="hover:bg-gray-50">
                    <TableCell>{cls.name}</TableCell>
                    <TableCell>{formatPrice(cls.price)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{cls.description}</TableCell>
                    <TableCell>{cls.stockcount?.join(", ")}</TableCell>
                    <TableCell>{getCategoryName(cls.category)}</TableCell>
                    <TableCell>{cls.image ? <img src={cls.image} alt="class" className="w-16 h-16 object-cover rounded" /> : "No Image"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditId(cls._id);
                        reset({
                          name: cls.name,
                          price: String(cls.price),
                          description: cls.description,
                          stockcount: String(cls.stockcount[0] || ""),
                          category: typeof cls.category === "string" ? cls.category : cls.category?._id || "",
                        });
                        setImageUrl(cls.image || null);
                      }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(cls._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex justify-end mt-4 gap-2 items-center">
            <Button size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
            <span className="px-2">{currentPage} / {totalPages}</span>
            <Button size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
