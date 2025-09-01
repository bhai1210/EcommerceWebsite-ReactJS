import { useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

import api from "@/Services/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", { token, password });
      toast.success(res.data.message || "Password reset successful!");
      setPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <motion.div
        className="flex flex-col md:flex-row items-center w-full max-w-6xl gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Illustration */}
        <motion.div
          className="hidden md:flex md:w-1/2 lg:w-5/12"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Reset Password illustration"
            className="w-full h-auto object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        {/* Right Form */}
        <motion.div
          className="w-full md:w-1/2 lg:w-4/12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="p-8 md:p-10 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md hover:shadow-2xl transition-all duration-500">
            <motion.h2
              className="text-3xl font-bold text-center text-[#0d3b66] mb-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Reset Password
            </motion.h2>
            <motion.p
              className="text-center text-gray-500 mb-6 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Enter your new password to regain access to your account.
            </motion.p>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="focus:ring-2 focus:ring-[#0d3b66] transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full py-3 font-semibold rounded-xl bg-[#0d3b66] hover:bg-[#094067] transition-transform duration-500 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
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
                    "Reset Password"
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>

          <motion.p
            className="text-center text-gray-400 mt-6 text-xs md:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
}
