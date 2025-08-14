import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Clock,
  X,
  Download,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { format, subDays, addDays } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { useFacilityStore } from "@/store/facilityStore";
import { useUserStore } from "@/store/userStore";
import {
  BookingStatus,
  BookingType,
  PaymentStatus,
  BookingFilters,
} from "@/lib/types/booking";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface BookingSearchFiltersProps {
  onFiltersChange?: (filters: Partial<BookingFilters>) => void;
  onExport?: () => void;
  className?: string;
}

interface DateRange {
  from?: Date;
  to?: Date;
}

const BOOKING_STATUSES: { value: BookingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "recurring", label: "Recurring" },
  { value: "event", label: "Event" },
  { value: "maintenance", label: "Maintenance" },
  { value: "blocked", label: "Blocked" },
];

const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
];

const DATE_PRESETS = [
  { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
  {
    label: "Yesterday",
    getValue: () => ({
      from: subDays(new Date(), 1),
      to: subDays(new Date(), 1),
    }),
  },
  {
    label: "Last 7 days",
    getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    label: "This month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: start, to: new Date() };
    },
  },
  {
    label: "Next 7 days",
    getValue: () => ({ from: new Date(), to: addDays(new Date(), 7) }),
  },
];

const SORT_OPTIONS = [
  { value: "date_asc", label: "Date (Oldest First)" },
  { value: "date_desc", label: "Date (Newest First)" },
  { value: "amount_asc", label: "Amount (Low to High)" },
  { value: "amount_desc", label: "Amount (High to Low)" },
  { value: "status", label: "Status" },
  { value: "facility", label: "Facility" },
  { value: "customer", label: "Customer" },
];

export function BookingSearchFilters({
  onFiltersChange,
  onExport,
  className,
}: BookingSearchFiltersProps) {
  const { filters, setFilters } = useBookingStore();
  const { facilities } = useFacilityStore();
  const { users } = useUserStore();

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedStatuses, setSelectedStatuses] = useState<BookingStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<BookingType[]>([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<
    PaymentStatus[]
  >([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [participantRange, setParticipantRange] = useState({
    min: "",
    max: "",
  });
  const [sortBy, setSortBy] = useState("date_desc");
  const [includeRecurring, setIncludeRecurring] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Derived states
  const activeFilterCount = [
    searchTerm,
    selectedStatuses.length > 0,
    selectedTypes.length > 0,
    selectedPaymentStatuses.length > 0,
    selectedFacilities.length > 0,
    selectedCustomers.length > 0,
    dateRange.from || dateRange.to,
    amountRange.min || amountRange.max,
    participantRange.min || participantRange.max,
  ].filter(Boolean).length;

  useEffect(() => {}, []);

  useEffect(() => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    selectedStatuses,
    selectedTypes,
    selectedPaymentStatuses,
    selectedFacilities,
    selectedCustomers,
    dateRange,
    amountRange,
    participantRange,
    sortBy,
    includeRecurring,
  ]);

  const applyFilters = () => {
    const newFilters: Partial<BookingFilters> = {
      search: searchTerm || undefined,
      status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
      type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
      paymentStatus:
        selectedPaymentStatuses.length === 1
          ? selectedPaymentStatuses[0]
          : undefined,
      facilityId:
        selectedFacilities.length === 1 ? selectedFacilities[0] : undefined,
      customerId:
        selectedCustomers.length === 1 ? selectedCustomers[0] : undefined,
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString(),
      minAmount: amountRange.min ? parseFloat(amountRange.min) : undefined,
      maxAmount: amountRange.max ? parseFloat(amountRange.max) : undefined,
      minParticipants: participantRange.min
        ? parseInt(participantRange.min)
        : undefined,
      maxParticipants: participantRange.max
        ? parseInt(participantRange.max)
        : undefined,
      sortBy,
      includeRecurring,
    };

    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStatuses([]);
    setSelectedTypes([]);
    setSelectedPaymentStatuses([]);
    setSelectedFacilities([]);
    setSelectedCustomers([]);
    setDateRange({});
    setAmountRange({ min: "", max: "" });
    setParticipantRange({ min: "", max: "" });
    setSortBy("date_desc");
    setIncludeRecurring(false);
  };

  const handleStatusToggle = (status: BookingStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleTypeToggle = (type: BookingType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handlePaymentStatusToggle = (status: PaymentStatus) => {
    setSelectedPaymentStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleDatePreset = (preset: (typeof DATE_PRESETS)[0]) => {
    const range = preset.getValue();
    setDateRange(range);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, booking title, or facility..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    {/* Quick Status Filters */}
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {BOOKING_STATUSES.map((status) => (
                          <Badge
                            key={status.value}
                            variant={
                              selectedStatuses.includes(status.value)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => handleStatusToggle(status.value)}
                          >
                            {status.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Date Range Presets */}
                    <div>
                      <Label className="text-sm font-medium">Date Range</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {DATE_PRESETS.map((preset) => (
                          <Button
                            key={preset.label}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDatePreset(preset)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Advanced Toggle */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="advanced">Advanced Filters</Label>
                      <Switch
                        id="advanced"
                        checked={showAdvanced}
                        onCheckedChange={setShowAdvanced}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.value.endsWith("_asc") ? (
                          <SortAsc className="h-4 w-4" />
                        ) : option.value.endsWith("_desc") ? (
                          <SortDesc className="h-4 w-4" />
                        ) : null}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {onExport && (
                <Button variant="outline" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}

              {activeFilterCount > 0 && (
                <Button variant="ghost" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            <CardDescription>
              Fine-tune your search with additional criteria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Filters */}
            <div>
              <Label className="text-sm font-medium">Booking Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {BOOKING_TYPES.map((type) => (
                  <Badge
                    key={type.value}
                    variant={
                      selectedTypes.includes(type.value) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleTypeToggle(type.value)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <Label className="text-sm font-medium">Payment Status</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PAYMENT_STATUSES.map((status) => (
                  <Badge
                    key={status.value}
                    variant={
                      selectedPaymentStatuses.includes(status.value)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handlePaymentStatusToggle(status.value)}
                  >
                    {status.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div>
              <Label className="text-sm font-medium">Facilities</Label>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`facility-${facility.id}`}
                      checked={selectedFacilities.includes(facility.id)}
                      onCheckedChange={() => handleFacilityToggle(facility.id)}
                    />
                    <Label
                      htmlFor={`facility-${facility.id}`}
                      className="text-sm"
                    >
                      {facility.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <Label className="text-sm font-medium">Amount Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={amountRange.min}
                    onChange={(e) =>
                      setAmountRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={amountRange.max}
                    onChange={(e) =>
                      setAmountRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Participant Range */}
            <div>
              <Label className="text-sm font-medium">
                Number of Participants
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Input
                    type="number"
                    placeholder="Min participants"
                    value={participantRange.min}
                    onChange={(e) =>
                      setParticipantRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max participants"
                    value={participantRange.max}
                    onChange={(e) =>
                      setParticipantRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Custom Date Range */}
            <div>
              <Label className="text-sm font-medium">Custom Date Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Input
                    type="date"
                    value={
                      dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""
                    }
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={
                      dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""
                    }
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        to: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRecurring"
                  checked={includeRecurring}
                  onCheckedChange={setIncludeRecurring}
                />
                <Label htmlFor="includeRecurring" className="text-sm">
                  Include recurring booking instances
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary">
                      Search: "{searchTerm}"
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setSearchTerm("")}
                      />
                    </Badge>
                  )}
                  {selectedStatuses.map((status) => (
                    <Badge key={status} variant="secondary">
                      Status:{" "}
                      {BOOKING_STATUSES.find((s) => s.value === status)?.label}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => handleStatusToggle(status)}
                      />
                    </Badge>
                  ))}
                  {selectedFacilities.map((facilityId) => {
                    const facility = facilities.find(
                      (f) => f.id === facilityId
                    );
                    return facility ? (
                      <Badge key={facilityId} variant="secondary">
                        Facility: {facility.name}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => handleFacilityToggle(facilityId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  {(dateRange.from || dateRange.to) && (
                    <Badge variant="secondary">
                      Date:{" "}
                      {dateRange.from
                        ? format(dateRange.from, "MMM d")
                        : "Start"}{" "}
                      - {dateRange.to ? format(dateRange.to, "MMM d") : "End"}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => setDateRange({})}
                      />
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
