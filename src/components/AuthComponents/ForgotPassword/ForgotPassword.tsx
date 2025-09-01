import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "@/Services/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const res = await api.post("/auth/forgot-password", data);
      toast.success(res.data.message || "Password reset link sent! Check your email.");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-6xl gap-6">
        {/* Left Illustration */}
        <motion.div
          className="hidden md:block md:w-1/2 lg:w-5/12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Forgot Password illustration"
            className="w-full h-auto object-cover rounded-xl shadow-2xl"
          />
        </motion.div>

        {/* Right Form */}
        <motion.div
          className="w-full md:w-1/2 lg:w-4/12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="p-8 md:p-10 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-2">
              Forgot Password
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm md:text-base">
              Enter your registered email to receive a password reset link.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  {...register("email")}
                  className="focus:ring-2 focus:ring-blue-400"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 font-semibold rounded-xl bg-blue-700 hover:bg-blue-800 transition-transform transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Card>

          <p className="text-center text-gray-400 mt-6 text-xs md:text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
}
