import { useState, useEffect } from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Search,
  RefreshCw,
} from "lucide-react";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { TimeSlot, BookingValidation } from "@/lib/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AvailabilityCheckerProps {
  onSlotSelect?: (slot: TimeSlot) => void;
  facilityId?: string;
  minDuration?: number; // in minutes
  participantCount?: number;
}

export function AvailabilityChecker({
  onSlotSelect,
  facilityId: initialFacilityId,
  minDuration = 60,
  participantCount = 1,
}: AvailabilityCheckerProps) {
  const {
    fetchFacilityAvailability,
    checkAvailability,
    facilityAvailability,
    isLoading,
  } = useBookingStore();
  const { facilities } = useFacilityStore();

  const [selectedFacilityId, setSelectedFacilityId] = useState(
    initialFacilityId || ""
  );
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [duration, setDuration] = useState(minDuration);
  const [participants, setParticipants] = useState(participantCount);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [conflictCheck, setConflictCheck] = useState<BookingValidation | null>(
    null
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  useEffect(() => {}, []);

  useEffect(() => {
    if (selectedFacilityId && selectedDate) {
      loadAvailability();
    }
  }, [selectedFacilityId, selectedDate]);

  useEffect(() => {
    if (availableSlots.length > 0) {
      filterSlotsByDuration();
    }
  }, [duration, participants, availableSlots]);

  const loadAvailability = async () => {
    if (!selectedFacilityId || !selectedDate) return;

    try {
      const endDate = format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd");
      await fetchFacilityAvailability(
        selectedFacilityId,
        selectedDate,
        endDate
      );

      const availability = facilityAvailability[selectedFacilityId];
      if (availability && availability.length > 0) {
        const dayAvailability = availability.find(
          (a) => a.date === selectedDate
        );
        if (dayAvailability) {
          setAvailableSlots(dayAvailability.timeSlots || []);
        }
      }
    } catch (error) {
      console.error("Failed to load availability:", error);
    }
  };

  const filterSlotsByDuration = () => {
    if (!availableSlots.length) return;

    const filtered = availableSlots.filter((slot) => {
      const slotDuration =
        (new Date(slot.endTime).getTime() -
          new Date(slot.startTime).getTime()) /
        (1000 * 60);
      const hasCapacity = slot.availableSpots >= participants;
      const meetsMinDuration = slotDuration >= duration;

      return (
        slot.isAvailable && !slot.isBlocked && hasCapacity && meetsMinDuration
      );
    });

    setAvailableSlots(filtered);
  };

  const handleSlotSelection = async (slot: TimeSlot) => {
    setSelectedSlot(slot);

    // Check for conflicts
    try {
      const endTime = new Date(
        new Date(slot.startTime).getTime() + duration * 60000
      ).toISOString();
      const validation = await checkAvailability(
        selectedFacilityId,
        slot.startTime,
        endTime
      );
      setConflictCheck(validation);

      if (validation.isValid && onSlotSelect) {
        onSlotSelect({
          ...slot,
          endTime, // Override with requested duration
        });
      }
    } catch (error) {
      console.error("Failed to check availability:", error);
    }
  };

  const getTimeSlotUtilization = (slot: TimeSlot) => {
    const utilizationPercent =
      ((slot.capacity - slot.availableSpots) / slot.capacity) * 100;
    return Math.max(0, Math.min(100, utilizationPercent));
  };

  const getAvailabilityStatus = (slot: TimeSlot) => {
    if (slot.isBlocked)
      return { status: "blocked", label: "Blocked", color: "destructive" };
    if (!slot.isAvailable)
      return {
        status: "unavailable",
        label: "Unavailable",
        color: "secondary",
      };
    if (slot.availableSpots === 0)
      return { status: "full", label: "Fully Booked", color: "secondary" };
    if (slot.availableSpots < slot.capacity * 0.3)
      return { status: "limited", label: "Limited Spots", color: "secondary" };
    return { status: "available", label: "Available", color: "default" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground">
          Check Availability
        </h3>
        <p className="text-muted-foreground">
          Find available time slots for your booking requirements.
        </p>
      </div>

      {/* Search Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facility">Facility</Label>
              <Select
                value={selectedFacilityId}
                onValueChange={setSelectedFacilityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select
                value={duration.toString()}
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max={selectedFacility?.capacity || 50}
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={loadAvailability}
              disabled={!selectedFacilityId || !selectedDate}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Availability
            </Button>

            {selectedFacility && (
              <div className="text-sm text-muted-foreground">
                Facility capacity: {selectedFacility.capacity} people
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Check Results */}
      {conflictCheck && selectedSlot && (
        <Alert variant={conflictCheck.isValid ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {conflictCheck.isValid ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Time slot is available for your booking!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span>Conflicts detected:</span>
                </div>
                <ul className="space-y-1">
                  {conflictCheck.conflicts.map((conflict, index) => (
                    <li key={index} className="text-sm">
                      • {conflict.message}
                    </li>
                  ))}
                </ul>
                {conflictCheck.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Suggestions:</p>
                    <ul className="space-y-1">
                      {conflictCheck.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Available Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Available Time Slots
          </CardTitle>
          <CardDescription>
            {selectedDate &&
              format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !selectedFacilityId || !selectedDate ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select a facility and date to check availability.
              </p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                No available slots
              </h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your criteria or selecting a different date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableSlots
                .sort(
                  (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
                )
                .map((slot) => {
                  const status = getAvailabilityStatus(slot);
                  const utilization = getTimeSlotUtilization(slot);
                  const isSelected = selectedSlot?.id === slot.id;

                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => handleSlotSelection(slot)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-foreground">
                                {format(new Date(slot.startTime), "h:mm a")} -{" "}
                                {format(new Date(slot.endTime), "h:mm a")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {(new Date(slot.endTime).getTime() -
                                  new Date(slot.startTime).getTime()) /
                                  (1000 * 60)}{" "}
                                minutes
                              </p>
                            </div>

                            <Badge variant={status.color as any}>
                              {status.label}
                            </Badge>

                            {slot.isBlocked && slot.blockReason && (
                              <div className="text-xs text-muted-foreground">
                                {slot.blockReason}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                {slot.availableSpots}/{slot.capacity} available
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <span>${slot.pricePerHour}/hour</span>
                            </div>

                            {utilization > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {utilization.toFixed(0)}% booked
                                </span>
                                <Progress
                                  value={utilization}
                                  className="w-20 h-2"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
