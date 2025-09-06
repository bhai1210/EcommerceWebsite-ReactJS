import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, type Variants } from "framer-motion";

import api from "@/Services/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// ✅ Fixed Schema
const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin", "user2"], {
    required_error: "Please select a role",
  }),
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
    defaultValues: { email: "", password: "", role: undefined },
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

  // ✅ Framer Motion variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <section className="flex min-h-screen bg-gradient-to-r from-blue-100 via-white">
      {/* Left Illustration */}
      <motion.div
        className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-[#0d3b66]/10 via-white to-[#0d3b66]/20"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src="https://img.freepik.com/free-vector/shopping-concept-illustration_114360-1405.jpg"
          alt="Register illustration"
          className="w-3/4 h-auto rounded-2xl shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500"
        />
      </motion.div>

      {/* Right Form */}
      <motion.div
        className="flex w-full md:w-1/2 items-center justify-center p-6"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <Card className="p-8 md:p-12 space-y-6 rounded-2xl shadow-xl border border-[#0d3b66]/20 bg-white/90 backdrop-blur-md transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-500">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-extrabold text-center text-[#0d3b66] drop-shadow-sm"
            >
              Create Your Account
            </motion.h2>

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Email */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email Address"
                      className="border-[#0d3b66]/40 focus:ring-[#0d3b66] focus:border-[#0d3b66]"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      className="border-[#0d3b66]/40 focus:ring-[#0d3b66] focus:border-[#0d3b66]"
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Role */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full border-[#0d3b66]/40 focus:ring-[#0d3b66] focus:border-[#0d3b66]">
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
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full py-3 bg-[#0d3b66] hover:bg-[#0d3b66] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-500 transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
              </motion.div>

              {/* Login Link */}
              <motion.p
                variants={itemVariants}
                className="text-sm text-center text-gray-600 mt-4"
              >
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#0d3b66] hover:underline font-medium transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </motion.p>
            </motion.form>
          </Card>
        </motion.div>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </section>
  );
}
