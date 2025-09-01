import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/AuthComponents/Login/login";
import Register from "./components/AuthComponents/Register/Register";
import ForgotPassword from "./components/AuthComponents/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/AuthComponents/ResetPassword/ResetPassword";

import PrivateRoute from "./PrivateRoutes/PrivateRoute";
import { useAuth } from "./Context/AuthContext";
import Sidebar from "./components/LayoutComponts/Sidebar/Sidebar";
import Header from "./components/LayoutComponts/Header/Header";
import PurchaseItem from "./components/ProductComponents/BuyProduct/PurchaseItem";
import EcommerceDashboard from "./components/Dashboards/AdminDashboard/AdminDashboard";
import RazorpayPayment from "./components/PayementComponets/RazorpayPayment";
import CategoryManager from "./components/CategoryComponents/Category";
import UserManager from "./components/Admin&UserComponents/Management";
import ClassCreate from "./components/ProductComponents/CreateProduct/CreateProduct";
import EmployeeManagement from "./components/EmployeeComponents/EmployeeManagement";

import "./App.css";

export default function App() {
  const { token, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redirect only if user logs in (not on every refresh)
  useEffect(() => {
    if (token && role && location.pathname === "/") {
      // Only redirect if currently on the login page
      let path = "/";
      switch (role) {
        case "admin":
          path = "/Dashboard";
          break;
        case "user":
          path = "/purchase";
          break;
        case "user2":
          path = "/category";
          break;
        default:
          path = "/Dashboard";
      }
      navigate(path, { replace: true });
    }
  }, [token, role, location.pathname, navigate]);

  // Public routes (login, register, etc.)
  if (!token) {
    return (
      <div className="app-public">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  // Private routes
  return (
    <div className="app-private">
      <Sidebar role={role} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="app-main">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="content">
          <Routes>
            <Route
              path="/razorpay"
              element={
                <PrivateRoute>
                  <RazorpayPayment />
                </PrivateRoute>
              }
            />
            <Route
              path="/category"
              element={
                <PrivateRoute>
                  <CategoryManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/Dashboard"
              element={
                <PrivateRoute>
                  <EcommerceDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee"
              element={
                <PrivateRoute>
                  <EmployeeManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/purchase"
              element={
                <PrivateRoute>
                  <PurchaseItem />
                </PrivateRoute>
              }
            />
            <Route
              path="/AdminPanel"
              element={
                <PrivateRoute>
                  <UserManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/CreateProduct"
              element={
                <PrivateRoute>
                  <ClassCreate />
                </PrivateRoute>
              }
            />

            {/* Fallback: keep user on current page if route invalid */}
            <Route path="*" element={<Navigate to={location.pathname || "/Dashboard"} replace />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
