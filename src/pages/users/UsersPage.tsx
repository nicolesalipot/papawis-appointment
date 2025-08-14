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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export function UsersPage() {
  const {
    users,
    pagination,
    filters,
    stats,
    isLoading,
    error,
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

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.active}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Recent Signups
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.recentSignups}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Today
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.activeToday}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Role Filter */}
              <div className="min-w-[140px]">
                <Select
                  value={filters.role || "all"}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {Object.entries(USER_ROLES).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="min-w-[140px]">
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(USER_STATUS_CONFIG).map(
                      ([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ search: "", role: "all", status: "all" });
                }}
                className="ml-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Alert>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedUsers.length} user
                {selectedUsers.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-700 border-green-300 bg-green-50 hover:bg-green-100"
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-yellow-700 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                >
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-700 border-red-300 bg-red-50 hover:bg-red-100"
                >
                  Delete
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        <Avatar>
                          <AvatarImage
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          user.role === "super_admin"
                            ? "destructive"
                            : user.role === "facility_manager"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {USER_ROLES[user.role].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "inactive"
                            ? "secondary"
                            : user.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {USER_STATUS_CONFIG[user.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="Edit user">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivate(user.id)}
                            title="Deactivate user"
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivate(user.id)}
                            title="Activate user"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleResetPassword(
                              user.id,
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          title="Reset password"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(
                              user.id,
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          title="Delete user"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">
            No users found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {filters.search ||
            filters.role !== "all" ||
            filters.status !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by creating a new user."}
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add your first user
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )}{" "}
              of {pagination.total} users
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
