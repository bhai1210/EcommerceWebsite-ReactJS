import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
interface AuthContextType {
  token: string;
  role: string;
  login: (newToken: string, userRole: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string>(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState<string>(() => localStorage.getItem("role") || "");

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

 // AuthContext.tsx
const login = (newToken: string, userRole: string) => {
  setToken(newToken);
  setRole(userRole);
  toast.success("✅ Login successful!", { autoClose: 2000 });
};

const logout = () => {
  setToken("");
  setRole("");
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  toast.info("👋 You have been logged out.", { autoClose: 2000 });
};


  const value = useMemo(() => ({ token, role, login, logout }), [token, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
