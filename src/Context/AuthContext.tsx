import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Define the allowed roles
type Role = "user" | "admin" | "user2";

interface AuthContextType {
  token: string;
  role: Role;
  login: (newToken: string, userRole: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to safely parse role from storage
function parseRole(value: string | null): Role {
  if (value === "user" || value === "admin" || value === "user2") {
    return value;
  }
  return "user"; // default fallback
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string>(
    () => localStorage.getItem("token") || ""
  );
  const [role, setRole] = useState<Role>(
    () => parseRole(localStorage.getItem("role"))
  );

  // Persist token and role in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [token, role]);

  const login = (newToken: string, userRole: Role) => {
    setToken(newToken);
    setRole(userRole);
    toast.success("✅ Login successful!", { autoClose: 2000 });
  };

  const logout = () => {
    setToken("");
    setRole("user"); // reset to default
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
    toast.info("👋 You have been logged out.", { autoClose: 2000 });
  };

  const value = useMemo(
    () => ({ token, role, login, logout }),
    [token, role]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
