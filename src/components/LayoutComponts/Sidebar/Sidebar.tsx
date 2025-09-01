import { useEffect, useRef } from "react";
import "./SidebarLayout.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

interface SidebarProps {
  role: "admin" | "user" | "user2";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface MenuItem {
  label: string;
  path: string;
}

export default function Sidebar({ role, isOpen, setIsOpen }: SidebarProps) {
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Menu items for each role
  const menuItems: Record<"admin" | "user" | "user2", MenuItem[]> = {
    admin: [
      { label: "Dashboard", path: "/Dashboard" },
      { label: "Admin Panel", path: "/AdminPanel" },
      { label: "Add Products", path: "/CreateProduct" },
      { label: "Add Category", path: "/category" },
      { label: "Employee Management", path: "/employee" },
      { label: "Purchase Items", path: "/purchase" },
    ],
    user: [{ label: "Purchase Items", path: "/purchase" }],
    user2: [{ label: "Categories", path: "/category" }],
  };

  const items = menuItems[role] || [];

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Logout wrapper to also close sidebar
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="logo">Payment App</h2>

      <ul className="menu-list">
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
