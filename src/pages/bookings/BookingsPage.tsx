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
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { useUserStore } from "@/store/userStore";
import {
  BOOKING_STATUS_CONFIG,
  BOOKING_TYPE_CONFIG,
  BookingStatus,
  BookingType,
} from "@/lib/types/booking";
import { cn } from "@/lib/utils";
import { BookingCalendar } from "@/components/calendar/BookingCalendar";

export function BookingsPage() {
  const {
    bookings,
    pagination,
    filters,
    stats,
    isLoading,
    error,
    fetchBookings,
    fetchBookingStats,
    setFilters,
    setPagination,
    confirmBooking,
    cancelBooking,
    completeBooking,
    deleteBooking,
  } = useBookingStore();

  const { facilities, fetchFacilities } = useFacilityStore();
  const { users } = useUserStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetchBookings();
    fetchBookingStats();
    fetchFacilities();
  }, [
    fetchBookings,
    fetchBookingStats,
    fetchFacilities,
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
          <h1 className="text-3xl font-bold text-slate-900">
            Booking Management
          </h1>
          <p className="mt-2 text-slate-600">
            Manage facility bookings, availability, and schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1",
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <List className="h-3 w-3" />
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1",
                viewMode === "calendar"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              Calendar
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Bookings
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
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Confirmed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Revenue</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(stats.revenue.total)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Utilization
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.utilization.overall}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters - Only show for list view */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Facility Filter */}
            <select
              value={filters.facilityId || "all"}
              onChange={(e) =>
                handleFilterChange(
                  "facilityId",
                  e.target.value === "all" ? "" : e.target.value
                )
              }
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Facilities</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
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
              {Object.entries(BOOKING_STATUS_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={filters.type || "all"}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(BOOKING_TYPE_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  search: "",
                  facilityId: "",
                  status: "all",
                  type: "all",
                });
              }}
              className="px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedBookings.length} booking
                  {selectedBookings.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    Confirm
                  </button>
                  <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                    Complete
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                    Cancel
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
              <Calendar className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {filters.search ||
                filters.facilityId ||
                filters.status !== "all" ||
                filters.type !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating a new booking."}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create your first booking
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && bookings.length > 0 && (
            <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-6 py-4">
              <div className="text-sm text-slate-600">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )}{" "}
                of {pagination.total} bookings
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
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
                ))}

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
        </>
      )}
    </div>
  );
}
