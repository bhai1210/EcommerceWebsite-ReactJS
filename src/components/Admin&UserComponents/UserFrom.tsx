
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {

  DialogFooter,
} from "@/components/ui/dialog";


type UserRole = "admin" | "user" | "user2";



// ✅ Schema builder
const getUserSchema = (isEdit: boolean) =>
  z.object({
    email: z.string().email("Invalid email"),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user", "user2"]),
  });

type UserFormData = z.infer<ReturnType<typeof getUserSchema>>;

/* ----------------------- Shared UserForm ----------------------- */
export default  function UserForm({
  isEdit,
  defaultValues,
  onSubmit,
  onCancel,
}: {
  isEdit: boolean;
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(getUserSchema(isEdit)),
    defaultValues,
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} placeholder="Email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <Input
        {...register("password")}
        type="password"
        placeholder={isEdit ? "New Password (optional)" : "Password"}
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

      <Select
        value={watch("role")}
        onValueChange={(val) => setValue("role", val as UserRole)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="user2">User2</SelectItem>
        </SelectContent>
      </Select>

      <DialogFooter className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
      </DialogFooter>
    </form>
  );
}