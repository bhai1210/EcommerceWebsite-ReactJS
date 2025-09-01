import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import api from "@/Services/api/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender" }),
  address: z.string().min(5, "Address is required"),
  department: z.string().min(2, "Department is required"),
});

type Employee = z.infer<typeof employeeSchema> & { _id?: string };

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Employee>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "", phone: "", gender: undefined, address: "", department: "" },
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees", { params: { search, sortBy, order, page, limit } });
      setEmployees(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      Swal.fire({ icon: "error", title: "Failed to fetch employees", timer: 1500, showConfirmButton: false });
    }
  };

  useEffect(() => { fetchEmployees(); }, [search, sortBy, order, page]);

  const onSubmit = async (data: Employee) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, data);
        Swal.fire({ icon: "success", title: "Employee updated", timer: 1500, showConfirmButton: false });
      } else {
        await api.post("/employees", data);
        Swal.fire({ icon: "success", title: "Employee added", timer: 1500, showConfirmButton: false });
      }
      reset(); setEditingEmployee(null); fetchEmployees();
    } catch {
      Swal.fire({ icon: "error", title: "Operation failed", timer: 1500, showConfirmButton: false });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the employee permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await api.delete(`/employees/${id}`);
      Swal.fire({ icon: "success", title: "Employee deleted", timer: 1500, showConfirmButton: false });
      fetchEmployees();
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    reset(employee);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Employee Form */}
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="rounded-xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader className="bg-[#0d3b66] text-white rounded-t-xl px-6 py-4">
                <CardTitle className="text-lg font-semibold">
                  {editingEmployee ? "Edit Employee" : "Add Employee"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {[ "name", "phone", "address", "department"].map((field) => (
                    <div key={field} className="flex flex-col">
                      <Label className="text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input {...register(field as keyof Employee)} placeholder={`Enter ${field}`} className="mt-1 rounded-lg border-gray-300" />
                      {errors[field as keyof Employee] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field as keyof Employee]?.message as string}</p>
                      )}
                    </div>
                  ))}

                  {/* Gender */}
                  <div className="flex flex-col">
                    <Label className="text-gray-700">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value || ""} onValueChange={(val) => field.onChange(val)}>
                          <SelectTrigger className="mt-1 rounded-lg border-gray-300">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                  </div>

                  <Button type="submit" className="w-full py-3 bg-[#0d3b66] hover:bg-[#0a2e52] text-white font-semibold rounded-lg transition-all duration-200">
                    {editingEmployee ? "Update Employee" : "Add Employee"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Employee List */}
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="rounded-xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
              <CardHeader className="bg-[#0d3b66] text-white rounded-t-xl flex justify-between items-center px-6 py-4">
                <CardTitle className="text-lg font-semibold">Employee List</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {employees.length === 0 ? (
                  <p className="text-gray-500 text-center">No employees found</p>
                ) : (
                  <div className="grid gap-4">
                    {employees.map(emp => (
                      <motion.div key={emp._id} whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-md hover:shadow-lg transition">
                        <div>
                          <p className="font-semibold text-[#0d3b66] text-lg">{emp.name}</p>
                          <p className="text-sm text-gray-600">{emp.phone} | {emp.gender} | {emp.department}</p>
                          <p className="text-sm text-gray-500">{emp.address}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-[#0d3b66] text-[#0d3b66] hover:bg-[#0d3b66] hover:text-white" onClick={() => handleEdit(emp)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(emp._id)}>Delete</Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center space-x-2 mt-4">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="bg-[#0d3b66] text-white">Previous</Button>
                  <span className="px-4 py-2 text-[#0d3b66] font-semibold">Page {page} of {totalPages}</span>
                  <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="bg-[#0d3b66] text-white">Next</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
