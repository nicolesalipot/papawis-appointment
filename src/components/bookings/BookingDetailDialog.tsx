import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreVertical,
  Repeat,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import {
  Booking,
  BOOKING_STATUS_CONFIG,
  BOOKING_TYPE_CONFIG,
} from "@/lib/types/booking";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface BookingDetailDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (booking: Booking) => void;
}

export function BookingDetailDialog({
  booking,
  isOpen,
  onClose,
  onEdit,
}: BookingDetailDialogProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    confirmBooking,
    cancelBooking,
    completeBooking,
    deleteBooking,
    isLoading,
  } = useBookingStore();

  if (!booking) return null;

  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const typeConfig = BOOKING_TYPE_CONFIG[booking.type];

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const duration = Math.round((booking.duration / 60) * 10) / 10; // Convert to hours with 1 decimal

  const handleConfirm = async () => {
    try {
      await confirmBooking(booking.id);
      onClose();
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id, "Cancelled by admin");
      setShowCancelDialog(false);
      onClose();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeBooking(booking.id);
      onClose();
    } catch (error) {
      console.error("Failed to complete booking:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(booking.id);
      setShowDeleteDialog(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const canConfirm = booking.status === "pending";
  const canCancel = ["pending", "confirmed"].includes(booking.status);
  const canComplete = booking.status === "confirmed" && new Date() > endDate;
  const canEdit = !["completed", "cancelled"].includes(booking.status);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {booking.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={statusConfig.variant}
                    className={cn(
                      "flex items-center gap-1",
                      statusConfig.className
                    )}
                  >
                    <statusConfig.icon className="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <typeConfig.icon className="h-3 w-3" />
                    {typeConfig.label}
                  </Badge>
                  {booking.isRecurring && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Repeat className="h-3 w-3" />
                      Recurring
                    </Badge>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canEdit && onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(booking)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Booking
                    </DropdownMenuItem>
                  )}

                  {canConfirm && (
                    <DropdownMenuItem
                      onClick={handleConfirm}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </DropdownMenuItem>
                  )}

                  {canComplete && (
                    <DropdownMenuItem
                      onClick={handleComplete}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}

                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowCancelDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Booking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto space-y-6">
            {/* Booking Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(startDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(startDate, "h:mm a")} -{" "}
                        {format(endDate, "h:mm a")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {duration} hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Facility & Participants */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Facility Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{booking.facilityName}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {booking.participants} participants
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">Customer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.customerEmail}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>

                  {booking.customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{booking.customerPhone}</p>
                        <p className="text-sm text-muted-foreground">Phone</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-medium">${booking.pricePerHour}/hour</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{duration} hours</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="font-medium text-lg">
                      ${booking.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Status
                    </p>
                    <Badge
                      variant={
                        booking.paymentStatus === "paid"
                          ? "default"
                          : booking.paymentStatus === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="flex items-center gap-1 w-fit"
                    >
                      <CreditCard className="h-3 w-3" />
                      {booking.paymentStatus.charAt(0).toUpperCase() +
                        booking.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recurring Information */}
            {booking.isRecurring && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5" />
                    Recurring Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Pattern</p>
                      <p className="font-medium capitalize">
                        {booking.recurrencePattern}
                      </p>
                    </div>

                    {booking.recurrenceEnd && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          End Date
                        </p>
                        <p className="font-medium">
                          {format(
                            new Date(booking.recurrenceEnd),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    )}

                    {booking.parentBookingId && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Part of Series
                        </p>
                        <p className="font-medium">Recurring Series</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description & Notes */}
            {(booking.description ||
              booking.notes ||
              booking.cancellationReason) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-sm">{booking.description}</p>
                    </div>
                  )}

                  {booking.notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Notes
                      </p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  {booking.cancellationReason && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Cancellation Reason
                      </p>
                      <p className="text-sm text-destructive">
                        {booking.cancellationReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Booking History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium">Created</p>
                    <p>
                      {format(
                        new Date(booking.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                    <p>by {booking.createdBy}</p>
                  </div>

                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p>
                      {format(
                        new Date(booking.updatedAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                    <p>by {booking.updatedBy}</p>
                  </div>

                  {booking.confirmedAt && (
                    <div>
                      <p className="font-medium">Confirmed</p>
                      <p>
                        {format(
                          new Date(booking.confirmedAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                      <p>by {booking.confirmedBy}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone. The customer will be notified of the cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Cancelling..." : "Yes, Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this booking? This
              action cannot be undone. All booking data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
