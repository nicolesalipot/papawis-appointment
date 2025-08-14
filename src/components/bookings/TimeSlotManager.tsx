import { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  Settings,
  AlertCircle,
  Check,
  Copy,
} from "lucide-react";
import { format, addMinutes, parse } from "date-fns";
import { useFacilityStore } from "@/store/facilityStore";
import { useBookingStore } from "@/store/bookingStore";
import { TimeSlot } from "@/lib/types/booking";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TimeSlotManagerProps {
  facilityId?: string;
  selectedDate?: Date;
}

interface TimeSlotForm {
  startTime: string;
  endTime: string;
  capacity: number;
  pricePerHour: number;
  isRecurring: boolean;
  recurringDays: string[];
  isBlocked: boolean;
  blockReason?: string;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const TIME_INTERVALS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
];

export function TimeSlotManager({
  facilityId,
  selectedDate,
}: TimeSlotManagerProps) {
  const { facilities } = useFacilityStore();
  const { fetchFacilityAvailability, facilityAvailability, isLoading } =
    useBookingStore();

  const [selectedFacilityId, setSelectedFacilityId] = useState(
    facilityId || ""
  );
  const [currentDate, setCurrentDate] = useState(
    selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotForm, setSlotForm] = useState<TimeSlotForm>({
    startTime: "09:00",
    endTime: "10:00",
    capacity: 10,
    pricePerHour: 25,
    isRecurring: false,
    recurringDays: [],
    isBlocked: false,
    blockReason: "",
  });

  // Auto-generation settings
  const [autoGenSettings, setAutoGenSettings] = useState({
    startTime: "08:00",
    endTime: "22:00",
    interval: "60",
    capacity: 10,
    pricePerHour: 25,
    selectedDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  });

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  useEffect(() => {}, []);

  useEffect(() => {
    if (selectedFacilityId && currentDate) {
      loadTimeSlots();
    }
  }, [selectedFacilityId, currentDate]);

  useEffect(() => {
    // Set default values when facility is selected
    if (selectedFacility) {
      setSlotForm((prev) => ({
        ...prev,
        capacity: selectedFacility.capacity,
        pricePerHour: selectedFacility.pricePerHour,
      }));
      setAutoGenSettings((prev) => ({
        ...prev,
        capacity: selectedFacility.capacity,
        pricePerHour: selectedFacility.pricePerHour,
      }));
    }
  }, [selectedFacility]);

  const loadTimeSlots = async () => {
    if (!selectedFacilityId || !currentDate) return;

    try {
      await fetchFacilityAvailability(
        selectedFacilityId,
        currentDate,
        currentDate
      );
      const availability = facilityAvailability[selectedFacilityId]?.[0];
      if (availability) {
        setTimeSlots(availability.timeSlots || []);
      }
    } catch (error) {
      console.error("Failed to load time slots:", error);
    }
  };

  const openSlotDialog = (slot?: TimeSlot) => {
    if (slot) {
      setEditingSlot(slot);
      const startTime = format(new Date(slot.startTime), "HH:mm");
      const endTime = format(new Date(slot.endTime), "HH:mm");
      setSlotForm({
        startTime,
        endTime,
        capacity: slot.capacity,
        pricePerHour: slot.pricePerHour,
        isRecurring: false,
        recurringDays: [],
        isBlocked: slot.isBlocked,
        blockReason: slot.blockReason || "",
      });
    } else {
      setEditingSlot(null);
      setSlotForm({
        startTime: "09:00",
        endTime: "10:00",
        capacity: selectedFacility?.capacity || 10,
        pricePerHour: selectedFacility?.pricePerHour || 25,
        isRecurring: false,
        recurringDays: [],
        isBlocked: false,
        blockReason: "",
      });
    }
    setIsSlotDialogOpen(true);
  };

  const closeSlotDialog = () => {
    setIsSlotDialogOpen(false);
    setEditingSlot(null);
  };

  const handleSaveSlot = async () => {
    if (!selectedFacilityId || !currentDate) return;

    try {
      // Create time slot data
      const baseDate = new Date(currentDate);
      const startDateTime = new Date(`${currentDate}T${slotForm.startTime}`);
      const endDateTime = new Date(`${currentDate}T${slotForm.endTime}`);

      const newSlot: Partial<TimeSlot> = {
        facilityId: selectedFacilityId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        capacity: slotForm.capacity,
        availableSpots: slotForm.capacity,
        pricePerHour: slotForm.pricePerHour,
        isAvailable: !slotForm.isBlocked,
        isBlocked: slotForm.isBlocked,
        blockReason: slotForm.blockReason,
      };

      // Here you would call your API to save the time slot
      console.log("Saving time slot:", newSlot);

      // For now, just update local state
      if (editingSlot) {
        setTimeSlots((prev) =>
          prev.map((slot) =>
            slot.id === editingSlot.id
              ? ({ ...slot, ...newSlot } as TimeSlot)
              : slot
          )
        );
      } else {
        const id = `slot-${Date.now()}`;
        setTimeSlots((prev) => [...prev, { ...newSlot, id } as TimeSlot]);
      }

      closeSlotDialog();
    } catch (error) {
      console.error("Failed to save time slot:", error);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      // Here you would call your API to delete the time slot
      console.log("Deleting time slot:", slotId);

      // For now, just update local state
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (error) {
      console.error("Failed to delete time slot:", error);
    }
  };

  const generateTimeSlots = () => {
    const {
      startTime,
      endTime,
      interval,
      capacity,
      pricePerHour,
      selectedDays,
    } = autoGenSettings;

    if (!selectedFacilityId) return;

    const generatedSlots: TimeSlot[] = [];
    const intervalMinutes = parseInt(interval);

    selectedDays.forEach((day) => {
      const dayIndex = DAYS_OF_WEEK.findIndex((d) => d.value === day);
      const slotDate = new Date(currentDate);

      // Adjust date to the selected day of week if needed
      const currentDayIndex = slotDate.getDay();
      const targetDayIndex = dayIndex === 6 ? 0 : dayIndex + 1; // Convert to JS day index
      const dayDiff = targetDayIndex - currentDayIndex;
      slotDate.setDate(slotDate.getDate() + dayDiff);

      const startDateTime = new Date(
        `${format(slotDate, "yyyy-MM-dd")}T${startTime}`
      );
      const endDateTime = new Date(
        `${format(slotDate, "yyyy-MM-dd")}T${endTime}`
      );

      let currentSlotStart = new Date(startDateTime);

      while (currentSlotStart < endDateTime) {
        const currentSlotEnd = addMinutes(currentSlotStart, intervalMinutes);

        if (currentSlotEnd <= endDateTime) {
          const slot: TimeSlot = {
            id: `generated-${Date.now()}-${Math.random()}`,
            facilityId: selectedFacilityId,
            startTime: currentSlotStart.toISOString(),
            endTime: currentSlotEnd.toISOString(),
            capacity,
            availableSpots: capacity,
            pricePerHour,
            isAvailable: true,
            isBlocked: false,
          };

          generatedSlots.push(slot);
        }

        currentSlotStart = new Date(currentSlotEnd);
      }
    });

    // Replace existing slots for the current date
    setTimeSlots(generatedSlots);
  };

  const copySlots = (direction: "previous" | "next") => {
    // Logic to copy time slots from previous/next day
    console.log(`Copying slots from ${direction} day`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Time Slot Management
          </h2>
          <p className="text-muted-foreground">
            Configure facility availability and time slots.
          </p>
        </div>
        <Button onClick={() => openSlotDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      {/* Facility and Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
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
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
          </div>

          {selectedFacility && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Facility Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <p className="font-medium">
                    {selectedFacility.capacity} people
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Default Rate:</span>
                  <p className="font-medium">
                    ${selectedFacility.pricePerHour}/hour
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      selectedFacility.status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedFacility.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">
                    {selectedFacility.type.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFacilityId && (
        <Tabs defaultValue="slots" className="space-y-4">
          <TabsList>
            <TabsTrigger value="slots">Time Slots</TabsTrigger>
            <TabsTrigger value="generate">Auto Generate</TabsTrigger>
          </TabsList>

          {/* Time Slots Tab */}
          <TabsContent value="slots" className="space-y-4">
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copySlots("previous")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy from Previous Day
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copySlots("next")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy from Next Day
              </Button>
            </div>

            {/* Time Slots List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Slots for{" "}
                  {format(new Date(currentDate), "EEEE, MMMM d, yyyy")}
                </CardTitle>
                <CardDescription>
                  {timeSlots.length} slot(s) configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">
                      Loading time slots...
                    </div>
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">
                      No time slots configured
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Add time slots manually or use auto-generation.
                    </p>
                    <Button className="mt-4" onClick={() => openSlotDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Time Slot
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots
                        .sort(
                          (a, b) =>
                            new Date(a.startTime).getTime() -
                            new Date(b.startTime).getTime()
                        )
                        .map((slot) => {
                          const duration =
                            (new Date(slot.endTime).getTime() -
                              new Date(slot.startTime).getTime()) /
                            (1000 * 60);

                          return (
                            <TableRow key={slot.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {format(new Date(slot.startTime), "h:mm a")}{" "}
                                    - {format(new Date(slot.endTime), "h:mm a")}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {duration} min
                                </span>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p>
                                    {slot.availableSpots}/{slot.capacity}
                                  </p>
                                  <span className="text-xs text-muted-foreground">
                                    available
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">
                                  ${slot.pricePerHour}/hr
                                </p>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    slot.isBlocked
                                      ? "destructive"
                                      : slot.isAvailable
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {slot.isBlocked
                                    ? "Blocked"
                                    : slot.isAvailable
                                    ? "Available"
                                    : "Unavailable"}
                                </Badge>
                                {slot.isBlocked && slot.blockReason && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {slot.blockReason}
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openSlotDialog(slot)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteSlot(slot.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auto Generate Tab */}
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto Generate Time Slots</CardTitle>
                <CardDescription>
                  Automatically create time slots based on your configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="autoStartTime">Start Time</Label>
                    <Input
                      id="autoStartTime"
                      type="time"
                      value={autoGenSettings.startTime}
                      onChange={(e) =>
                        setAutoGenSettings((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="autoEndTime">End Time</Label>
                    <Input
                      id="autoEndTime"
                      type="time"
                      value={autoGenSettings.endTime}
                      onChange={(e) =>
                        setAutoGenSettings((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="interval">Time Interval</Label>
                    <Select
                      value={autoGenSettings.interval}
                      onValueChange={(value) =>
                        setAutoGenSettings((prev) => ({
                          ...prev,
                          interval: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_INTERVALS.map((interval) => (
                          <SelectItem
                            key={interval.value}
                            value={interval.value}
                          >
                            {interval.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="autoCapacity">Capacity</Label>
                    <Input
                      id="autoCapacity"
                      type="number"
                      min="1"
                      value={autoGenSettings.capacity}
                      onChange={(e) =>
                        setAutoGenSettings((prev) => ({
                          ...prev,
                          capacity: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="autoPrice">Price per Hour</Label>
                    <Input
                      id="autoPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={autoGenSettings.pricePerHour}
                      onChange={(e) =>
                        setAutoGenSettings((prev) => ({
                          ...prev,
                          pricePerHour: parseFloat(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={day.value}
                          checked={autoGenSettings.selectedDays.includes(
                            day.value
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAutoGenSettings((prev) => ({
                                ...prev,
                                selectedDays: [...prev.selectedDays, day.value],
                              }));
                            } else {
                              setAutoGenSettings((prev) => ({
                                ...prev,
                                selectedDays: prev.selectedDays.filter(
                                  (d) => d !== day.value
                                ),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={day.value} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will replace any existing time slots for the selected
                    date and days.
                  </AlertDescription>
                </Alert>

                <Button onClick={generateTimeSlots} className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Generate Time Slots
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Time Slot Dialog */}
      <Dialog open={isSlotDialogOpen} onOpenChange={closeSlotDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slotStartTime">Start Time</Label>
                <Input
                  id="slotStartTime"
                  type="time"
                  value={slotForm.startTime}
                  onChange={(e) =>
                    setSlotForm((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="slotEndTime">End Time</Label>
                <Input
                  id="slotEndTime"
                  type="time"
                  value={slotForm.endTime}
                  onChange={(e) =>
                    setSlotForm((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slotCapacity">Capacity</Label>
                <Input
                  id="slotCapacity"
                  type="number"
                  min="1"
                  value={slotForm.capacity}
                  onChange={(e) =>
                    setSlotForm((prev) => ({
                      ...prev,
                      capacity: parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="slotPrice">Price per Hour</Label>
                <Input
                  id="slotPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={slotForm.pricePerHour}
                  onChange={(e) =>
                    setSlotForm((prev) => ({
                      ...prev,
                      pricePerHour: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isBlocked"
                checked={slotForm.isBlocked}
                onCheckedChange={(checked) =>
                  setSlotForm((prev) => ({ ...prev, isBlocked: checked }))
                }
              />
              <Label htmlFor="isBlocked">Block this time slot</Label>
            </div>

            {slotForm.isBlocked && (
              <div>
                <Label htmlFor="blockReason">Block Reason</Label>
                <Input
                  id="blockReason"
                  placeholder="e.g., Maintenance, Private event"
                  value={slotForm.blockReason}
                  onChange={(e) =>
                    setSlotForm((prev) => ({
                      ...prev,
                      blockReason: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeSlotDialog}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveSlot}>
              <Save className="h-4 w-4 mr-2" />
              {editingSlot ? "Update" : "Create"} Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
