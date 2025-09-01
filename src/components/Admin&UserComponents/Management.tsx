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
import Swal from "sweetalert2";

import UserForm from "./UserFrom";
import {
  type UserType,
  roleLabel,
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

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<UserType[]>("/users");
      setUsers(res.data);
    } catch {
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user: UserType) => {
    const result = await Swal.fire({
      title: `Delete ${user.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${user._id}`);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchUsers();
      } catch {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  // Add user
  const onAddSubmit = async (data: UserFormData) => {
    try {
      await api.post("/users", data);
      Swal.fire("Success", "User added successfully", "success");
      setOpenAdd(false);
      fetchUsers();
    } catch {
      Swal.fire("Error", "Failed to add user", "error");
    }
  };

  // Edit user
  const onEditSubmit = async (data: UserFormData) => {
    if (!selectedUser) return;
    try {
      await api.put(`/users/${selectedUser._id}`, {
        ...data,
        password: data.password?.trim() || undefined,
      });
      Swal.fire("Success", "User updated successfully", "success");
      setOpenEdit(false);
      fetchUsers();
    } catch {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-[#0d3b66]">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-[#0d3b66] hover:bg-[#0a2f52] transition-all"
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-[#0d3b66] text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-4 py-3 border-b">{user.email}</td>
                        <td className="px-4 py-3 border-b">{roleLabel(user.role)}</td>
                        <td className="px-4 py-3 border-b text-center space-x-1">
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
      <div className="flex flex-wrap justify-end items-center gap-2">
        <span className="text-gray-600">
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
          <UserForm isEdit={false} onSubmit={onAddSubmit} onCancel={() => setOpenAdd(false)} />
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
              defaultValues={{ email: selectedUser.email, role: selectedUser.role }}
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
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Email:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser && roleLabel(selectedUser.role)}
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
