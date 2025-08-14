import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ArrowLeft,
  Eye,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  LogOut,
  FileText,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import {
  BOOKING_STATUS_CONFIG,
  BOOKING_TYPE_CONFIG,
} from "@/lib/types/booking";

export function CustomerBookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { bookings, isLoading, cancelBooking } = useBookingStore();

  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Find the booking by ID
  const booking = bookings.find((b) => b.id === bookingId);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided");
      return;
    }

    // If we don't have the booking loaded, you might want to fetch it here
    if (!booking && !isLoading) {
      setError("Booking not found");
    }
  }, [bookingId, booking, isLoading]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    setIsActionLoading(true);
    try {
      await cancelBooking(booking.id, "Cancelled by customer");
      // Optionally redirect back to bookings list
      navigate("/customer/bookings");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/customer/bookings")}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bookings
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Booking Details
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/customer/bookings")}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bookings
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Booking Details
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error ||
                "Booking not found. It may have been deleted or you don't have permission to view it."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const typeConfig = BOOKING_TYPE_CONFIG[booking.type];
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const duration = Math.round((booking.duration / 60) * 10) / 10;

  const canCancel = ["pending", "confirmed"].includes(booking.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/customer/bookings")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Booking Details
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Booking Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{booking.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.facility?.name}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={statusConfig.variant as any}
                    className="flex items-center gap-1"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {typeConfig.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">
                        {format(startDate, "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">
                        {format(startDate, "h:mm a")} -{" "}
                        {format(endDate, "h:mm a")}
                        <span className="text-sm text-gray-500 ml-1">
                          ({duration} hours)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Participants & Cost */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-gray-600">
                        {booking.participantCount} people
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Total Cost</p>
                      <p className="text-gray-600 font-medium">
                        ${booking.totalCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {booking.description && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-gray-600 mt-1">
                        {booking.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="mt-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Special Requests</p>
                      <p className="text-gray-600 mt-1">
                        {booking.specialRequests}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-gray-600">
                      {booking.customer?.firstName} {booking.customer?.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{booking.customer?.email}</p>
                  </div>
                </div>
                {booking.customer?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">{booking.customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {canCancel && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button
                    variant="destructive"
                    onClick={handleCancelBooking}
                    disabled={isActionLoading}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isActionLoading ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
