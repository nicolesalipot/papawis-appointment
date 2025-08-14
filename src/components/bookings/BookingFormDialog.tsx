import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Clock,
  Users,
  DollarSign,
  User,
  MapPin,
  Save,
  X,
  Calendar,
  Repeat,
  AlertCircle,
} from "lucide-react";
import { format, addDays, startOfDay } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { useUserStore } from "@/store/userStore";
import {
  BookingFormData,
  BookingStatus,
  BookingType,
  RecurrencePattern,
  PaymentStatus,
} from "@/lib/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  facilityId: z.string().min(1, "Please select a facility"),
  customerId: z.string().min(1, "Please select a customer"),
  title: z.string().min(1, "Booking title is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  participants: z.number().min(1, "At least 1 participant is required"),
  type: z.enum(["regular", "recurring", "event", "maintenance", "blocked"]),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]),
  paymentStatus: z.enum(["pending", "paid", "partial", "refunded", "failed"]),
  pricePerHour: z.number().min(0, "Price must be positive"),
  isRecurring: z.boolean(),
  recurrencePattern: z
    .enum(["daily", "weekly", "monthly", "custom"])
    .optional(),
  recurrenceEnd: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: BookingFormData | null;
  selectedDate?: Date;
  selectedFacilityId?: string;
}

export function BookingFormDialog({
  isOpen,
  onClose,
  booking,
  selectedDate,
  selectedFacilityId,
}: BookingFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const {
    createBooking,
    updateBooking,
    checkAvailability,
    isLoading: isBookingLoading,
  } = useBookingStore();
  const { facilities } = useFacilityStore();
  const { users } = useUserStore();

  const isEdit = !!booking;
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      facilityId: selectedFacilityId || "",
      customerId: "",
      title: "",
      description: "",
      startTime: selectedDate
        ? format(selectedDate, "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endTime: selectedDate
        ? format(addDays(selectedDate, 0), "yyyy-MM-dd'T'HH:mm")
        : format(addDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm"),
      participants: 1,
      type: "regular" as BookingType,
      status: "pending" as BookingStatus,
      paymentStatus: "pending" as PaymentStatus,
      pricePerHour: 0,
      isRecurring: false,
      notes: "",
    },
    mode: "onChange",
  });

  // Watch form values for real-time updates
  const watchedValues = watch();
  const selectedFacility = facilities.find(
    (f) => f.id === watchedValues.facilityId
  );

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Populate form with booking data for editing
        Object.entries(booking).forEach(([key, value]) => {
          setValue(key as keyof BookingFormValues, value);
        });
      }
    }
  }, [isOpen, booking, setValue]);

  useEffect(() => {
    // Set default price when facility is selected
    if (selectedFacility) {
      setValue("pricePerHour", selectedFacility.pricePerHour);
    }
  }, [selectedFacility, setValue]);

  useEffect(() => {
    // Check availability when date/time/facility changes
    if (
      watchedValues.facilityId &&
      watchedValues.startTime &&
      watchedValues.endTime
    ) {
      checkBookingAvailability();
    }
  }, [
    watchedValues.facilityId,
    watchedValues.startTime,
    watchedValues.endTime,
  ]);

  const checkBookingAvailability = async () => {
    if (
      !watchedValues.facilityId ||
      !watchedValues.startTime ||
      !watchedValues.endTime
    )
      return;

    setIsCheckingAvailability(true);
    setConflictMessage(null);

    try {
      const validation = await checkAvailability(
        watchedValues.facilityId,
        watchedValues.startTime,
        watchedValues.endTime,
        isEdit ? booking?.id : undefined
      );

      if (!validation.isValid) {
        setConflictMessage(
          validation.conflicts[0]?.message || "Time slot not available"
        );
      }
    } catch (error) {
      setConflictMessage("Error checking availability");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    try {
      // Calculate total amount
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      const durationHours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const totalAmount = durationHours * data.pricePerHour;

      const bookingData: BookingFormData = {
        ...data,
        totalAmount,
        duration: Math.round(durationHours * 60), // Convert to minutes
        customerName:
          users.find((u) => u.id === data.customerId)?.firstName +
            " " +
            users.find((u) => u.id === data.customerId)?.lastName || "",
        customerEmail: users.find((u) => u.id === data.customerId)?.email || "",
        customerPhone: users.find((u) => u.id === data.customerId)?.phone,
        facilityName: selectedFacility?.name || "",
      };

      if (isEdit && booking) {
        await updateBooking(booking.id, bookingData);
      } else {
        await createBooking(bookingData);
      }

      onClose();
      reset();
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setCurrentStep(1);
    setConflictMessage(null);
  };

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepFields = (step: number): (keyof BookingFormValues)[] => {
    switch (step) {
      case 1:
        return ["facilityId", "customerId"];
      case 2:
        return ["title", "startTime", "endTime", "participants"];
      case 3:
        return ["type", "status", "pricePerHour"];
      case 4:
        return ["paymentStatus"];
      default:
        return [];
    }
  };

  const steps = [
    { id: 1, title: "Facility & Customer", icon: MapPin },
    { id: 2, title: "Date & Time", icon: Calendar },
    { id: 3, title: "Booking Details", icon: Users },
    { id: 4, title: "Payment & Notes", icon: DollarSign },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? "Edit Booking" : "Create New Booking"}
          </DialogTitle>
          <p className="text-muted-foreground mt-1">
            Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center",
                    index < steps.length - 1 && "flex-1"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                      isCompleted &&
                        "bg-primary border-primary text-primary-foreground",
                      isActive && !isCompleted && "border-primary text-primary",
                      !isActive &&
                        !isCompleted &&
                        "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-4 transition-colors",
                        currentStep > step.id
                          ? "bg-primary"
                          : "bg-muted-foreground/30"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Facility & Customer */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Select Facility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={watchedValues.facilityId}
                      onValueChange={(value) => setValue("facilityId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{facility.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                ${facility.pricePerHour}/hr
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.facilityId && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.facilityId.message}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Select Customer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={watchedValues.customerId}
                      onValueChange={(value) => setValue("customerId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((user) => user.role === "customer")
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex flex-col">
                                <span>
                                  {user.firstName} {user.lastName}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.customerId && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.customerId.message}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Booking Title</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Enter booking title"
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Add any additional details"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          {...register("startTime")}
                        />
                        {errors.startTime && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.startTime.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="datetime-local"
                          {...register("endTime")}
                        />
                        {errors.endTime && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.endTime.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="participants">
                        Number of Participants
                      </Label>
                      <Input
                        id="participants"
                        type="number"
                        min="1"
                        {...register("participants", { valueAsNumber: true })}
                      />
                      {errors.participants && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.participants.message}
                        </p>
                      )}
                    </div>

                    {/* Availability Check */}
                    {(isCheckingAvailability || conflictMessage) && (
                      <Alert
                        variant={conflictMessage ? "destructive" : "default"}
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {isCheckingAvailability
                            ? "Checking availability..."
                            : conflictMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Booking Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Booking Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Booking Type</Label>
                        <Select
                          value={watchedValues.type}
                          onValueChange={(value) =>
                            setValue("type", value as BookingType)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">
                              Regular Booking
                            </SelectItem>
                            <SelectItem value="recurring">
                              Recurring Booking
                            </SelectItem>
                            <SelectItem value="event">Special Event</SelectItem>
                            <SelectItem value="maintenance">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="blocked">
                              Blocked Time
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={watchedValues.status}
                          onValueChange={(value) =>
                            setValue("status", value as BookingStatus)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pricePerHour">Price per Hour ($)</Label>
                      <Input
                        id="pricePerHour"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("pricePerHour", { valueAsNumber: true })}
                      />
                      {errors.pricePerHour && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.pricePerHour.message}
                        </p>
                      )}
                    </div>

                    {/* Recurring Options */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isRecurring"
                          checked={watchedValues.isRecurring}
                          onCheckedChange={(checked) =>
                            setValue("isRecurring", !!checked)
                          }
                        />
                        <Label htmlFor="isRecurring">
                          Make this a recurring booking
                        </Label>
                      </div>

                      {watchedValues.isRecurring && (
                        <div className="pl-6 space-y-4">
                          <div>
                            <Label htmlFor="recurrencePattern">
                              Repeat Pattern
                            </Label>
                            <Select
                              value={watchedValues.recurrencePattern}
                              onValueChange={(value) =>
                                setValue(
                                  "recurrencePattern",
                                  value as RecurrencePattern
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select pattern" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="recurrenceEnd">End Date</Label>
                            <Input
                              id="recurrenceEnd"
                              type="date"
                              {...register("recurrenceEnd")}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Payment & Notes */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Payment & Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select
                        value={watchedValues.paymentStatus}
                        onValueChange={(value) =>
                          setValue("paymentStatus", value as PaymentStatus)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="partial">
                            Partially Paid
                          </SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cost Summary */}
                    {watchedValues.startTime &&
                      watchedValues.endTime &&
                      watchedValues.pricePerHour && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Cost Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {(() => {
                              const startTime = new Date(
                                watchedValues.startTime
                              );
                              const endTime = new Date(watchedValues.endTime);
                              const durationHours =
                                (endTime.getTime() - startTime.getTime()) /
                                (1000 * 60 * 60);
                              const totalAmount =
                                durationHours * watchedValues.pricePerHour;

                              return (
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span>
                                      {durationHours.toFixed(1)} hours
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Rate:</span>
                                    <span>
                                      ${watchedValues.pricePerHour}/hour
                                    </span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      )}

                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        {...register("notes")}
                        placeholder="Any special requirements or notes"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="flex justify-between p-6 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={conflictMessage !== null}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={
                    !isValid || isBookingLoading || conflictMessage !== null
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isBookingLoading
                    ? "Saving..."
                    : isEdit
                    ? "Update Booking"
                    : "Create Booking"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
