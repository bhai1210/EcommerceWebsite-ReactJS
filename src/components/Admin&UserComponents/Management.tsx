import { useEffect, useState } from "react";
import api from "@/Services/API/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

import UserForm from "./UserFrom";

import {
  type UserType,
  roleLabel,
  getUserSchema,
  type UserFormData,
} from "./UserHelpers";

export default function UserManager() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<UserType[]>("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete user
  const handleDelete = async (user: UserType) => {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ Add user
  const onAddSubmit = async (data: UserFormData) => {
    try {
      await api.post("/users", data);
      toast.success("User added");
      setOpenAdd(false);
      fetchUsers();
    } catch {
      toast.error("Failed to add user");
    }
  };

  // ✅ Edit user
  const onEditSubmit = async (data: UserFormData) => {
    if (!selectedUser) return;
    try {
      await api.put(`/users/${selectedUser._id}`, {
        ...data,
        password: data.password?.trim() || undefined,
      });
      toast.success("User updated");
      setOpenEdit(false);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col mt-3 sm:flex-row justify-between items-center gap-2">
        <h2 className="text-2xl font-bold text-[#0d3b66]"></h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-[#0d3b66] hover:bg-[#0a2f52]"
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#0d3b66] text-white sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <tr key={user._id}>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">{roleLabel(user.role)}</td>
                        <td className="border px-4 py-2 text-center space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenView(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setOpenEdit(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2">
        <span>
          Page {page + 1} of {pageCount || 1}
        </span>
        <select
          className="border rounded p-1"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(0);
          }}
        >
          {[5, 10, 25].map((r) => (
            <option key={r} value={r}>
              {r} per page
            </option>
          ))}
        </select>
        <Button onClick={() => setPage((p) => Math.max(p - 1, 0))}>Prev</Button>
        <Button onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}>
          Next
        </Button>
      </div>

      {/* Add Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <UserForm
            isEdit={false}
            onSubmit={onAddSubmit}
            onCancel={() => setOpenAdd(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              isEdit
              defaultValues={{
                email: selectedUser.email,
                role: selectedUser.role,
              }}
              onSubmit={onEditSubmit}
              onCancel={() => setOpenEdit(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View User</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {selectedUser && roleLabel(selectedUser.role)}
            </p>
          </div>
          <DialogFooter className="flex justify-end mt-4">
            <Button onClick={() => setOpenView(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
