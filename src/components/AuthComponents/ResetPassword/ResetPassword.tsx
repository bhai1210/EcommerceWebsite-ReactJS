import { useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-6xl">
        {/* Left Illustration */}
        <div className="hidden md:block md:w-1/2 lg:w-5/12">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="Reset Password illustration"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 lg:w-4/12 mt-6 md:mt-0">
          <Card className="p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-[#0d3b66] mb-2">
              Reset Password
            </h2>
            <p className="text-center text-gray-500 mb-4 text-sm">
              Enter your new password to regain access to your account.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="w-full"
              />

              <Button
                type="submit"
                className="w-full py-3 font-bold rounded-xl bg-[#0d3b66] hover:bg-[#094067] transition-transform transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center"
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
            </form>
          </Card>

          <p className="text-center text-gray-400 mt-4 text-xs">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
}
