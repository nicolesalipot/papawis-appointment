import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, isAfter, isBefore, addDays, startOfWeek, endOfWeek, addHours, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { getAllBookings } from "@/lib/sampleData";
import type { Booking, BookingStatus } from "@/lib/types/booking";

export function CustomerBookingsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Get sample bookings data
  const allBookings = getAllBookings();
  
  // Filter bookings for current customer (using sample data)
  const customerBookings = allBookings.filter(
    (booking) =>
      booking.customerId === user?.id || booking.customerEmail === user?.email
  );

  // Generate week dates for calendar view
  const getWeekDates = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Start on Sunday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }
    return dates;
  };

  // Get time slots for the calendar (8 AM to 1 PM as shown in the image)
  const timeSlots = [
    { time: "8 AM", hour: 8 },
    { time: "9 AM", hour: 9 },
    { time: "10 AM", hour: 10 },
    { time: "11 AM", hour: 11 },
    { time: "12 PM", hour: 12 },
    { time: "1 PM", hour: 13 },
  ];

  // Get bookings for a specific date and time slot
  const getBookingsForSlot = (date: Date, hour: number) => {
    return customerBookings.filter(booking => {
      const bookingDate = new Date(booking.startTime);
      return (
        bookingDate.toDateString() === date.toDateString() &&
        bookingDate.getHours() === hour
      );
    });
  };

  // Navigate weeks
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Get week range display
  const getWeekRange = () => {
    const weekDates = getWeekDates(currentDate);
    const start = weekDates[0];
    const end = weekDates[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
    } else {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
  };

  // Handle adding a new booking at a specific time slot
  const handleAddBooking = (date: Date, hour: number) => {
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour, 0, 0, 0);
    navigate(`/customer/book?date=${selectedDateTime.toISOString()}`);
  };

  // Handle viewing booking details
  const handleViewBooking = (booking: Booking) => {
    navigate(`/customer/bookings/${booking.id}`);
  };

  // Get status badge styling
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "no_show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render a single time slot cell
  const renderTimeSlotCell = (date: Date, hour: number) => {
    const bookings = getBookingsForSlot(date, hour);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date() || (isToday && hour <= new Date().getHours());
    
    return (
      <div
        key={`${date.toISOString()}-${hour}`}
        className={`
          min-h-[80px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors
          ${isPast ? 'bg-gray-50' : 'bg-white'}
        `}
        onClick={() => !isPast && handleAddBooking(date, hour)}
      >
        {bookings.length > 0 ? (
          <div className="space-y-1">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`
                  p-2 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity
                  ${getStatusBadge(booking.status)}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewBooking(booking);
                }}
              >
                <div className="font-medium truncate">{booking.title}</div>
                <div className="text-xs opacity-75 truncate">{booking.facilityName}</div>
                <div className="flex items-center text-xs opacity-75">
                  <Users className="h-3 w-3 mr-1" />
                  {booking.participants}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isPast && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <Plus className="h-4 w-4 mr-1" />
              Click to add booking
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/customer/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  My Bookings
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your facility reservations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate("/customer/book")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerBookings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-2 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerBookings.filter(booking => {
                      const bookingDate = new Date(booking.startTime);
                      const weekStart = startOfWeek(currentDate);
                      const weekEnd = endOfWeek(currentDate);
                      return bookingDate >= weekStart && bookingDate <= weekEnd;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-2 mr-4">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerBookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 mr-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {customerBookings
                      .reduce((sum, b) => sum + b.totalAmount, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">{getWeekRange()}</h2>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Calendar Header - Days of the Week */}
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-4 bg-gray-50 border-r border-gray-200"></div>
                  {getWeekDates(currentDate).map((date, index) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={index}
                        className={`p-4 text-center border-r border-gray-200 last:border-r-0 
                          ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}
                      >
                        <div className="text-sm font-medium text-gray-600">
                          {format(date, 'EEE')}
                        </div>
                        <div className={`text-lg font-bold mt-1 
                          ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                          {format(date, 'd')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Body - Time Slots */}
                {timeSlots.map(({ time, hour }) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                    <div className="p-4 bg-gray-50 border-r border-gray-200 text-right font-medium text-gray-600">
                      {time}
                    </div>
                    {getWeekDates(currentDate).map((date, index) => 
                      renderTimeSlotCell(date, hour)
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
