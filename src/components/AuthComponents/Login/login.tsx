import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "@/Services/api/api";
import { useAuth } from "@/Context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ✅ Define same Role type as AuthContext
type Role = "user" | "admin" | "user2";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, token, role } = useAuth();

  // ✅ Redirect by role after login
  useEffect(() => {
    if (token && role) {
      const pathMap: Record<Role, string> = {
        admin: "/User",
        user: "/ClassCreate",
        user2: "/category",
      };
      navigate(pathMap[role], { replace: true });
    }
  }, [token, role, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth/login", data);
      const newToken: string = res.data.token;
      const backendRole: string = res.data.user.role;
      const user = res.data.user;

      // ✅ Ensure backendRole matches Role type
      const userRole: Role =
        backendRole === "admin" || backendRole === "user" || backendRole === "user2"
          ? backendRole
          : "user"; // fallback

      localStorage.setItem("user", JSON.stringify(user));
      login(newToken, userRole);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${res?.data?.user?.email.split("@")[0]}!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Invalid email or password";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: msg,
      });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200">
      {/* Left Side E-commerce Illustration */}
      <motion.div
        className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-blue-200 via-white to-blue-100"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="E-commerce illustration"
          className="w-3/4 h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500"
        />
      </motion.div>

      {/* Right Side Form */}
      <motion.div
        className="flex w-full md:w-1/2 items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6">
          <h2 className="text-3xl font-extrabold text-center text-blue-900">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                {...register("email")}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                className="text-[#0d3b66] hover:underline transition"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-3 mt-2 bg-[#0d3b66] hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-[#0d3b66] hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
