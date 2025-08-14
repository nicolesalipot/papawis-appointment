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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Activity,
  Plus,
  Settings,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import type { Booking } from "@/lib/types/booking";

export function CustomerDashboardPage() {
  const { user, logout } = useAuthStore();
  const { bookings, cancelBooking, isLoading } = useBookingStore();
  const { facilities } = useFacilityStore();
  const navigate = useNavigate();

  // Filter bookings for current customer
  const customerBookings = bookings.filter(
    (booking) =>
      booking.customerId === user?.id || booking.customerEmail === user?.email
  );

  // Categorize bookings
  const upcomingBookings = customerBookings
    .filter(
      (booking) =>
        isAfter(new Date(booking.startTime), new Date()) &&
        booking.status !== "cancelled"
    )
    .slice(0, 3);

  const recentBookings = customerBookings
    .filter((booking) => isBefore(new Date(booking.startTime), new Date()))
    .slice(0, 3);

  const pendingBookings = customerBookings.filter(
    (booking) => booking.status === "pending"
  );

  // Calculate stats
  const totalBookings = customerBookings.length;
  const confirmedBookings = customerBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const totalSpent = customerBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const monthlyBookings = customerBookings.filter((booking) =>
    isAfter(new Date(booking.startTime), addDays(new Date(), -30))
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId, "Customer cancellation");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-black rounded-lg p-2">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back, {user?.firstName || "Customer"}!
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your bookings and discover new facilities
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate("/customer/book")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Now
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/customer/profile")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-2 mr-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBookings}
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
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {confirmedBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 mr-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-lg p-2 mr-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      Upcoming Bookings
                    </CardTitle>
                    <CardDescription>
                      Your next scheduled activities
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/customer/bookings")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {booking.title}
                            </h4>
                            <Badge
                              className={`${getStatusColor(
                                booking.status
                              )} border-none`}
                            >
                              <div className="flex items-center">
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">
                                  {booking.status}
                                </span>
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {booking.facilityName}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(
                                new Date(booking.startTime),
                                "MMM dd, yyyy at h:mm a"
                              )}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {booking.participants} participant
                              {booking.participants !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/customer/bookings/${booking.id}`)
                            }
                          >
                            View
                          </Button>
                          {booking.status === "pending" ||
                          booking.status === "confirmed" ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                                >
                                  Cancel
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Booking
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this
                                    booking? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep Booking
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Cancel Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No upcoming bookings
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Book your favorite facility to get started!
                    </p>
                    <Button
                      onClick={() => navigate("/customer/book")}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-black hover:bg-gray-800 text-white"
                  onClick={() => navigate("/customer/book")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book a Facility
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/customer/bookings")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Bookings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/customer/facilities")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Browse Facilities
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/customer/profile")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            {pendingBookings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-600">
                    Pending Actions
                  </CardTitle>
                  <CardDescription>
                    Bookings that need your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div>
                          <p className="font-medium text-sm">{booking.title}</p>
                          <p className="text-xs text-gray-600">
                            {booking.facilityName}
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-none">
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your booking history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length > 0 ? (
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {booking.facilityName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(
                              new Date(booking.startTime),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            booking.status
                          )} border-none text-xs`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
