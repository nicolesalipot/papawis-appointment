import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Wifi,
  Car,
  Accessibility,
  Coffee,
  LogOut,
} from "lucide-react";
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { BookingCalendar } from "@/components/calendar/BookingCalendar";
import type { Facility } from "@/lib/types/facility";
import type { TimeSlot } from "@/lib/types/booking";

interface BookingStep {
  id: number;
  title: string;
  description: string;
}

const steps: BookingStep[] = [
  {
    id: 1,
    title: "Select Facility",
    description: "Choose your preferred facility",
  },
  {
    id: 2,
    title: "Pick Date & Time",
    description: "Select available time slots",
  },
  {
    id: 3,
    title: "Booking Details",
    description: "Add participants and preferences",
  },
  {
    id: 4,
    title: "Confirmation",
    description: "Review and confirm your booking",
  },
];

export function CustomerBookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [bookingData, setBookingData] = useState({
    participants: 1,
    title: "",
    description: "",
    specialRequests: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  const { user, logout } = useAuthStore();
  const { createBooking, checkAvailability } = useBookingStore();
  const { facilities, fetchFacilities } = useFacilityStore();
  const navigate = useNavigate();

  // Initialize facilities when component mounts
  useEffect(() => {
    if (facilities.length === 0) {
      fetchFacilities();
    }
  }, [facilities.length, fetchFacilities]);

  // Filter facilities based on search and filter
  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      facilityFilter === "all" || facility.type === facilityFilter;

    return matchesSearch && matchesFilter;
  });

  // Generate available time slots when facility and date are selected
  useEffect(() => {
    if (selectedFacility && selectedDate) {
      generateAvailableSlots();
    }
  }, [selectedFacility, selectedDate]);

  const generateAvailableSlots = async () => {
    if (!selectedFacility) return;

    setIsLoading(true);
    try {
      // Get facility's operating hours
      const operatingHours = selectedFacility.operatingHours;
      const dayOfWeek = selectedDate.getDay();
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayName = dayNames[dayOfWeek];

      const dayHours = operatingHours[dayName as keyof typeof operatingHours];

      if (!dayHours || dayHours.closed) {
        setAvailableSlots([]);
        setError("This facility is closed on the selected date.");
        return;
      }

      // Generate time slots for the day
      const slots: TimeSlot[] = [];
      const startTime = new Date(
        `${format(selectedDate, "yyyy-MM-dd")}T${dayHours.open}`
      );
      const endTime = new Date(
        `${format(selectedDate, "yyyy-MM-dd")}T${dayHours.close}`
      );

      let currentSlot = new Date(startTime);

      while (currentSlot < endTime) {
        const slotEnd = new Date(currentSlot.getTime() + 60 * 60 * 1000); // 1 hour slots

        if (slotEnd <= endTime) {
          // Check availability for this slot
          const availability = await checkAvailability(
            selectedFacility.id,
            currentSlot.toISOString(),
            slotEnd.toISOString()
          );

          slots.push({
            id: `${selectedFacility.id}-${currentSlot.toISOString()}`,
            facilityId: selectedFacility.id,
            startTime: currentSlot.toISOString(),
            endTime: slotEnd.toISOString(),
            capacity: selectedFacility.capacity,
            availableSpots: availability.availableSpots,
            pricePerHour: selectedFacility.pricePerHour || 50,
            isAvailable: availability.isAvailable,
            isBlocked: false,
          });
        }

        currentSlot = new Date(currentSlot.getTime() + 60 * 60 * 1000);
      }

      setAvailableSlots(slots);
      setError(null);
    } catch (err) {
      setError("Failed to load available time slots. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    setSelectedTimeSlot(null);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setCurrentStep(3);
  };

  const handleBookingSubmit = async () => {
    if (!selectedFacility || !selectedTimeSlot || !user) {
      setError("Missing required booking information.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const booking = {
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        customerId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        title: bookingData.title || `${selectedFacility.name} Booking`,
        description: bookingData.description,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        participants: bookingData.participants,
        totalAmount: selectedTimeSlot.pricePerHour,
        status: "pending" as const,
        type: "regular" as const,
        paymentStatus: "pending" as const,
        isRecurring: false,
        specialRequests: bookingData.specialRequests,
        source: "customer" as const,
      };

      const result = await createBooking(booking);

      if (result) {
        setIsBookingComplete(true);
        setCurrentStep(4);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/customer/dashboard");
        }, 3000);
      } else {
        setError("Failed to create booking. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "accessibility":
        return <Accessibility className="h-4 w-4" />;
      case "cafe":
      case "restaurant":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Booking Confirmed!
            </CardTitle>
            <CardDescription>
              Your booking has been successfully submitted and is pending
              confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Facility:</span>
                <span>{selectedFacility?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date & Time:</span>
                <span>
                  {selectedTimeSlot &&
                    format(
                      new Date(selectedTimeSlot.startTime),
                      "MMM dd, yyyy at h:mm a"
                    )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Participants:</span>
                <span>{bookingData.participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span>${selectedTimeSlot?.pricePerHour.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                You will receive a confirmation email once your booking is
                approved.
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">
                Redirecting to your dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  Book a Facility
                </h1>
                <p className="text-sm text-gray-500">
                  Find and reserve your perfect sports facility
                </p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    // Allow manual navigation for testing (only to completed/accessible steps)
                    if (step.id === 1) {
                      setCurrentStep(1);
                    } else if (step.id === 2 && selectedFacility) {
                      setCurrentStep(2);
                    } else if (
                      step.id === 3 &&
                      selectedFacility &&
                      selectedTimeSlot
                    ) {
                      setCurrentStep(3);
                    }
                  }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                      : "border-gray-300 text-gray-500 hover:border-gray-400"
                  } ${
                    step.id === 1 ||
                    (step.id === 2 && selectedFacility) ||
                    (step.id === 3 && selectedFacility && selectedTimeSlot)
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={
                    !(
                      step.id === 1 ||
                      (step.id === 2 && selectedFacility) ||
                      (step.id === 3 && selectedFacility && selectedTimeSlot)
                    )
                  }
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </button>
                <div className="ml-4">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-8 ${
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Debug Info</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>Current Step: {currentStep}</p>
                <p>Selected Facility: {selectedFacility?.name || "None"}</p>
                <p>
                  Selected Time Slot:{" "}
                  {selectedTimeSlot
                    ? format(
                        new Date(selectedTimeSlot.startTime),
                        "MMM dd, h:mm a"
                      )
                    : "None"}
                </p>
                <p>Available Facilities: {facilities.length}</p>
                <p>Available Slots: {availableSlots.length}</p>
                <p>
                  Step 3 Should Render:{" "}
                  {currentStep === 3 && selectedFacility && selectedTimeSlot
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Select Facility */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Find Your Perfect Facility</CardTitle>
                <CardDescription>
                  Search and filter from our available sports facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search facilities, locations, or amenities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={facilityFilter}
                    onValueChange={setFacilityFilter}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="court">Courts</SelectItem>
                      <SelectItem value="field">Fields</SelectItem>
                      <SelectItem value="gym">Gyms</SelectItem>
                      <SelectItem value="pool">Pools</SelectItem>
                      <SelectItem value="track">Tracks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Facilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Card
                  key={facility.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleFacilitySelect(facility)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {facility.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {facility.location}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {facility.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {facility.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Capacity: {facility.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                          <span>${facility.pricePerHour || 50}/hour</span>
                        </div>
                      </div>

                      {facility.amenities && facility.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {facility.amenities
                            .slice(0, 3)
                            .map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1"
                              >
                                {getAmenityIcon(amenity)}
                                <span className="ml-1 capitalize">
                                  {amenity}
                                </span>
                              </div>
                            ))}
                          {facility.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{facility.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white">
                      Select Facility
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFacilities.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No facilities found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Pick Date & Time */}
        {currentStep === 2 && selectedFacility && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>
                      Choose when you'd like to book {selectedFacility.name}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Facility
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Selected Facility:</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-900">
                          {selectedFacility.name}
                        </h3>
                        <p className="text-sm text-blue-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedFacility.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-700">
                          <Users className="h-4 w-4 inline mr-1" />
                          Capacity: {selectedFacility.capacity}
                        </p>
                        <p className="text-sm text-blue-700">
                          <DollarSign className="h-4 w-4 inline mr-1" />$
                          {selectedFacility.pricePerHour || 50}/hour
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Date Picker */}
                  <div>
                    <h4 className="font-medium mb-4">Select Date</h4>
                    <div className="border rounded-lg p-4">
                      <BookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        facilityId={selectedFacility.id}
                        mode="date-selection"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 className="font-medium mb-4">
                      Available Time Slots -{" "}
                      {format(selectedDate, "MMM dd, yyyy")}
                    </h4>
                    {isLoading ? (
                      <div className="space-y-2">
                        {[...Array(6)].map((_, index) => (
                          <div
                            key={index}
                            className="w-full p-3 rounded-lg border"
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <div className="text-right space-y-1">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-3 w-12" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => handleTimeSlotSelect(slot)}
                              disabled={!slot.isAvailable}
                              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                                slot.isAvailable
                                  ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                  : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {format(new Date(slot.startTime), "h:mm a")}{" "}
                                    - {format(new Date(slot.endTime), "h:mm a")}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {slot.availableSpots} of {slot.capacity}{" "}
                                    spots available
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    ${slot.pricePerHour}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    per hour
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No available slots
                            </h3>
                            <p className="text-gray-600">
                              This facility has no available time slots for the
                              selected date.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Booking Details */}
        {currentStep === 3 && selectedFacility && selectedTimeSlot && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>
                      Add participants and any special requests
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Time
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Booking Summary */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Booking Summary:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Facility:</span>
                      <span>{selectedFacility.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date & Time:</span>
                      <span>
                        {format(
                          new Date(selectedTimeSlot.startTime),
                          "MMM dd, yyyy at h:mm a"
                        )}{" "}
                        - {format(new Date(selectedTimeSlot.endTime), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rate:</span>
                      <span>${selectedTimeSlot.pricePerHour}/hour</span>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="participants">
                        Number of Participants
                      </Label>
                      {process.env.NODE_ENV === "development" && (
                        <p className="text-xs text-gray-500 mb-2">
                          Debug: Facility capacity = {selectedFacility.capacity}
                          , Max options ={" "}
                          {Math.min(selectedFacility.capacity, 20)}
                        </p>
                      )}
                      <div className="space-y-2">
                        <Select
                          value={bookingData.participants.toString()}
                          onValueChange={(value) => {
                            console.log("Participant count changed to:", value);
                            setBookingData({
                              ...bookingData,
                              participants: parseInt(value),
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of participants" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              {
                                length: Math.min(
                                  selectedFacility.capacity || 10,
                                  20
                                ),
                              },
                              (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1} participant{i > 0 ? "s" : ""}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>

                        {/* Alternative input if Select doesn't work */}
                        <div className="text-xs text-gray-500">
                          Or enter manually:
                          <Input
                            type="number"
                            min="1"
                            max={selectedFacility.capacity || 10}
                            value={bookingData.participants}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const maxValue = selectedFacility.capacity || 10;
                              const clampedValue = Math.min(
                                Math.max(value, 1),
                                maxValue
                              );
                              setBookingData({
                                ...bookingData,
                                participants: clampedValue,
                              });
                            }}
                            className="w-20 h-8 text-xs mt-1"
                            placeholder="1"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum capacity: {selectedFacility.capacity || 10}{" "}
                        participants
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="title">Booking Title (Optional)</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Basketball Practice, Team Meeting"
                        value={bookingData.title}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your activity..."
                        value={bookingData.description}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="specialRequests">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="specialRequests"
                        placeholder="Any special equipment, setup requirements, or accessibility needs..."
                        value={bookingData.specialRequests}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            specialRequests: e.target.value,
                          })
                        }
                        rows={6}
                      />
                    </div>

                    {/* Total Cost */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Total Cost
                      </h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <div className="flex justify-between">
                          <span>Base Rate (1 hour):</span>
                          <span>
                            ${selectedTimeSlot.pricePerHour.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            Participants ({bookingData.participants}):
                          </span>
                          <span>Included</span>
                        </div>
                        <div className="border-t border-blue-200 pt-1 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>
                              ${selectedTimeSlot.pricePerHour.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleBookingSubmit}
                    disabled={isLoading}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Booking...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Confirm Booking
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
