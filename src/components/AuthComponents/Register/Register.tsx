import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

import api from "@/Services/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Updated schema: role cannot be empty
const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "user2"], { errorMap: () => ({ message: "Please select a role" }) }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", role: "" }, // role empty by default
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post("/auth/register", data);
      toast.success(res.data.message || "Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Registration failed";
      toast.error(msg);
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Left Illustration */}
      <motion.div
        className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Register illustration"
          className="w-3/4 h-auto rounded-xl shadow-2xl"
        />
      </motion.div>

      {/* Right Form */}
      <motion.div
        className="flex w-full md:w-1/2 items-center justify-center p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card className=" p-8 md:p-12 space-y-6 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-center text-blue-900">Register Your Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email Address"
                    className="focus:ring-2 focus:ring-blue-400"
                  />
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="focus:ring-2 focus:ring-blue-400"
                  />
                )}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="user2">User2</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-[#0d3b66] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </form>
        </Card>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </section>
  );
}
