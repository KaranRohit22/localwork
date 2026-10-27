"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Profile, UserRole } from "@/types";
import { getAdminUsersAction, toggleAdminUserStatusAction } from "@/app/actions/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [inspectUser, setInspectUser] = useState<Profile | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAdminUsersAction().then((users) => {
      if (isMounted) {
        setUsers(users || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshUsers = async () => {
    const users = await getAdminUsersAction();
    setUsers(users || []);
  };

  const toggleUserStatus = async (id: string, currentActive: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: !currentActive } : u))
    );
    if (inspectUser && inspectUser.id === id) {
      setInspectUser((prev) => (prev ? { ...prev, is_active: !currentActive } : null));
    }
    await toggleAdminUserStatusAction(id);
    refreshUsers();
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.is_active) ||
      (statusFilter === "suspended" && !u.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">User Directory</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          View all registered customer, professional, and administrator accounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
            className="py-2 px-3 rounded-xl border border-border text-xs sm:text-sm bg-input-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="professional">Professionals</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "suspended")}
            className="py-2 px-3 rounded-xl border border-border text-xs sm:text-sm bg-input-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-card-elevated/70 border-b border-border text-xs font-semibold uppercase tracking-wider text-text-muted">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-card-elevated/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar_url} alt={user.full_name} size="md" />
                      <div>
                        <p className="font-semibold text-text">{user.full_name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {user.role === "admin" && (
                      <span className="text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                    {user.role === "professional" && (
                      <span className="text-xs font-semibold text-indigo-300 bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-full">
                        Professional
                      </span>
                    )}
                    {user.role === "customer" && (
                      <span className="text-xs font-medium text-slate-300 bg-card-elevated border border-border px-2.5 py-1 rounded-full">
                        Customer
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-error">
                        <span className="h-1.5 w-1.5 rounded-full bg-error" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-xs text-text-muted">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInspectUser(user)}
                      >
                        Details
                      </Button>
                      {user.role !== "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            user.is_active
                              ? "text-error border-error/20 hover:bg-error-light/50"
                              : "text-success border-success/20 hover:bg-success-light"
                          }
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                        >
                          {user.is_active ? "Suspend" : "Activate"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect User Modal */}
      <Modal
        isOpen={!!inspectUser}
        onClose={() => setInspectUser(null)}
        title="User Record"
        description={`User ID: ${inspectUser?.id}`}
        maxWidth="md"
      >
        {inspectUser && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-input-bg/60">
              <Avatar src={inspectUser.avatar_url} alt={inspectUser.full_name} size="lg" />
              <div>
                <h4 className="font-bold text-text text-base">{inspectUser.full_name}</h4>
                <p className="text-xs text-text-muted">{inspectUser.email}</p>
                <p className="text-xs text-text-muted">{inspectUser.phone || "No phone provided"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border">
                <span className="text-text-muted block">Role</span>
                <span className="font-semibold text-text capitalize">{inspectUser.role}</span>
              </div>
              <div className="p-3 rounded-lg border border-border">
                <span className="text-text-muted block">Account Status</span>
                <span
                  className={`font-semibold ${
                    inspectUser.is_active ? "text-success" : "text-error"
                  }`}
                >
                  {inspectUser.is_active ? "Active" : "Suspended"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              {inspectUser.role !== "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={inspectUser.is_active ? "text-error" : "text-success"}
                  onClick={() => toggleUserStatus(inspectUser.id, inspectUser.is_active)}
                >
                  {inspectUser.is_active ? "Suspend Account" : "Re-activate Account"}
                </Button>
              )}
              <Button size="sm" onClick={() => setInspectUser(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
