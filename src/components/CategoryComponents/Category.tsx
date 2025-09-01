import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/Services/hooks/useCategory";

interface FormValues {
  name: string;
}

export default function Category() {
  const {
    categories,
    editId,
    setEditId,
    page,
    setPage,
    totalPages,
    saveCategory,
    deleteCategory,
  } = useCategory();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({ defaultValues: { name: "" } });

  const onSubmit = async (data: FormValues) => {
    try {
      await saveCategory(data.name);
      Swal.fire({
        icon: "success",
        title: editId ? "Category updated" : "Category added",
        timer: 1500,
        showConfirmButton: false,
        background: "#0d3b66",
        color: "#ffffff",
      });
      reset();
      setEditId(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Operation failed",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteCategory(id);
      Swal.fire({
        icon: "success",
        title: "Category deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="shadow-2xl rounded-2xl border border-gray-200">
          <CardHeader>
            <motion.h2
              className="text-3xl font-bold text-center mb-4"
              style={{ color: "#0d3b66" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Category Manager
            </motion.h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Input
                placeholder="Category Name"
                {...register("name", { required: "Category name is required" })}
                className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-300"
              />
              <Button
                type="submit"
                className="text-white shadow-lg hover:scale-105 transform transition-all"
                style={{ backgroundColor: "#0d3b66" }}
              >
                {editId ? "Save" : "Add"}
              </Button>
              {editId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    reset();
                  }}
                  className="text-white bg-gray-500 hover:bg-gray-600 shadow-md"
                >
                  Cancel
                </Button>
              )}
            </motion.form>
            {errors.name && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {errors.name.message}
              </motion.p>
            )}

            {/* Category List */}
            <ul className="space-y-3">
              {categories.map((cat) => (
                <motion.li
                  key={cat._id}
                  className="flex justify-between items-center p-3 border rounded-md shadow-md bg-gray-50 hover:shadow-lg transition-shadow cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditId(cat._id);
                        setValue("name", cat.name);
                      }}
                      className="text-white shadow-lg hover:scale-105 transform transition-all"
                      style={{ backgroundColor: "#0d3b66" }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:scale-105 transform transition-all"
                    >
                      Delete
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Pagination */}
            <motion.div
              className="flex justify-center items-center gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 shadow-md hover:shadow-lg"
                style={{ backgroundColor: "#0d3b66", color: "white" }}
              >
                Prev
              </Button>
              <span className="font-semibold text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 shadow-md hover:shadow-lg"
                style={{ backgroundColor: "#0d3b66", color: "white" }}
              >
                Next
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
