import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  Search,
  Filter,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit3,
  X,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarIcon,
  Download,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { useUserStore } from "@/store/userStore";
import {
  BOOKING_STATUS_CONFIG,
  BOOKING_TYPE_CONFIG,
  BookingStatus,
  BookingType,
  Booking,
} from "@/lib/types/booking";
import { cn } from "@/lib/utils";
import { BookingCalendar } from "@/components/calendar/BookingCalendar";
import { BookingFormDialog } from "@/components/bookings/BookingFormDialog";
import { BookingDetailDialog } from "@/components/bookings/BookingDetailDialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BookingsPage() {
  const {
    bookings,
    pagination,
    filters,
    stats,
    isLoading,
    error,
    setFilters,
    setPagination,
    confirmBooking,
    cancelBooking,
    completeBooking,
    deleteBooking,
  } = useBookingStore();

  const { facilities } = useFacilityStore();
  const { users } = useUserStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

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

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map((booking) => booking.id));
    }
  };

  const handleConfirmBooking = async (id: string) => {
    try {
      await confirmBooking(id);
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
  };

  const handleCancelBooking = async (id: string, title: string) => {
    const reason = window.prompt(
      `Cancel booking "${title}"?\n\nPlease provide a reason:`
    );
    if (reason !== null) {
      try {
        await cancelBooking(id, reason);
      } catch (error) {
        console.error("Failed to cancel booking:", error);
      }
    }
  };

  const handleCompleteBooking = async (id: string) => {
    try {
      await completeBooking(id);
    } catch (error) {
      console.error("Failed to complete booking:", error);
    }
  };

  const handleDeleteBooking = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteBooking(id);
        setSelectedBookings((prev) =>
          prev.filter((bookingId) => bookingId !== id)
        );
      } catch (error) {
        console.error("Failed to delete booking:", error);
      }
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      no_show: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getTypeColor = (type: BookingType) => {
    const colors = {
      regular: "bg-blue-100 text-blue-800",
      recurring: "bg-purple-100 text-purple-800",
      event: "bg-orange-100 text-orange-800",
      maintenance: "bg-red-100 text-red-800",
      blocked: "bg-gray-100 text-gray-800",
    };
    return colors[type];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Booking Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage facility bookings, availability, and schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7"
            >
              <List className="h-3 w-3 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="h-7"
            >
              <CalendarIcon className="h-3 w-3 mr-1" />
              Calendar
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Bookings
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
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Confirmed
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.confirmed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Revenue
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(stats.revenue.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Utilization
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.utilization.overall}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters - Only show for list view */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Facility Filter */}
                <div className="min-w-[160px]">
                  <Select
                    value={filters.facilityId || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "facilityId",
                        value === "all" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="min-w-[140px]">
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.entries(BOOKING_STATUS_CONFIG).map(
                        ([value, config]) => (
                          <SelectItem key={value} value={value}>
                            {config.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="min-w-[120px]">
                  <Select
                    value={filters.type || "all"}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(BOOKING_TYPE_CONFIG).map(
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
                    setFilters({
                      search: "",
                      facilityId: "",
                      status: "all",
                      type: "all",
                    });
                  }}
                  className="ml-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <BookingCalendar
          onBookingClick={(booking) => {
            // Handle booking click - could open details modal
            console.log("Booking clicked:", booking);
          }}
          onCreateBooking={(date, timeSlot) => {
            // Handle create booking - could open create modal with pre-filled date/time
            console.log("Create booking for:", date, timeSlot);
            setIsCreateModalOpen(true);
          }}
          onEditBooking={(booking) => {
            // Handle edit booking - could open edit modal
            console.log("Edit booking:", booking);
          }}
        />
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <Alert>
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedBookings.length} booking
                    {selectedBookings.length !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-700 border-green-300 bg-green-50 hover:bg-green-100"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-700 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-700 border-red-300 bg-red-50 hover:bg-red-100"
                    >
                      Cancel
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

          {/* Bookings Table */}
          {!isLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    All Bookings
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="p-1 text-slate-600 hover:text-slate-900"
                      title={
                        selectedBookings.length === bookings.length
                          ? "Deselect all"
                          : "Select all"
                      }
                    >
                      {selectedBookings.length === bookings.length ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
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
                            selectedBookings.length === bookings.length &&
                            bookings.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => handleSelectBooking(booking.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {booking.title}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.facilityName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                  booking.type
                                )}`}
                              >
                                {BOOKING_TYPE_CONFIG[booking.type].label}
                              </span>
                              {booking.isRecurring && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Recurring
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {booking.customerEmail}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3" />
                            {booking.participants} participant
                            {booking.participants !== 1 ? "s" : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {formatDate(booking.startTime)}
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatTime(booking.startTime)} -{" "}
                            {formatTime(booking.endTime)}
                          </div>
                          <div className="text-sm text-slate-500">
                            {booking.duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {BOOKING_STATUS_CONFIG[booking.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatCurrency(booking.pricePerHour)}/hr
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                              title="Edit booking"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            {booking.status === "pending" && (
                              <button
                                onClick={() => handleConfirmBooking(booking.id)}
                                className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                                title="Confirm booking"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  handleCompleteBooking(booking.id)
                                }
                                className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                title="Mark as completed"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {(booking.status === "pending" ||
                              booking.status === "confirmed") && (
                              <button
                                onClick={() =>
                                  handleCancelBooking(booking.id, booking.title)
                                }
                                className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                title="Cancel booking"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteBooking(booking.id, booking.title)
                              }
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete booking"
                            >
                              <XCircle className="h-4 w-4" />
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
          {!isLoading && bookings.length === 0 && !error && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filters.search ||
                filters.facilityId ||
                filters.status !== "all" ||
                filters.type !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating a new booking."}
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  Create your first booking
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && bookings.length > 0 && (
            <Card>
              <CardContent className="flex items-center justify-between px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}{" "}
                  of {pagination.total} bookings
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
        </>
      )}
    </div>
  );
}
