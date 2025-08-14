import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Grid3x3,
  Calendar1,
  CalendarDays,
  Plus,
  Filter,
  Eye,
  Edit3,
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { CalendarView, CalendarEvent, Booking } from "@/lib/types/booking";
import {
  BOOKING_STATUS_CONFIG,
  BOOKING_TYPE_CONFIG,
} from "@/lib/types/booking";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingCalendarProps {
  onBookingClick?: (booking: Booking) => void;
  onCreateBooking?: (date: Date, timeSlot?: string) => void;
  onEditBooking?: (booking: Booking) => void;
}

export function BookingCalendar({
  onBookingClick,
  onCreateBooking,
  onEditBooking,
}: BookingCalendarProps) {
  const {
    calendarEvents,
    calendarView,
    isLoading,
    fetchCalendarEvents,
    setCalendarView,
  } = useBookingStore();

  const { facilities } = useFacilityStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  useEffect(() => {
    // Fetch calendar events for the current view
    const startDate = getViewStartDate(
      calendarView.currentDate,
      calendarView.view
    );
    const endDate = getViewEndDate(calendarView.currentDate, calendarView.view);

    fetchCalendarEvents(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );
  }, [calendarView, fetchCalendarEvents]);

  const getViewStartDate = (date: Date, view: CalendarView["view"]): Date => {
    const start = new Date(date);
    switch (view) {
      case "month":
        start.setDate(1);
        start.setDate(start.getDate() - start.getDay()); // Start from Sunday
        return start;
      case "week":
        start.setDate(start.getDate() - start.getDay()); // Start from Sunday
        return start;
      case "day":
        return start;
      default:
        return start;
    }
  };

  const getViewEndDate = (date: Date, view: CalendarView["view"]): Date => {
    const end = new Date(date);
    switch (view) {
      case "month":
        end.setMonth(end.getMonth() + 1);
        end.setDate(0); // Last day of current month
        end.setDate(end.getDate() + (6 - end.getDay())); // End on Saturday
        return end;
      case "week":
        end.setDate(end.getDate() + 6); // End on Saturday
        return end;
      case "day":
        return end;
      default:
        return end;
    }
  };

  const navigateCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(calendarView.currentDate);

    switch (calendarView.view) {
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
    }

    setCalendarView({ currentDate: newDate });
  };

  const handleViewChange = (view: CalendarView["view"]) => {
    setCalendarView({ view });
  };

  const handleFacilityFilter = (facilityId: string) => {
    const currentFilters = calendarView.selectedFacilities;
    const newFilters = currentFilters.includes(facilityId)
      ? currentFilters.filter((id) => id !== facilityId)
      : [...currentFilters, facilityId];

    setCalendarView({ selectedFacilities: newFilters });
  };

  const formatViewTitle = (): string => {
    const date = calendarView.currentDate;
    switch (calendarView.view) {
      case "month":
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "week":
        const weekStart = getViewStartDate(date, "week");
        const weekEnd = getViewEndDate(date, "week");
        return `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      default:
        return "";
    }
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForTimeSlot = (date: Date, hour: number): CalendarEvent[] => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.toDateString() === date.toDateString() &&
        eventDate.getHours() === hour
      );
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onCreateBooking) {
      onCreateBooking(date);
    }
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
    if (onCreateBooking) {
      onCreateBooking(date, timeSlot);
    }
  };

  const renderMonthView = () => {
    const startDate = getViewStartDate(calendarView.currentDate, "month");
    const endDate = getViewEndDate(calendarView.currentDate, "month");
    const days = [];

    // Generate all days for the month view
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      days.push(new Date(d));
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-slate-50 p-2 text-center text-sm font-medium text-slate-600"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          const isCurrentMonth =
            date.getMonth() === calendarView.currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={index}
              className={cn(
                "bg-white min-h-24 p-1 cursor-pointer hover:bg-slate-50 transition-colors",
                !isCurrentMonth && "bg-slate-50 text-slate-400"
              )}
              onClick={() => handleDateClick(date)}
            >
              <div
                className={cn(
                  "text-sm font-medium mb-1",
                  isToday &&
                    "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center",
                  isSelected &&
                    !isToday &&
                    "bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center"
                )}
              >
                {date.getDate()}
              </div>

              <div className="space-y-px">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: event.color + "20",
                      color: event.color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookingClick) {
                        // Find the full booking data
                        // This would require additional store method
                      }
                    }}
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = getViewStartDate(calendarView.currentDate, "week");
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 10 PM

    return (
      <div className="flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-8 gap-px bg-slate-200">
          <div className="bg-slate-50 p-3"></div>
          {days.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={cn(
                  "bg-white p-3 text-center",
                  isToday && "bg-blue-50"
                )}
              >
                <div className="text-sm font-medium text-slate-600">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={cn(
                    "text-lg font-bold mt-1",
                    isToday &&
                      "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                  )}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-8 gap-px bg-slate-200 flex-1">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="bg-slate-50 p-2 text-right text-sm text-slate-600 border-r">
                {hour === 12
                  ? "12 PM"
                  : hour > 12
                  ? `${hour - 12} PM`
                  : `${hour} AM`}
              </div>
              {days.map((day, dayIndex) => {
                const timeSlotEvents = getEventsForTimeSlot(day, hour);
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className="bg-white min-h-16 p-1 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors relative"
                    onClick={() => handleTimeSlotClick(day, hour)}
                  >
                    {timeSlotEvents.map((event) => (
                      <div
                        key={event.id}
                        className="absolute inset-1 text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: event.color + "20",
                          color: event.color,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBookingClick) {
                            // Find the full booking data
                          }
                        }}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-75">
                          {event.customerName}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 10 PM
    const currentDate = calendarView.currentDate;

    return (
      <div className="space-y-px">
        {hours.map((hour) => {
          const timeSlotEvents = getEventsForTimeSlot(currentDate, hour);
          return (
            <div
              key={hour}
              className="flex bg-white border border-slate-200 rounded-lg min-h-20 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleTimeSlotClick(currentDate, hour)}
            >
              <div className="w-20 p-3 text-right text-sm text-slate-600 border-r border-slate-200">
                {hour === 12
                  ? "12 PM"
                  : hour > 12
                  ? `${hour - 12} PM`
                  : `${hour} AM`}
              </div>
              <div className="flex-1 p-3 relative">
                {timeSlotEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 rounded-lg mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: event.color + "20",
                      color: event.color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookingClick) {
                        // Find the full booking data
                      }
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm opacity-75">
                      {event.facilityName}
                    </div>
                    <div className="text-sm opacity-75">
                      {event.customerName}
                    </div>
                    <div className="text-xs opacity-60">
                      {event.participants} participant
                      {event.participants !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
                {timeSlotEvents.length === 0 && (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <Plus className="h-4 w-4 mr-1" />
                    Click to add booking
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      {/* Calendar Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              {formatViewTitle()}
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateCalendar("prev")}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateCalendar("next")}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Selector */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                onClick={() => handleViewChange("month")}
                variant={calendarView.view === "month" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3 text-sm"
              >
                <Grid3x3 className="h-3 w-3 mr-1" />
                Month
              </Button>
              <Button
                onClick={() => handleViewChange("week")}
                variant={calendarView.view === "week" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3 text-sm"
              >
                <CalendarDays className="h-3 w-3 mr-1" />
                Week
              </Button>
              <Button
                onClick={() => handleViewChange("day")}
                variant={calendarView.view === "day" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3 text-sm"
              >
                <Calendar1 className="h-3 w-3 mr-1" />
                Day
              </Button>
            </div>

            {/* Today Button */}
            <Button
              onClick={() => setCalendarView({ currentDate: new Date() })}
              variant="outline"
              size="sm"
              className="h-8"
            >
              Today
            </Button>
          </div>
        </div>

        {/* Facility Filters */}
        {facilities.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Facilities:</span>
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility) => (
                <Badge
                  key={facility.id}
                  variant={
                    calendarView.selectedFacilities.includes(facility.id)
                      ? "default"
                      : "secondary"
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleFacilityFilter(facility.id)}
                >
                  {facility.name}
                </Badge>
              ))}
              {calendarView.selectedFacilities.length > 0 && (
                <Button
                  onClick={() => setCalendarView({ selectedFacilities: [] })}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      {/* Calendar Content */}
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ) : (
          <div>
            {calendarView.view === "month" && renderMonthView()}
            {calendarView.view === "week" && renderWeekView()}
            {calendarView.view === "day" && renderDayView()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
