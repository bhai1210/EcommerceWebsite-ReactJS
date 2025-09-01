import { z } from "zod";

export type UserRole = "admin" | "user" | "user2";

export type UserType = {
  _id: string;
  email: string;
  role: UserRole;
  password?: string;
};

export const roleLabel = (role: UserRole) =>
  role === "admin" ? "Admin" : role === "user" ? "User" : "User2";

// ✅ Schema builder
export const getUserSchema = (isEdit: boolean) =>
  z.object({
    email: z.string().email("Invalid email"),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user", "user2"]),
  });

export type UserFormData = z.infer<ReturnType<typeof getUserSchema>>;
