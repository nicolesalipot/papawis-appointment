export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type BookingType = 'regular' | 'recurring' | 'event' | 'maintenance' | 'blocked';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';

export interface TimeSlot {
  id: string;
  facilityId: string;
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  capacity: number;
  availableSpots: number;
  pricePerHour: number;
  isAvailable: boolean;
  isBlocked: boolean;
  blockReason?: string;
}

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  // Booking details
  title: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string;   // ISO 8601 format
  duration: number;  // in minutes
  participants: number;

  // Status and type
  status: BookingStatus;
  type: BookingType;

  // Pricing
  pricePerHour: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;

  // Recurring booking info
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  recurrenceEnd?: string;
  parentBookingId?: string; // For recurring bookings
  recurringBookingIds?: string[]; // Parent booking references

  // Metadata
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  source: 'admin' | 'customer' | 'api' | 'import';

  // System fields
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
}

export interface BookingConflict {
  conflictingBookingId: string;
  conflictType: 'overlap' | 'capacity' | 'facility_unavailable' | 'outside_hours';
  message: string;
  conflictingTimeSlot?: TimeSlot;
}

export interface BookingValidation {
  isValid: boolean;
  conflicts: BookingConflict[];
  warnings: string[];
  suggestions?: string[];
}

export interface FacilityAvailability {
  facilityId: string;
  date: string; // YYYY-MM-DD format
  timeSlots: TimeSlot[];
  operatingHours: {
    open: string;  // HH:mm format
    close: string; // HH:mm format
  };
  isHoliday: boolean;
  specialHours?: {
    open: string;
    close: string;
    reason: string;
  };
}

export interface BookingFilters {
  search?: string;
  facilityId?: string;
  customerId?: string;
  status?: BookingStatus | 'all';
  type?: BookingType | 'all';
  paymentStatus?: PaymentStatus | 'all';
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  source?: 'admin' | 'customer' | 'api' | 'import' | 'all';
}

export interface BookingFormData {
  facilityId: string;
  customerId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  participants: number;
  type: BookingType;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  recurrenceEnd?: string;
  notes?: string;
  tags?: string[];
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface BookingListResponse {
  bookings: Booking[];
  pagination: PaginationInfo;
  filters: BookingFilters;
}

export interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
  byType: {
    regular: number;
    recurring: number;
    event: number;
    maintenance: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number; // percentage
  };
  utilization: {
    overall: number; // percentage
    thisWeek: number;
    lastWeek: number;
  };
  topFacilities: Array<{
    facilityId: string;
    facilityName: string;
    bookingCount: number;
    revenue: number;
  }>;
}

export interface CalendarEvent {
  id: string;
  bookingId: string;
  title: string;
  start: Date;
  end: Date;
  facilityId: string;
  facilityName: string;
  customerName: string;
  status: BookingStatus;
  type: BookingType;
  participants: number;
  color: string; // For calendar display
}

export interface CalendarView {
  view: 'month' | 'week' | 'day' | 'agenda';
  currentDate: Date;
  selectedFacilities: string[];
  showCancelled: boolean;
  showCompleted: boolean;
}

// Time slot configuration
export interface TimeSlotConfig {
  facilityId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  slotDuration: number; // in minutes
  slotInterval: number; // in minutes (gap between slots)
  capacity: number;
  pricePerHour: number;
  isActive: boolean;
}

export interface BookingRule {
  id: string;
  name: string;
  description: string;
  facilityId?: string; // null for global rules
  ruleType: 'advance_booking' | 'cancellation' | 'duration' | 'capacity' | 'user_limit';
  isActive: boolean;

  // Rule parameters
  minAdvanceHours?: number;
  maxAdvanceHours?: number;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  maxCancellationHours?: number;
  maxBookingsPerUser?: number;
  maxBookingsPerDay?: number;

  // Applicable conditions
  userRoles?: string[];
  timeSlots?: string[];
  daysOfWeek?: number[];

  createdAt: string;
  updatedAt: string;
}

// Booking system configuration
export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  completed: { label: 'Completed', color: 'blue' },
  no_show: { label: 'No Show', color: 'gray' },
};

export const BOOKING_TYPE_CONFIG: Record<BookingType, { label: string; color: string }> = {
  regular: { label: 'Regular', color: 'blue' },
  recurring: { label: 'Recurring', color: 'purple' },
  event: { label: 'Event', color: 'orange' },
  maintenance: { label: 'Maintenance', color: 'red' },
  blocked: { label: 'Blocked', color: 'gray' },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' },
  partial: { label: 'Partial', color: 'orange' },
  refunded: { label: 'Refunded', color: 'blue' },
  failed: { label: 'Failed', color: 'red' },
};
