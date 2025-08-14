import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Key,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import {
  USER_ROLES,
  USER_STATUS_CONFIG,
  UserRole,
  UserStatus,
} from "@/lib/types/user";
import { cn } from "@/lib/utils";

export function UsersPage() {
  const {
    users,
    pagination,
    filters,
    stats,
    isLoading,
    error,
    fetchUsers,
    fetchUserStats,
    setFilters,
    setPagination,
    deleteUser,
    activateUser,
    deactivateUser,
    resetUserPassword,
  } = useUserStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [
    fetchUsers,
    fetchUserStats,
    filters,
    pagination.page,
    pagination.pageSize,
  ]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      setFilters({ search: value });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUser(id);
        setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateUser(id);
    } catch (error) {
      console.error("Failed to activate user:", error);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUser(id);
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    if (window.confirm(`Send password reset email to ${name}?`)) {
      try {
        await resetUserPassword(id);
        alert("Password reset email sent successfully!");
      } catch (error) {
        console.error("Failed to reset password:", error);
      }
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      super_admin: "bg-red-100 text-red-800",
      facility_manager: "bg-blue-100 text-blue-800",
      member: "bg-green-100 text-green-800",
    };
    return colors[role];
  };

  const getStatusColor = (status: UserStatus) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="mt-2 text-slate-600">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <UserPlus className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Recent Signups
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.recentSignups}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Today
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.activeToday}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filters.role || "all"}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            {Object.entries(USER_ROLES).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {Object.entries(USER_STATUS_CONFIG).map(([value, config]) => (
              <option key={value} value={value}>
                {config.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ search: "", role: "all", status: "all" });
            }}
            className="px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                Activate
              </button>
              <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                Deactivate
              </button>
              <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Users Table */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                All Users
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="p-1 text-slate-600 hover:text-slate-900"
                  title={
                    selectedUsers.length === users.length
                      ? "Deselect all"
                      : "Select all"
                  }
                >
                  {selectedUsers.length === users.length ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === users.length &&
                        users.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {USER_ROLES[user.role].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {USER_STATUS_CONFIG[user.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                          title="Edit user"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {user.status === "active" ? (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded"
                            title="Deactivate user"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id)}
                            className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                            title="Activate user"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleResetPassword(
                              user.id,
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
                          title="Reset password"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              user.id,
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && users.length === 0 && !error && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {filters.search ||
            filters.role !== "all" ||
            filters.status !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by creating a new user."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add your first user
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-6 py-4">
          <div className="text-sm text-slate-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} users
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
