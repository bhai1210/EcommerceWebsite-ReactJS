import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { name: "" } });

  // Submit handler
  const onSubmit = async (data: FormValues) => {
    await saveCategory(data.name);
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <h2
            className="text-2xl font-bold text-center"
            style={{ color: "#0d3b66" }}
          >
            Category Manager
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <Input
              placeholder="Category Name"
              {...register("name", { required: "Category name is required" })}
              className="flex-1"
            />
            <Button
              type="submit"
              className="text-white"
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
                className="text-white bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            )}
          </form>
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* List */}
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center p-3 border rounded-md shadow-sm bg-gray-50"
              >
                <span className="font-medium text-gray-700">{cat.name}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditId(cat._id);
                      setValue("name", cat.name);
                    }}
                    className="text-white"
                    style={{ backgroundColor: "#0d3b66" }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteCategory(cat._id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2"
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
              className="px-4 py-2"
              style={{ backgroundColor: "#0d3b66", color: "white" }}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
