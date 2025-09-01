import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; 
import { Button } from "@/components/ui/button";

interface User {
  email: string;
  [key: string]: any;
}

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      {/* Left: Hamburger (only mobile) & Logo */}
      <div className="flex items-center gap-4">
        {/* Hide on md and larger screens */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-full md:hidden"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-700 transition-transform duration-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 transition-transform duration-300" />
          )}
        </Button>

        <h1 className="text-xl font-bold text-[#0d3b66] tracking-wide">
          Ecommerce Dashboard
        </h1>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium hidden sm:block">
    {user ? user.email.split("@")[0] : "Guest"}

        </span>
        <div className="w-9 h-9 rounded-full bg-[#0d3b66] flex items-center justify-center text-white font-semibold shadow-md cursor-pointer hover:scale-105 transition-transform">
          {user ? user.email.charAt(0).toUpperCase() : "G"}
        </div>
      </div>
    </header>
  );
}
