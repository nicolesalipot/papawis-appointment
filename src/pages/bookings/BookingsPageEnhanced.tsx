import React, { useEffect, useState } from "react";
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
  Plus,
} from "lucide-react";
import { format } from "date-fns";
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

export function BookingsPageEnhanced() {
  // Icon mapping for booking statuses
  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: XCircle,
    completed: CheckCircle,
    no_show: X,
  };

  // Icon mapping for booking types
  const typeIcons = {
    regular: Calendar,
    recurring: RefreshCw,
    event: CalendarPlus,
    maintenance: Settings,
    blocked: X,
  };

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

  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  // Dialog states
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [facilityFilter, setFacilityFilter] = useState<string>("all");

  useEffect(() => {
    // Apply filters
    setFilters({
      search: searchTerm,
      status:
        statusFilter === "all" ? undefined : (statusFilter as BookingStatus),
      type: typeFilter === "all" ? undefined : (typeFilter as BookingType),
      facilityId: facilityFilter === "all" ? undefined : facilityFilter,
    });
  }, [searchTerm, statusFilter, typeFilter, facilityFilter, setFilters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const selectAllBookings = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map((booking) => booking.id));
    }
  };

  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailOpen(true);
  };

  const openEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsBookingFormOpen(true);
  };

  const handleBookingFormClose = () => {
    setIsBookingFormOpen(false);
    setEditingBooking(null);
  };

  const handleBookingDetailClose = () => {
    setIsBookingDetailOpen(false);
    setSelectedBooking(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setFacilityFilter("all");
  };

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button onClick={() => setIsBookingFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalBookings}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Confirmed Today
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.confirmedBookings}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Revenue Today
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${stats.revenue?.total?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Utilization Rate
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.utilizationRate?.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as "calendar" | "list")}
      >
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 px-4 py-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 px-4 py-2"
            >
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
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
                {/* Status Filter */}
                <div className="min-w-[140px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="min-w-[140px]">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Facility Filter */}
                <div className="min-w-[140px]">
                  <Select
                    value={facilityFilter}
                    onValueChange={setFacilityFilter}
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

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="ml-auto"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <BookingCalendar />
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {/* Bulk Actions */}
          {selectedBookings.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedBookings.length} booking(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Selected
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookings Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">
                    No bookings found
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Get started by creating your first booking.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsBookingFormOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Booking
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedBookings.length === bookings.length}
                          onCheckedChange={selectAllBookings}
                        />
                      </TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const statusConfig =
                        BOOKING_STATUS_CONFIG[booking.status];
                      const typeConfig = BOOKING_TYPE_CONFIG[booking.type];

                      return (
                        <TableRow
                          key={booking.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openBookingDetail(booking)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedBookings.includes(booking.id)}
                              onCheckedChange={() =>
                                toggleBookingSelection(booking.id)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {typeIcons[booking.type] &&
                                    React.createElement(
                                      typeIcons[booking.type],
                                      { className: "h-3 w-3 mr-1" }
                                    )}
                                  {typeConfig.label}
                                </Badge>
                                {booking.isRecurring && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Recurring
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {booking.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.customerEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">
                              {booking.facilityName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.participants} participants
                            </p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {format(
                                  new Date(booking.startTime),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(booking.startTime), "h:mm a")}{" "}
                                - {format(new Date(booking.endTime), "h:mm a")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusConfig.variant}
                              className={cn(
                                "flex items-center gap-1 w-fit",
                                statusConfig.className
                              )}
                            >
                              {statusIcons[booking.status] &&
                                React.createElement(
                                  statusIcons[booking.status],
                                  { className: "h-3 w-3" }
                                )}
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">
                              ${booking.totalAmount?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {booking.paymentStatus}
                            </p>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openBookingDetail(booking)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEditBooking(booking)}
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {booking.status === "pending" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm
                                  </DropdownMenuItem>
                                )}
                                {["pending", "confirmed"].includes(
                                  booking.status
                                ) && (
                                  <DropdownMenuItem className="text-destructive">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total
                )}{" "}
                of {pagination.total} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ page: pagination.page - 1 })}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <BookingFormDialog
        isOpen={isBookingFormOpen}
        onClose={handleBookingFormClose}
        booking={editingBooking}
      />

      <BookingDetailDialog
        booking={selectedBooking}
        isOpen={isBookingDetailOpen}
        onClose={handleBookingDetailClose}
        onEdit={openEditBooking}
      />
    </div>
  );
}
